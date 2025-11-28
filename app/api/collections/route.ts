import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"
import { sendCollectionConfirmationEmail } from "@/lib/email"

// GET /api/collections - Obtener recolecciones del usuario
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

    const result = await query<any>(`SELECT * FROM recolecciones WHERE usuario_id = ? ORDER BY created_at DESC`, [
      payload.userId,
    ])

    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error("[API COLLECTIONS] Error al obtener recolecciones:", error)
    return NextResponse.json({ success: false, error: "Error al obtener recolecciones" }, { status: 500 })
  }
}

// POST /api/collections - Programar recolección
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
    const { direccion, ciudad, fecha, horario, descripcion } = body

    if (!direccion || !ciudad || !fecha || !horario || !descripcion) {
      return NextResponse.json({ success: false, error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Convertir fecha ISO a formato MySQL
    const fechaProgramada = new Date(fecha).toISOString().split("T")[0]

    // Crear recolección
    const result = await query<any>(
      `INSERT INTO recolecciones (usuario_id, direccion, ciudad, fecha_programada, horario_preferido, descripcion, estado)
       VALUES (?, ?, ?, ?, ?, ?, 'pendiente')`,
      [payload.userId, direccion, ciudad, fechaProgramada, horario, descripcion],
    )

    const recoleccionId = (result as any).insertId

    // Dar puntos por programar recolección
    await query("UPDATE usuarios SET puntos = puntos + 15 WHERE id = ?", [payload.userId])

    const userResult = await query<any>("SELECT email, nombre FROM usuarios WHERE id = ?", [payload.userId])
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0]

      // Formatear fecha para el correo
      const fechaFormateada = new Date(fecha).toLocaleDateString("es-CO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      try {
        await sendCollectionConfirmationEmail(
          user.email,
          user.nombre,
          recoleccionId,
          fechaFormateada,
          horario,
          direccion,
          ciudad,
          descripcion,
        )
        console.log("[API COLLECTIONS] Correos de recolección enviados:", recoleccionId)
      } catch (emailError) {
        console.error("[API COLLECTIONS] Error al enviar emails:", emailError)
        // No fallar la creación si el email falla
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Recolección programada exitosamente",
        data: { id: recoleccionId },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[API COLLECTIONS] Error al programar recolección:", error)
    return NextResponse.json({ success: false, error: "Error al programar recolección" }, { status: 500 })
  }
}
