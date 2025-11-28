import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"

// GET /api/usuarios/perfil - Obtener perfil del usuario logueado
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ success: false, error: "Sesión expirada" }, { status: 401 })
    }

    // Obtener datos del usuario
    const userResult = await query<any>(
      `SELECT id, nombre, email, telefono, ciudad, direccion, foto_perfil, 
              puntos, nivel, nombre_empresa, created_at
       FROM usuarios WHERE id = ?`,
      [payload.userId],
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 })
    }

    const usuario = userResult.rows[0]

    // Calcular nivel basado en puntos
    const nivel = calcularNivel(usuario.puntos)

    // Obtener estadísticas
    const statsResult = await query<any>(
      `SELECT 
        (SELECT COUNT(*) FROM items WHERE usuario_id = ?) AS total_articulos,
        (SELECT COUNT(*) FROM items WHERE usuario_id = ? AND tipo = 'venta') AS articulos_venta,
        (SELECT COUNT(*) FROM items WHERE usuario_id = ? AND tipo = 'donacion') AS articulos_donacion,
        (SELECT COUNT(*) FROM items WHERE usuario_id = ? AND tipo = 'intercambio') AS articulos_intercambio,
        (SELECT COUNT(*) FROM intercambios WHERE usuario_propone_id = ? OR usuario_recibe_id = ?) AS total_intercambios,
        (SELECT COUNT(*) FROM recolecciones WHERE usuario_id = ?) AS total_recolecciones,
        (SELECT COUNT(*) FROM favoritos WHERE usuario_id = ?) AS total_favoritos`,
      [
        payload.userId,
        payload.userId,
        payload.userId,
        payload.userId,
        payload.userId,
        payload.userId,
        payload.userId,
        payload.userId,
      ],
    )

    // Obtener impacto ambiental
    const impactoResult = await query<any>(
      `SELECT 
        COALESCE(SUM(co2_ahorrado), 0) AS total_co2,
        COUNT(CASE WHEN tipo_accion = 'donacion' THEN 1 END) AS acciones_donacion,
        COUNT(CASE WHEN tipo_accion = 'venta' THEN 1 END) AS acciones_venta,
        COUNT(CASE WHEN tipo_accion = 'intercambio' THEN 1 END) AS acciones_intercambio,
        COUNT(CASE WHEN tipo_accion = 'recoleccion' THEN 1 END) AS acciones_recoleccion
       FROM impacto_ambiental WHERE usuario_id = ?`,
      [payload.userId],
    )

    const stats = statsResult.rows[0] || {}
    const impacto = impactoResult.rows[0] || { total_co2: 0 }

    return NextResponse.json({
      success: true,
      data: {
        ...usuario,
        nivel,
        nivel_nombre: obtenerNombreNivel(nivel),
        puntos_siguiente_nivel: puntosParaSiguienteNivel(usuario.puntos),
        estadisticas: stats,
        impacto_ambiental: {
          total_co2_ahorrado: Number(impacto.total_co2) || 0,
          acciones: {
            donaciones: Number(impacto.acciones_donacion) || 0,
            ventas: Number(impacto.acciones_venta) || 0,
            intercambios: Number(impacto.acciones_intercambio) || 0,
            recolecciones: Number(impacto.acciones_recoleccion) || 0,
          },
        },
      },
    })
  } catch (error) {
    console.error("[API PERFIL] Error:", error)
    return NextResponse.json({ success: false, error: "Error al obtener perfil" }, { status: 500 })
  }
}

// PUT /api/usuarios/perfil - Actualizar perfil
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ success: false, error: "Sesión expirada" }, { status: 401 })
    }

    const body = await request.json()
    const { nombre, telefono, ciudad, direccion, nombre_empresa, foto_perfil } = body

    await query(
      `UPDATE usuarios SET 
        nombre = COALESCE(?, nombre),
        telefono = COALESCE(?, telefono),
        ciudad = COALESCE(?, ciudad),
        direccion = COALESCE(?, direccion),
        nombre_empresa = COALESCE(?, nombre_empresa),
        foto_perfil = COALESCE(?, foto_perfil)
       WHERE id = ?`,
      [nombre, telefono, ciudad, direccion, nombre_empresa, foto_perfil, payload.userId],
    )

    return NextResponse.json({ success: true, message: "Perfil actualizado" })
  } catch (error) {
    console.error("[API PERFIL] Error:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar perfil" }, { status: 500 })
  }
}

// Funciones helper para niveles
function calcularNivel(puntos: number): number {
  if (puntos >= 5000) return 5 // Diamante
  if (puntos >= 2000) return 4 // Platino
  if (puntos >= 1000) return 3 // Oro
  if (puntos >= 500) return 2 // Plata
  return 1 // Bronce
}

function obtenerNombreNivel(nivel: number): string {
  const niveles: Record<number, string> = {
    1: "Bronce",
    2: "Plata",
    3: "Oro",
    4: "Platino",
    5: "Diamante",
  }
  return niveles[nivel] || "Bronce"
}

function puntosParaSiguienteNivel(puntos: number): number {
  if (puntos >= 5000) return 0
  if (puntos >= 2000) return 5000 - puntos
  if (puntos >= 1000) return 2000 - puntos
  if (puntos >= 500) return 1000 - puntos
  return 500 - puntos
}
