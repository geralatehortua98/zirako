import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"

// GET /api/mensajes - Obtener conversaciones del usuario
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
    const otroUsuarioId = searchParams.get("con")

    if (otroUsuarioId) {
      // Obtener mensajes de una conversación específica
      const result = await query<any>(
        `SELECT m.*, 
          ur.nombre AS nombre_remitente,
          ud.nombre AS nombre_destinatario
         FROM mensajes m
         JOIN usuarios ur ON m.remitente_id = ur.id
         JOIN usuarios ud ON m.destinatario_id = ud.id
         WHERE (m.remitente_id = ? AND m.destinatario_id = ?)
            OR (m.remitente_id = ? AND m.destinatario_id = ?)
         ORDER BY m.created_at ASC`,
        [payload.userId, otroUsuarioId, otroUsuarioId, payload.userId],
      )

      // Marcar como leídos
      await query(
        "UPDATE mensajes SET leido = TRUE, fecha_leido = NOW() WHERE destinatario_id = ? AND remitente_id = ? AND leido = FALSE",
        [payload.userId, otroUsuarioId],
      )

      return NextResponse.json({ success: true, data: result.rows })
    } else {
      // Obtener lista de conversaciones
      const result = await query<any>(
        `SELECT DISTINCT
          CASE WHEN m.remitente_id = ? THEN m.destinatario_id ELSE m.remitente_id END AS otro_usuario_id,
          u.nombre AS nombre_otro_usuario,
          u.foto_perfil AS foto_otro_usuario,
          (SELECT contenido FROM mensajes m2 
           WHERE (m2.remitente_id = m.remitente_id AND m2.destinatario_id = m.destinatario_id)
              OR (m2.remitente_id = m.destinatario_id AND m2.destinatario_id = m.remitente_id)
           ORDER BY m2.created_at DESC LIMIT 1) AS ultimo_mensaje,
          (SELECT created_at FROM mensajes m2 
           WHERE (m2.remitente_id = m.remitente_id AND m2.destinatario_id = m.destinatario_id)
              OR (m2.remitente_id = m.destinatario_id AND m2.destinatario_id = m.remitente_id)
           ORDER BY m2.created_at DESC LIMIT 1) AS fecha_ultimo_mensaje,
          (SELECT COUNT(*) FROM mensajes m3 
           WHERE m3.destinatario_id = ? AND m3.leido = FALSE
             AND m3.remitente_id = CASE WHEN m.remitente_id = ? THEN m.destinatario_id ELSE m.remitente_id END) AS no_leidos
         FROM mensajes m
         JOIN usuarios u ON u.id = CASE WHEN m.remitente_id = ? THEN m.destinatario_id ELSE m.remitente_id END
         WHERE m.remitente_id = ? OR m.destinatario_id = ?
         ORDER BY fecha_ultimo_mensaje DESC`,
        [payload.userId, payload.userId, payload.userId, payload.userId, payload.userId, payload.userId],
      )

      return NextResponse.json({ success: true, data: result.rows })
    }
  } catch (error) {
    console.error("[API MENSAJES] Error al obtener mensajes:", error)
    return NextResponse.json({ success: false, error: "Error al obtener mensajes" }, { status: 500 })
  }
}

// POST /api/mensajes - Enviar mensaje
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
    const { destinatario_id, contenido, item_id } = body

    if (!destinatario_id || !contenido) {
      return NextResponse.json({ success: false, error: "Destinatario y contenido son requeridos" }, { status: 400 })
    }

    await query(
      `INSERT INTO mensajes (remitente_id, destinatario_id, item_id, contenido)
       VALUES (?, ?, ?, ?)`,
      [payload.userId, destinatario_id, item_id || null, contenido],
    )

    return NextResponse.json({ success: true, message: "Mensaje enviado" }, { status: 201 })
  } catch (error) {
    console.error("[API MENSAJES] Error al enviar mensaje:", error)
    return NextResponse.json({ success: false, error: "Error al enviar mensaje" }, { status: 500 })
  }
}
