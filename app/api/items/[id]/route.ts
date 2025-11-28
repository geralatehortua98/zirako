import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"

// GET /api/items/[id] - Obtener un artículo por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Incrementar vistas
    await query("UPDATE items SET vistas = vistas + 1 WHERE id = ?", [id])

    // Obtener item con información del vendedor
    const result = await query<any>(
      `SELECT 
        i.*,
        u.id AS vendedor_id,
        u.nombre AS nombre_vendedor,
        u.email AS email_vendedor,
        u.telefono AS telefono_vendedor,
        u.foto_perfil AS foto_vendedor,
        u.puntos AS puntos_vendedor,
        u.ciudad AS ciudad_vendedor,
        c.nombre AS nombre_categoria,
        c.icono AS icono_categoria,
        (SELECT COUNT(*) FROM favoritos WHERE item_id = i.id) AS total_favoritos
      FROM items i
      JOIN usuarios u ON i.usuario_id = u.id
      JOIN categorias c ON i.categoria_id = c.id
      WHERE i.id = ?`,
      [id],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Artículo no encontrado" }, { status: 404 })
    }

    const item = {
      ...result.rows[0],
      imagenes:
        typeof result.rows[0].imagenes === "string" ? JSON.parse(result.rows[0].imagenes) : result.rows[0].imagenes,
    }

    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    console.error("[API ITEMS] Error al obtener artículo:", error)
    return NextResponse.json({ success: false, error: "Error al obtener artículo" }, { status: 500 })
  }
}

async function getUserId(request: NextRequest): Promise<number | null> {
  // 1. Intentar del query param
  const { searchParams } = new URL(request.url)
  const userIdParam = searchParams.get("userId")
  if (userIdParam) {
    return Number.parseInt(userIdParam)
  }

  // 2. Intentar de la cookie
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value
  if (token) {
    const payload = verifyToken(token)
    if (payload) {
      return payload.userId
    }
  }

  return null
}

// PUT /api/items/[id] - Actualizar un artículo
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const userId = await getUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    // Verificar que el item pertenece al usuario
    const itemCheck = await query<any>("SELECT usuario_id FROM items WHERE id = ?", [id])
    if (itemCheck.rows.length === 0 || itemCheck.rows[0].usuario_id !== userId) {
      return NextResponse.json({ success: false, error: "No autorizado para editar este artículo" }, { status: 403 })
    }

    const body = await request.json()
    const { titulo, descripcion, precio, estado, imagenes } = body

    await query(
      `UPDATE items SET 
        titulo = COALESCE(?, titulo),
        descripcion = COALESCE(?, descripcion),
        precio = COALESCE(?, precio),
        estado = COALESCE(?, estado),
        imagenes = COALESCE(?, imagenes)
      WHERE id = ?`,
      [titulo, descripcion, precio, estado, imagenes ? JSON.stringify(imagenes) : null, id],
    )

    return NextResponse.json({ success: true, message: "Artículo actualizado" })
  } catch (error) {
    console.error("[API ITEMS] Error al actualizar artículo:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar artículo" }, { status: 500 })
  }
}

// DELETE /api/items/[id] - Eliminar un artículo
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const userId = await getUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    // Verificar que el item pertenece al usuario
    const itemCheck = await query<any>("SELECT usuario_id FROM items WHERE id = ?", [id])
    if (itemCheck.rows.length === 0 || itemCheck.rows[0].usuario_id !== userId) {
      return NextResponse.json({ success: false, error: "No autorizado para eliminar este artículo" }, { status: 403 })
    }

    await query("DELETE FROM items WHERE id = ?", [id])

    return NextResponse.json({ success: true, message: "Artículo eliminado" })
  } catch (error) {
    console.error("[API ITEMS] Error al eliminar artículo:", error)
    return NextResponse.json({ success: false, error: "Error al eliminar artículo" }, { status: 500 })
  }
}
