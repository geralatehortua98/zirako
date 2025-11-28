import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"
import { sendSupportTicketEmail } from "@/lib/email"

// GET /api/support/tickets - Obtener tickets de soporte
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    let userId = null
    if (token) {
      const payload = verifyToken(token)
      if (payload) userId = payload.userId
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let sql = "SELECT * FROM tickets_soporte WHERE 1=1"
    const params: any[] = []

    if (userId) {
      sql += " AND usuario_id = ?"
      params.push(userId)
    }

    if (status) {
      sql += " AND estado = ?"
      params.push(status)
    }

    sql += " ORDER BY created_at DESC"

    const result = await query<any>(sql, params)

    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error("[API SUPPORT] Error al obtener tickets:", error)
    return NextResponse.json({ success: false, error: "Error al obtener tickets" }, { status: 500 })
  }
}

// POST /api/support/tickets - Crear ticket de soporte
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    let userId = null
    if (token) {
      const payload = verifyToken(token)
      if (payload) userId = payload.userId
    }

    const body = await request.json()
    const { nombre, email, asunto, mensaje, categoria, prioridad = "media" } = body

    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json({ success: false, error: "Todos los campos son requeridos" }, { status: 400 })
    }

    const result = await query<any>(
      `INSERT INTO tickets_soporte (usuario_id, nombre, email, asunto, mensaje, categoria, prioridad)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, nombre, email, asunto, mensaje, categoria || null, prioridad],
    )

    const ticketId = (result as any).insertId

    try {
      await sendSupportTicketEmail(ticketId, email, nombre, asunto, mensaje)
      console.log("[API SUPPORT] Correos de ticket enviados:", ticketId)
    } catch (emailError) {
      console.error("[API SUPPORT] Error al enviar emails:", emailError)
      // No fallar la creación del ticket si el email falla
    }

    return NextResponse.json(
      {
        success: true,
        message: "Ticket creado exitosamente",
        data: { id: ticketId },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[API SUPPORT] Error al crear ticket:", error)
    return NextResponse.json({ success: false, error: "Error al crear ticket" }, { status: 500 })
  }
}
