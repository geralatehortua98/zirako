import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"

// GET /api/items/mis-articulos - Obtener artículos del usuario autenticado
export async function GET(request: NextRequest) {
  try {
    let userId = null

    // 1. Intentar obtener del query param (más confiable)
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get("userId")
    if (userIdParam) {
      userId = Number.parseInt(userIdParam)
    }

    // 2. Si no hay query param, intentar con la cookie
    if (!userId) {
      const cookieStore = await cookies()
      const token = cookieStore.get("auth-token")?.value

      if (token) {
        const payload = verifyToken(token)
        if (payload) {
          userId = payload.userId
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado", data: [] }, { status: 401 })
    }

    console.log("[API MIS-ARTICULOS] Buscando artículos del usuario:", userId)

    const result = await query<any>(
      `SELECT 
        i.id,
        i.titulo,
        i.descripcion,
        i.tipo,
        i.condicion,
        i.precio,
        i.ciudad,
        i.imagenes,
        i.estado,
        i.vistas,
        i.created_at,
        COALESCE(c.nombre, 'Sin categoría') AS nombre_categoria,
        c.icono AS icono_categoria
      FROM items i
      LEFT JOIN categorias c ON i.categoria_id = c.id
      WHERE i.usuario_id = ?
      ORDER BY i.created_at DESC`,
      [userId],
    )

    console.log("[API MIS-ARTICULOS] Artículos encontrados:", result.rows.length)

    const items = result.rows.map((item: any) => {
      let imagenes = []
      try {
        imagenes = typeof item.imagenes === "string" ? JSON.parse(item.imagenes) : item.imagenes || []
      } catch (e) {
        imagenes = []
      }
      return {
        ...item,
        imagenes,
        vistas: item.vistas || 0,
      }
    })

    return NextResponse.json({ success: true, data: items })
  } catch (error) {
    console.error("[API MIS-ARTICULOS] Error:", error)
    return NextResponse.json({ success: false, error: "Error al obtener artículos", data: [] }, { status: 500 })
  }
}
