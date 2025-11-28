import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { sendEmail } from "@/lib/email"
import { cookies } from "next/headers"

// POST /api/contactar - Enviar correo al publicador de un artículo
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    // Obtener datos del body
    const body = await request.json()
    const {
      itemId,
      itemName,
      sellerEmail,
      sellerName,
      mensaje,
      contactadorNombre: nombreFromBody,
      contactadorEmail: emailFromBody,
    } = body

    if (!mensaje) {
      return NextResponse.json({ success: false, error: "El mensaje es requerido" }, { status: 400 })
    }

    let contactadorNombre = nombreFromBody || "Usuario de ZIRAKO"
    let contactadorEmail = emailFromBody || "noreply@zirako.co"
    let contactadorTelefono = ""
    let userId = null

    // Si hay token, obtener datos del usuario autenticado (prioridad sobre los del body)
    if (token) {
      const payload = verifyToken(token)
      if (payload) {
        userId = payload.userId
        const userResult = await query<any>("SELECT nombre, email, telefono FROM usuarios WHERE id = ?", [
          payload.userId,
        ])
        if (userResult.rows.length > 0) {
          contactadorNombre = userResult.rows[0].nombre
          contactadorEmail = userResult.rows[0].email
          contactadorTelefono = userResult.rows[0].telefono || ""
        }
      }
    }

    // Datos del destinatario (publicador del artículo)
    let destinatarioEmail = sellerEmail
    let destinatarioNombre = sellerName
    let itemTitulo = itemName
    let itemInfo = null

    // Si hay itemId, intentar obtener datos de la BD
    if (itemId && !isNaN(Number(itemId))) {
      try {
        const itemResult = await query<any>(
          `SELECT i.*, u.email as publicador_email, u.nombre as publicador_nombre 
           FROM items i 
           JOIN usuarios u ON i.usuario_id = u.id 
           WHERE i.id = ?`,
          [itemId],
        )

        if (itemResult.rows.length > 0) {
          itemInfo = itemResult.rows[0]
          destinatarioEmail = itemInfo.publicador_email
          destinatarioNombre = itemInfo.publicador_nombre
          itemTitulo = itemInfo.titulo
        }
      } catch (e) {
        console.log("[API CONTACTAR] No se pudo obtener item de BD, usando datos del body")
      }
    }

    // Enviar correo al publicador
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a5f3a 0%, #2d8659 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .item-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1a5f3a; }
            .contact-info { background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">♻️ ZIRAKO</div>
              <h2 style="margin: 0;">Nueva Consulta sobre tu Artículo</h2>
            </div>
            <div class="content">
              <h2>Hola ${destinatarioNombre},</h2>
              <p>Alguien está interesado en tu artículo publicado en ZIRAKO:</p>
              
              <div class="item-box">
                <h3 style="margin: 0 0 10px 0; color: #1a5f3a;">${itemTitulo}</h3>
              </div>

              <div class="contact-info">
                <h4 style="margin: 0 0 10px 0;">👤 Datos del interesado:</h4>
                <p style="margin: 5px 0;"><strong>Nombre:</strong> ${contactadorNombre}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${contactadorEmail}">${contactadorEmail}</a></p>
                ${contactadorTelefono ? `<p style="margin: 5px 0;"><strong>Teléfono:</strong> ${contactadorTelefono}</p>` : ""}
              </div>

              <div class="message-box">
                <h4 style="margin: 0 0 10px 0;">📝 Mensaje:</h4>
                <p style="margin: 0; white-space: pre-wrap;">${mensaje}</p>
              </div>

              <p><strong>Para responder:</strong> Puedes responder directamente a este correo o escribir a ${contactadorEmail}</p>
            </div>
            <div class="footer">
              <p>© 2025 ZIRAKO - Reutiliza con propósito</p>
              <p>Cali, Valle del Cauca, Colombia</p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendEmail({
      to: destinatarioEmail,
      subject: `[ZIRAKO] Nueva consulta sobre "${itemTitulo}"`,
      html,
      text: `Hola ${destinatarioNombre}, ${contactadorNombre} está interesado en tu artículo "${itemTitulo}". Mensaje: ${mensaje}. Contacto: ${contactadorEmail}`,
      replyTo: contactadorEmail,
    })

    // Si hay usuario autenticado e item válido, registrar el mensaje en la BD
    if (userId && itemInfo) {
      try {
        await query(`INSERT INTO mensajes (remitente_id, destinatario_id, item_id, contenido) VALUES (?, ?, ?, ?)`, [
          userId,
          itemInfo.usuario_id,
          itemId,
          mensaje,
        ])
      } catch (e) {
        console.log("[API CONTACTAR] Error al guardar mensaje en BD:", e)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Tu mensaje ha sido enviado al publicador",
    })
  } catch (error) {
    console.error("[API CONTACTAR] Error:", error)
    return NextResponse.json({ success: false, error: "Error al enviar el mensaje" }, { status: 500 })
  }
}
