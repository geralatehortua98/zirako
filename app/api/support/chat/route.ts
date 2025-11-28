import { type NextRequest, NextResponse } from "next/server"
import { sendChatSupportEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "Todos los campos son requeridos" }, { status: 400 })
    }

    await sendChatSupportEmail(name, email, message)

    return NextResponse.json({
      success: true,
      message: "Mensaje enviado exitosamente",
    })
  } catch (error) {
    console.error("[API CHAT] Error:", error)
    return NextResponse.json({ success: false, error: "Error al enviar mensaje" }, { status: 500 })
  }
}
