import nodemailer from "nodemailer"

/**
 * CONFIGURACIÓN DE CORREO ELECTRÓNICO - ZIRAKO
 *
 * Los correos se ENVÍAN desde: geraldine@mi.com.co (SMTP real)
 * Los correos APARECEN como: noreply@zirako.co (header From)
 * Las notificaciones de soporte LLEGAN a: geraldine@mi.com.co
 */

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

// Crear transportador SMTP (singleton)
let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.mi.com.co",
      port: Number.parseInt(process.env.SMTP_PORT || "465"),
      secure: process.env.SMTP_SECURE === "true" || true,
      auth: {
        user: process.env.SMTP_USER || "geraldine@mi.com.co",
        pass: process.env.SMTP_PASSWORD || "Horoscopo12*",
      },
    })
  }
  return transporter
}

export async function sendEmail(options: EmailOptions) {
  try {
    const transporter = getTransporter()

    const info = await transporter.sendMail({
      from: '"ZIRAKO" <geraldine@mi.com.co>', // Se envía desde el SMTP real
      replyTo: options.replyTo || "soporte@zirako.co",
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    })

    console.log("[ZIRAKO EMAIL] Correo enviado:", info.messageId, "a:", options.to)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("[ZIRAKO EMAIL] Error al enviar correo:", error)
    throw error // Propagar el error para mejor debugging
  }
}

const ZIRAKO_LOGO_SVG = `
  <svg width="80" height="80" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto; border-radius: 50%; border: 3px solid white;">
    </svg>
`;
const EMAIL_HEADER = `
  <div style="background: linear-gradient(135deg, #1a5f3a 0%, #2d8659 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    
    ${ZIRAKO_LOGO_SVG} 
    
    <h1 style="margin: 0; font-size: 28px;">ZIRAKO</h1>
    <p style="margin: 5px 0 0 0; opacity: 0.9;">Reutiliza con propósito</p>
  </div>
`

const EMAIL_FOOTER = `
  <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #eee;">
    <p style="margin: 0;">© 2025 ZIRAKO - Todos los derechos reservados</p>
    <p style="margin: 5px 0 0 0;">Cali, Valle del Cauca, Colombia</p>
    <p style="margin: 10px 0 0 0;">
      <a href="https://zirako-delta.vercel.app/" style="color: #1a5f3a; text-decoration: none;">zirako.co</a>
    </p>
  </div>
`

/**
 * Enviar correo de bienvenida al registrarse
 */
export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #1a5f3a; color: white !important; padding: 14px 35px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
          .features { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .feature { padding: 12px 0; border-bottom: 1px solid #eee; display: flex; align-items: center; }
          .feature:last-child { border-bottom: none; }
          .feature-icon { font-size: 24px; margin-right: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          ${EMAIL_HEADER}
          <div class="content">
            <h2 style="color: #1a5f3a;">¡Bienvenido/a, ${name}!</h2>
            <p>Gracias por unirte a <strong>ZIRAKO</strong>. Estamos emocionados de tenerte como parte de nuestra comunidad de economía circular en el Valle del Cauca.</p>
            
            <div class="features">
              <h3 style="color: #1a5f3a; margin-top: 0;">¿Qué puedes hacer en ZIRAKO?</h3>
              <div class="feature">
                <span class="feature-icon">🔄</span>
                <div>
                  <strong>Intercambiar:</strong> Cambia artículos que ya no uses por otros que necesites.
                </div>
              </div>
              <div class="feature">
                <span class="feature-icon">💚</span>
                <div>
                  <strong>Donar:</strong> Dona artículos en buen estado a quienes los necesitan.
                </div>
              </div>
              <div class="feature">
                <span class="feature-icon">💰</span>
                <div>
                  <strong>Vender:</strong> Vende tus artículos a precios justos.
                </div>
              </div>
              <div class="feature">
                <span class="feature-icon">🚚</span>
                <div>
                  <strong>Recolección:</strong> Programamos la recolección de tus artículos gratis.
                </div>
              </div>
            </div>

            <center>
              <a href="https://zirako-delta.vercel.app/auth/login" class="button">Explorar ZIRAKO</a>
            </center>

            <p style="color: #666; font-size: 14px;">Si tienes alguna pregunta, no dudes en contactarnos. ¡Juntos construimos un futuro más sostenible!</p>
          </div>
          ${EMAIL_FOOTER}
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: "¡Bienvenido/a a ZIRAKO! 🌱",
    html,
    text: `Hola ${name}, bienvenido a ZIRAKO. Gracias por unirte a nuestra comunidad de economía circular.`,
  })
}

