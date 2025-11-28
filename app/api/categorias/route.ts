import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET /api/categorias - Obtener todas las categorías
export async function GET(request: NextRequest) {
  try {
    const result = await query<any>(
      `SELECT c.*, 
        (SELECT COUNT(*) FROM items i WHERE i.categoria_id = c.id AND i.estado = 'disponible') AS total_items
       FROM categorias c
       WHERE c.activa = TRUE
       ORDER BY c.orden ASC`,
    )

    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error("[API CATEGORIAS] Error al obtener categorías:", error)
    return NextResponse.json({ success: false, error: "Error al obtener categorías" }, { status: 500 })
  }
}
