import { type NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone, ciudad, direccion } = body

    // Validar campos requeridos
    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: "Email, contraseña y nombre son requeridos" }, { status: 400 })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Formato de email inválido" }, { status: 400 })
    }

    // Validar contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 },
      )
    }

    const result = await registerUser(email, password, name, phone, ciudad, direccion)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    try {
      await sendWelcomeEmail(email, name)
      console.log("[API REGISTER] Correo de bienvenida enviado a:", email)
    } catch (emailError) {
      console.error("[API REGISTER] Error al enviar email de bienvenida:", emailError)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Usuario registrado exitosamente",
        user: result.user,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[API REGISTER] Error en registro:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