/**
 * Enviar contraseña temporal - Diseño mejorado con logo
 */
export async function sendTemporaryPasswordEmail(email: string, name: string, temporaryPassword: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .password-box { background: white; padding: 25px; border-radius: 10px; text-align: center; margin: 25px 0; border: 2px solid #1a5f3a; }
          .password { font-size: 32px; font-weight: bold; color: #1a5f3a; letter-spacing: 4px; font-family: monospace; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
          .button { display: inline-block; background: #1a5f3a; color: white !important; padding: 14px 35px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          ${EMAIL_HEADER.replace('<h1 style="margin: 0; font-size: 28px;">ZIRAKO</h1>', '<h1 style="margin: 0; font-size: 28px;">Recupera tu Cuenta</h1>')}
          <div class="content">
            <h2 style="color: #1a5f3a;">Hola, ${name}</h2>
            <p>Recibimos una solicitud para restablecer tu contraseña en ZIRAKO. Aquí está tu nueva contraseña temporal:</p>
            
            <div class="password-box">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Tu contraseña temporal es:</p>
              <p class="password">${temporaryPassword}</p>
            </div>

            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>Esta contraseña es temporal</li>
                <li>Te recomendamos cambiarla después de iniciar sesión</li>
                <li>Si no solicitaste este cambio, ignora este correo</li>
              </ul>
            </div>

            <center>
              <a href="https://zirako-delta.vercel.app/auth/login" class="button">Iniciar Sesión</a>
            </center>
            
            <p style="color: #666; font-size: 14px; text-align: center;">Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
          </div>
          ${EMAIL_FOOTER}
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: "🔐 Tu nueva contraseña temporal - ZIRAKO",
    html,
    text: `Hola ${name}, tu contraseña temporal para ZIRAKO es: ${temporaryPassword}. Inicia sesión en https://zirako-delta.vercel.app/auth/login`,
  })
}

/**
 * Enviar notificación de recolección al usuario Y al admin
 */
export async function sendCollectionConfirmationEmail(
  email: string,
  name: string,
  collectionId: number,
  fecha: string,
  horario: string,
  direccion: string,
  ciudad: string,
  descripcion: string,
) {
  // Correo para el usuario
  const userHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1a5f3a; }
          .info-row { padding: 8px 0; border-bottom: 1px solid #eee; }
          .info-row:last-child { border-bottom: none; }
          .label { font-weight: bold; color: #1a5f3a; }
          .id-box { background: #1a5f3a; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          ${EMAIL_HEADER.replace('<h1 style="margin: 0; font-size: 28px;">ZIRAKO</h1>', '<h1 style="margin: 0; font-size: 28px;">🚚 Recolección Programada</h1>')}
          <div class="content">
            <h2 style="color: #1a5f3a;">¡Hola, ${name}!</h2>
            <p>Tu recolección ha sido programada exitosamente. Aquí están los detalles:</p>
            
            <div class="id-box">
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">Número de recolección</p>
              <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold;">#REC-${collectionId}</p>
            </div>
            
            <div class="info-box">
              <div class="info-row">
                <span class="label">📅 Fecha:</span> ${fecha}
              </div>
              <div class="info-row">
                <span class="label">🕐 Horario:</span> ${horario}
              </div>
              <div class="info-row">
                <span class="label">📍 Dirección:</span> ${direccion}
              </div>
              <div class="info-row">
                <span class="label">🏙️ Ciudad:</span> ${ciudad}
              </div>
              <div class="info-row">
                <span class="label">📦 Artículos:</span> ${descripcion}
              </div>
            </div>

            <p style="color: #666; font-size: 14px;">Por favor, asegúrate de tener los artículos listos para la recolección. Si necesitas reprogramar, contáctanos lo antes posible.</p>
          </div>
          ${EMAIL_FOOTER}
        </div>
      </body>
    </html>
  `

  // Correo para el admin (geraldine@mi.com.co)
  const adminHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .info-row { padding: 8px 0; border-bottom: 1px solid #eee; }
          .info-row:last-child { border-bottom: none; }
          .label { font-weight: bold; color: #e74c3c; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🚚 Nueva Recolección Programada</h1>
            <p style="margin: 5px 0 0 0;">Recolección #REC-${collectionId}</p>
          </div>
          <div class="content">
            <div class="info-box">
              <div class="info-row">
                <span class="label">👤 Cliente:</span> ${name}
              </div>
              <div class="info-row">
                <span class="label">📧 Email:</span> ${email}
              </div>
              <div class="info-row">
                <span class="label">📅 Fecha:</span> ${fecha}
              </div>
              <div class="info-row">
                <span class="label">🕐 Horario:</span> ${horario}
              </div>
              <div class="info-row">
                <span class="label">📍 Dirección:</span> ${direccion}
              </div>
              <div class="info-row">
                <span class="label">🏙️ Ciudad:</span> ${ciudad}
              </div>
              <div class="info-row">
                <span class="label">📦 Descripción:</span> ${descripcion}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `

  // Enviar ambos correos
  await sendEmail({
    to: email,
    subject: `✅ Recolección #REC-${collectionId} programada - ZIRAKO`,
    html: userHtml,
    text: `Hola ${name}, tu recolección #REC-${collectionId} ha sido programada para ${fecha} entre ${horario} en ${direccion}, ${ciudad}.`,
  })

  await sendEmail({
    to: "geraldine@mi.com.co",
    subject: `🚚 Nueva recolección #REC-${collectionId} - ${name}`,
    html: adminHtml,
    text: `Nueva recolección programada: #REC-${collectionId}, Cliente: ${name}, Fecha: ${fecha}, Horario: ${horario}, Dirección: ${direccion}, ${ciudad}`,
    replyTo: email,
  })

  return { success: true }
}

/**
 * Enviar ticket de soporte - Al admin y confirmación al cliente
 */
export async function sendSupportTicketEmail(
  ticketId: number,
  email: string,
  name: string,
  asunto: string,
  mensaje: string,
) {
  // Correo al admin
  const adminHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #9b59b6; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #9b59b6; }
          .label { font-weight: bold; color: #9b59b6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🎫 Nuevo Ticket de Soporte</h1>
            <p style="margin: 5px 0 0 0;">Ticket #${ticketId}</p>
          </div>
          <div class="content">
            <div class="info-box">
              <p><span class="label">👤 De:</span> ${name}</p>
              <p><span class="label">📧 Email:</span> ${email}</p>
              <p><span class="label">📋 Asunto:</span> ${asunto}</p>
            </div>
            <div class="message-box">
              <p class="label">💬 Mensaje:</p>
              <p>${mensaje}</p>
            </div>
            <p style="color: #666; font-size: 14px;">Responde directamente a este correo para contactar al cliente.</p>
          </div>
        </div>
      </body>
    </html>
  `

  // Correo de confirmación al cliente
  const clientHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .ticket-box { background: #1a5f3a; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          ${EMAIL_HEADER.replace('<h1 style="margin: 0; font-size: 28px;">ZIRAKO</h1>', '<h1 style="margin: 0; font-size: 28px;">Ticket Recibido</h1>')}
          <div class="content">
            <h2 style="color: #1a5f3a;">Hola, ${name}</h2>
            <p>Hemos recibido tu solicitud de soporte. Nuestro equipo la revisará y te responderemos lo antes posible.</p>
            
            <div class="ticket-box">
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">Número de ticket</p>
              <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold;">#${ticketId}</p>
            </div>
            
            <p><strong>Asunto:</strong> ${asunto}</p>
            <p style="color: #666; font-size: 14px;">Tiempo estimado de respuesta: <strong>24-48 horas</strong></p>
          </div>
          ${EMAIL_FOOTER}
        </div>
      </body>
    </html>
  `

  // Enviar al admin
  await sendEmail({
    to: "geraldine@mi.com.co",
    subject: `🎫 Ticket #${ticketId}: ${asunto}`,
    html: adminHtml,
    text: `Nuevo ticket de ${name} (${email}): ${asunto} - ${mensaje}`,
    replyTo: email,
  })

  // Enviar confirmación al cliente
  await sendEmail({
    to: email,
    subject: `✅ Ticket #${ticketId} recibido - ZIRAKO`,
    html: clientHtml,
    text: `Hola ${name}, tu ticket #${ticketId} ha sido recibido. Te responderemos en 24-48 horas.`,
  })

  return { success: true }
}

/**
 * Enviar mensaje de chat de soporte al admin
 */
export async function sendChatSupportEmail(name: string, email: string, message: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3498db; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3498db; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">💬 Nuevo Mensaje de Chat</h1>
          </div>
          <div class="content">
            <p><strong>De:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <div class="message-box">
              <p><strong>Mensaje:</strong></p>
              <p>${message}</p>
            </div>
            <p style="color: #666; font-size: 14px;">Responde directamente a este correo para contactar al usuario.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: "geraldine@mi.com.co",
    subject: `💬 Chat de soporte: ${name}`,
    html,
    text: `Mensaje de ${name} (${email}): ${message}`,
    replyTo: email,
  })
}

// Mantener funciones por compatibilidad
export async function sendVerificationEmail(email: string, name: string, token: string) {
  return sendWelcomeEmail(email, name)
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const temporaryPassword = Math.random().toString(36).slice(-8).toUpperCase()
  return sendTemporaryPasswordEmail(email, name, temporaryPassword)
}

export async function sendCollectionReminderEmail(
  email: string,
  name: string,
  collectionId: string,
  fecha: string,
  horario: string,
  direccion: string,
) {
  return sendCollectionConfirmationEmail(
    email,
    name,
    Number.parseInt(collectionId),
    fecha,
    horario,
    direccion,
    "Valle del Cauca",
    "",
  )
}

export async function sendExchangeRequestEmail(
  email: string,
  name: string,
  itemTitulo: string,
  solicitanteNombre: string,
  itemOfrecido: string,
) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .exchange-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .item { display: inline-block; padding: 15px; background: #f0f0f0; border-radius: 8px; margin: 10px; }
          .arrow { font-size: 30px; color: #1a5f3a; margin: 0 15px; }
          .button { display: inline-block; background: #1a5f3a; color: white !important; padding: 14px 35px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          ${EMAIL_HEADER.replace('<h1 style="margin: 0; font-size: 28px;">ZIRAKO</h1>', '<h1 style="margin: 0; font-size: 28px;">🔄 Solicitud de Intercambio</h1>')}
          <div class="content">
            <h2 style="color: #1a5f3a;">Hola, ${name}</h2>
            <p><strong>${solicitanteNombre}</strong> quiere intercambiar contigo:</p>
            
            <div class="exchange-box">
              <div class="item">
                <p style="margin: 0; color: #666; font-size: 12px;">Tu artículo</p>
                <p style="margin: 5px 0 0 0; font-weight: bold;">${itemTitulo}</p>
              </div>
              <span class="arrow">⇄</span>
              <div class="item">
                <p style="margin: 0; color: #666; font-size: 12px;">Te ofrece</p>
                <p style="margin: 5px 0 0 0; font-weight: bold;">${itemOfrecido}</p>
              </div>
            </div>

            <center>
              <a href="https://zirako-delta.vercel.app/intercambio" class="button">Ver Solicitud</a>
            </center>
          </div>
          ${EMAIL_FOOTER}
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `🔄 Nueva solicitud de intercambio para "${itemTitulo}"`,
    html,
    text: `Hola ${name}, ${solicitanteNombre} quiere intercambiar tu "${itemTitulo}" por "${itemOfrecido}".`,
  })
}

export async function sendTicketConfirmationEmail(name: string, email: string, ticketId: number) {
  // Esta función ya está incluida en sendSupportTicketEmail
  return { success: true }
}
