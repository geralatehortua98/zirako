import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"

// GET /api/users - Obtener perfil del usuario actual
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

    const result = await query<any>(
      `SELECT id, email, nombre, telefono, ciudad, direccion, foto_perfil, puntos, rol, email_verificado, created_at
       FROM usuarios WHERE id = ?`,
      [payload.userId],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 })
    }

    const user = result.rows[0]

    // Obtener estadísticas
    const stats = await query<any>(
      `SELECT 
        (SELECT COUNT(*) FROM items WHERE usuario_id = ?) AS total_items,
        (SELECT COUNT(*) FROM items WHERE usuario_id = ? AND tipo = 'venta') AS items_venta,
        (SELECT COUNT(*) FROM items WHERE usuario_id = ? AND tipo = 'donacion') AS items_donacion,
        (SELECT COUNT(*) FROM items WHERE usuario_id = ? AND tipo = 'intercambio') AS items_intercambio,
        (SELECT COUNT(*) FROM intercambios WHERE usuario_propone_id = ? OR usuario_recibe_id = ?) AS total_intercambios,
        (SELECT COUNT(*) FROM favoritos WHERE usuario_id = ?) AS total_favoritos`,
      [payload.userId, payload.userId, payload.userId, payload.userId, payload.userId, payload.userId, payload.userId],
    )

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        estadisticas: stats.rows[0],
      },
    })
  } catch (error) {
    console.error("[API USERS] Error al obtener usuario:", error)
    return NextResponse.json({ success: false, error: "Error al obtener usuario" }, { status: 500 })
  }
}

// PUT /api/users - Actualizar perfil del usuario
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
    const { nombre, telefono, ciudad, direccion, foto_perfil } = body

    await query(
      `UPDATE usuarios SET 
        nombre = COALESCE(?, nombre),
        telefono = COALESCE(?, telefono),
        ciudad = COALESCE(?, ciudad),
        direccion = COALESCE(?, direccion),
        foto_perfil = COALESCE(?, foto_perfil)
      WHERE id = ?`,
      [nombre, telefono, ciudad, direccion, foto_perfil, payload.userId],
    )

    return NextResponse.json({ success: true, message: "Perfil actualizado" })
  } catch (error) {
    console.error("[API USERS] Error al actualizar usuario:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar usuario" }, { status: 500 })
  }
}
