import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { sendExchangeRequestEmail } from "@/lib/email"
import { cookies } from "next/headers"

// GET /api/exchanges - Obtener intercambios del usuario
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ success: false, error: "Token inválido" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let sql = `
      SELECT 
        i.*,
        io.titulo AS titulo_ofrecido,
        io.imagenes AS imagenes_ofrecido,
        io.condicion AS condicion_ofrecido,
        is2.titulo AS titulo_solicitado,
        is2.imagenes AS imagenes_solicitado,
        is2.condicion AS condicion_solicitado,
        up.nombre AS nombre_propone,
        ur.nombre AS nombre_recibe
      FROM intercambios i
      JOIN items io ON i.item_ofrecido_id = io.id
      JOIN items is2 ON i.item_solicitado_id = is2.id
      JOIN usuarios up ON i.usuario_propone_id = up.id
      JOIN usuarios ur ON i.usuario_recibe_id = ur.id
      WHERE i.usuario_propone_id = ? OR i.usuario_recibe_id = ?
    `
    const params: any[] = [payload.userId, payload.userId]

    if (status) {
      sql += " AND i.estado = ?"
      params.push(status)
    }

    sql += " ORDER BY i.created_at DESC"

    const result = await query<any>(sql, params)

    const exchanges = result.rows.map((ex) => ({
      ...ex,
      imagenes_ofrecido:
        typeof ex.imagenes_ofrecido === "string" ? JSON.parse(ex.imagenes_ofrecido) : ex.imagenes_ofrecido,
      imagenes_solicitado:
        typeof ex.imagenes_solicitado === "string" ? JSON.parse(ex.imagenes_solicitado) : ex.imagenes_solicitado,
    }))

    return NextResponse.json({ success: true, data: exchanges })
  } catch (error) {
    console.error("[API EXCHANGES] Error al obtener intercambios:", error)
    return NextResponse.json({ success: false, error: "Error al obtener intercambios" }, { status: 500 })
  }
}

// POST /api/exchanges - Crear propuesta de intercambio
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ success: false, error: "Token inválido" }, { status: 401 })
    }

    const body = await request.json()
    const { item_ofrecido_id, item_solicitado_id, mensaje } = body

    if (!item_ofrecido_id || !item_solicitado_id) {
      return NextResponse.json({ success: false, error: "Debe seleccionar ambos artículos" }, { status: 400 })
    }

    // Verificar que el item ofrecido pertenece al usuario
    const itemOfrecido = await query<any>("SELECT usuario_id, titulo FROM items WHERE id = ?", [item_ofrecido_id])
    if (itemOfrecido.rows.length === 0 || itemOfrecido.rows[0].usuario_id !== payload.userId) {
      return NextResponse.json({ success: false, error: "El artículo ofrecido no te pertenece" }, { status: 403 })
    }

    // Obtener el dueño del item solicitado
    const itemSolicitado = await query<any>("SELECT usuario_id, titulo FROM items WHERE id = ?", [item_solicitado_id])
    if (itemSolicitado.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Artículo solicitado no encontrado" }, { status: 404 })
    }

    // Crear intercambio
    await query(
      `INSERT INTO intercambios (item_ofrecido_id, item_solicitado_id, usuario_propone_id, usuario_recibe_id, mensaje)
       VALUES (?, ?, ?, ?, ?)`,
      [item_ofrecido_id, item_solicitado_id, payload.userId, itemSolicitado.rows[0].usuario_id, mensaje || null],
    )

    try {
      const userRecibe = await query<any>("SELECT email, nombre FROM usuarios WHERE id = ?", [
        itemSolicitado.rows[0].usuario_id,
      ])
      if (userRecibe.rows.length > 0) {
        await sendExchangeRequestEmail(
          userRecibe.rows[0].email,
          userRecibe.rows[0].nombre,
          itemSolicitado.rows[0].titulo,
          payload.name,
          itemOfrecido.rows[0].titulo,
        )
        console.log("[API EXCHANGES] Notificación de intercambio enviada a:", userRecibe.rows[0].email)
      }
    } catch (emailError) {
      console.error("[API EXCHANGES] Error al enviar notificación:", emailError)
      // No bloquea la operación
    }

    return NextResponse.json({ success: true, message: "Propuesta de intercambio enviada" }, { status: 201 })
  } catch (error) {
    console.error("[API EXCHANGES] Error al crear intercambio:", error)
    return NextResponse.json({ success: false, error: "Error al crear intercambio" }, { status: 500 })
  }
}

// PUT /api/exchanges - Actualizar estado de intercambio
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ success: false, error: "Token inválido" }, { status: 401 })
    }

    const body = await request.json()
    const { id, estado } = body

    if (!id || !estado) {
      return NextResponse.json({ success: false, error: "ID y estado son requeridos" }, { status: 400 })
    }

    // Verificar que el usuario es parte del intercambio
    const intercambio = await query<any>("SELECT usuario_recibe_id FROM intercambios WHERE id = ?", [id])

    if (intercambio.rows.length === 0 || intercambio.rows[0].usuario_recibe_id !== payload.userId) {
      return NextResponse.json(
        { success: false, error: "No autorizado para modificar este intercambio" },
        { status: 403 },
      )
    }

    await query("UPDATE intercambios SET estado = ?, fecha_respuesta = NOW() WHERE id = ?", [estado, id])

    // Si se acepta, dar puntos a ambos usuarios
    if (estado === "aceptado" || estado === "completado") {
      const exchange = await query<any>("SELECT usuario_propone_id, usuario_recibe_id FROM intercambios WHERE id = ?", [
        id,
      ])
      await query("UPDATE usuarios SET puntos = puntos + 20 WHERE id IN (?, ?)", [
        exchange.rows[0].usuario_propone_id,
        exchange.rows[0].usuario_recibe_id,
      ])
    }

    return NextResponse.json({ success: true, message: "Intercambio actualizado" })
  } catch (error) {
    console.error("[API EXCHANGES] Error al actualizar intercambio:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar intercambio" }, { status: 500 })
  }
}
