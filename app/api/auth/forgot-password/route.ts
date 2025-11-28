import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { sendTemporaryPasswordEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ success: false, error: "Email es requerido" }, { status: 400 })
    }

    // Buscar usuario por email
    const result = await query<any>("SELECT id, nombre FROM usuarios WHERE email = ?", [email])

    if (result.rows.length === 0) {
      // Por seguridad, no revelar si el email existe
      return NextResponse.json({
        success: true,
        message: "Si el correo existe, recibirás una contraseña temporal",
      })
    }

    const user = result.rows[0]

    const temporaryPassword = Math.random().toString(36).slice(-8).toUpperCase()
    const hashedPassword = await hashPassword(temporaryPassword)

    // Actualizar contraseña en la base de datos
    await query("UPDATE usuarios SET password_hash = ? WHERE id = ?", [hashedPassword, user.id])

    // Enviar correo con contraseña temporal
    try {
      await sendTemporaryPasswordEmail(email, user.nombre, temporaryPassword)
      console.log("[API FORGOT] Contraseña temporal enviada a:", email)
    } catch (emailError) {
      console.error("[API FORGOT] Error al enviar email:", emailError)
      return NextResponse.json({ success: false, error: "Error al enviar correo" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Se ha enviado una contraseña temporal a tu correo",
    })
  } catch (error) {
    console.error("[API FORGOT] Error:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
