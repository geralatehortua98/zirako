import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"

// GET /api/favoritos - Obtener favoritos del usuario
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
      `SELECT i.*, u.nombre AS nombre_vendedor, c.nombre AS nombre_categoria
       FROM favoritos f
       JOIN items i ON f.item_id = i.id
       JOIN usuarios u ON i.usuario_id = u.id
       JOIN categorias c ON i.categoria_id = c.id
       WHERE f.usuario_id = ?
       ORDER BY f.created_at DESC`,
      [payload.userId],
    )

    const items = result.rows.map((item) => ({
      ...item,
      imagenes: typeof item.imagenes === "string" ? JSON.parse(item.imagenes) : item.imagenes,
    }))

    return NextResponse.json({ success: true, data: items })
  } catch (error) {
    console.error("[API FAVORITOS] Error al obtener favoritos:", error)
    return NextResponse.json({ success: false, error: "Error al obtener favoritos" }, { status: 500 })
  }
}

// POST /api/favoritos - Agregar a favoritos
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
    const { item_id } = body

    if (!item_id) {
      return NextResponse.json({ success: false, error: "ID del artículo es requerido" }, { status: 400 })
    }

    // Verificar si ya está en favoritos
    const existing = await query<any>("SELECT id FROM favoritos WHERE usuario_id = ? AND item_id = ?", [
      payload.userId,
      item_id,
    ])

    if (existing.rows.length > 0) {
      return NextResponse.json({ success: false, error: "Ya está en favoritos" }, { status: 400 })
    }

    await query("INSERT INTO favoritos (usuario_id, item_id) VALUES (?, ?)", [payload.userId, item_id])

    return NextResponse.json({ success: true, message: "Agregado a favoritos" }, { status: 201 })
  } catch (error) {
    console.error("[API FAVORITOS] Error al agregar favorito:", error)
    return NextResponse.json({ success: false, error: "Error al agregar favorito" }, { status: 500 })
  }
}

// DELETE /api/favoritos - Eliminar de favoritos
export async function DELETE(request: NextRequest) {
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
    const itemId = searchParams.get("item_id")

    if (!itemId) {
      return NextResponse.json({ success: false, error: "ID del artículo es requerido" }, { status: 400 })
    }

    await query("DELETE FROM favoritos WHERE usuario_id = ? AND item_id = ?", [payload.userId, itemId])

    return NextResponse.json({ success: true, message: "Eliminado de favoritos" })
  } catch (error) {
    console.error("[API FAVORITOS] Error al eliminar favorito:", error)
    return NextResponse.json({ success: false, error: "Error al eliminar favorito" }, { status: 500 })
  }
}
