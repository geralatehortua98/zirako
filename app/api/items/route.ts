import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"

// GET /api/items - Obtener todos los artículos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const type = searchParams.get("type")
    const city = searchParams.get("city")
    const status = searchParams.get("status") || "disponible"
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let sql = `
      SELECT 
        i.*,
        u.nombre AS nombre_vendedor,
        u.email AS email_vendedor,
        u.telefono AS telefono_vendedor,
        u.foto_perfil AS foto_vendedor,
        c.nombre AS nombre_categoria,
        c.icono AS icono_categoria
      FROM items i
      JOIN usuarios u ON i.usuario_id = u.id
      JOIN categorias c ON i.categoria_id = c.id
      WHERE i.estado = ?
    `
    const params: any[] = [status]

    if (category) {
      sql += " AND i.categoria_id = ?"
      params.push(category)
    }

    if (type) {
      sql += " AND i.tipo = ?"
      params.push(type)
    }

    if (city) {
      sql += " AND i.ciudad = ?"
      params.push(city)
    }

    if (search) {
      sql += " AND (i.titulo LIKE ? OR i.descripcion LIKE ? OR c.nombre LIKE ?)"
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    sql += " ORDER BY i.created_at DESC LIMIT ? OFFSET ?"
    params.push(limit, offset)

    const result = await query<any>(sql, params)

    const items = result.rows.map((item) => ({
      ...item,
      imagenes: typeof item.imagenes === "string" ? JSON.parse(item.imagenes) : item.imagenes,
    }))

    return NextResponse.json({ success: true, data: items })
  } catch (error) {
    console.error("[API ITEMS] Error al obtener artículos:", error)
    return NextResponse.json({ success: false, error: "Error al obtener artículos" }, { status: 500 })
  }
}

// POST /api/items - Crear un nuevo artículo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, titulo, descripcion, categoria_id, tipo, condicion, precio, ciudad, imagenes } = body

    let finalUserId = userId

    // Si no viene userId en el body, intentar obtenerlo del token
    if (!finalUserId) {
      const cookieStore = await cookies()
      const token = cookieStore.get("auth-token")?.value

      if (token) {
        const payload = verifyToken(token)
        if (payload) {
          finalUserId = payload.userId
        }
      }
    }

    if (!finalUserId) {
      return NextResponse.json({ success: false, error: "Debes iniciar sesión para publicar" }, { status: 401 })
    }

    // Validaciones
    if (!titulo || !descripcion || !categoria_id || !tipo || !condicion || !ciudad) {
      return NextResponse.json({ success: false, error: "Todos los campos son requeridos" }, { status: 400 })
    }

    const categoriasMap: Record<string, string> = {
      electronica: "electronica",
      tecnologia: "electronica",
      telefonos: "electronica",
      computadores: "electronica",
      muebles: "muebles",
      ropa: "ropa",
      hogar: "hogar",
      deportes: "deportes",
      libros: "libros",
      juguetes: "juguetes",
      herramientas: "herramientas",
      vehiculos: "vehiculos",
      electrodomesticos: "electrodomesticos",
      oficina: "muebles",
      otros: "otros",
    }

    // Normalizar categoría
    let categoriaFinal = categoria_id.toString().toLowerCase()
    if (categoriasMap[categoriaFinal]) {
      categoriaFinal = categoriasMap[categoriaFinal]
    }

    // Verificar que la categoría existe en la BD
    const catCheck = await query<any>("SELECT id FROM categorias WHERE id = ?", [categoriaFinal])
    if (catCheck.rows.length === 0) {
      categoriaFinal = "otros"
    }

    console.log("[API ITEMS] Creando artículo - Usuario:", finalUserId, "Categoría:", categoriaFinal, "Título:", titulo)

    // Insertar item
    const result = await query<any>(
      `INSERT INTO items (usuario_id, categoria_id, titulo, descripcion, tipo, condicion, precio, ciudad, imagenes, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'disponible')`,
      [
        finalUserId,
        categoriaFinal,
        titulo,
        descripcion,
        tipo,
        condicion,
        tipo === "donacion" || tipo === "intercambio" ? 0 : precio || 0,
        ciudad,
        JSON.stringify(imagenes || []),
      ],
    )

    // Sumar puntos al usuario (10 puntos por publicar)
    await query("UPDATE usuarios SET puntos = puntos + 10 WHERE id = ?", [finalUserId])

    const insertId = (result as any).insertId
    console.log("[API ITEMS] Artículo creado con ID:", insertId)

    return NextResponse.json(
      {
        success: true,
        message: "Artículo publicado exitosamente",
        data: { id: insertId },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[API ITEMS] Error al crear artículo:", error)
    return NextResponse.json({ success: false, error: error.message || "Error al crear artículo" }, { status: 500 })
  }
}
