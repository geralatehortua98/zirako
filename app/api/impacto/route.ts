import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"

// Valores de CO2 ahorrado por acción (en kg)
const CO2_POR_ACCION = {
  donacion: 3,
  intercambio: 2,
  venta: 1,
  recoleccion: 0.5,
}

// Puntos por acción
const PUNTOS_POR_ACCION = {
  donacion: 50,
  intercambio: 30,
  venta: 10,
  recoleccion: 20,
}

// GET /api/impacto - Obtener impacto ambiental del usuario
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

    // Total de CO2 ahorrado
    const totalResult = await query<any>(
      `SELECT 
        COALESCE(SUM(co2_ahorrado), 0) AS total_co2,
        COUNT(*) AS total_acciones
       FROM impacto_ambiental WHERE usuario_id = ?`,
      [payload.userId],
    )

    // Desglose por tipo de acción
    const desgloseResult = await query<any>(
      `SELECT 
        tipo_accion,
        COUNT(*) AS cantidad,
        SUM(co2_ahorrado) AS co2_total
       FROM impacto_ambiental 
       WHERE usuario_id = ?
       GROUP BY tipo_accion`,
      [payload.userId],
    )

    // Impacto por mes (últimos 6 meses)
    const mensualResult = await query<any>(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m') AS mes,
        SUM(co2_ahorrado) AS co2_mes,
        COUNT(*) AS acciones_mes
       FROM impacto_ambiental 
       WHERE usuario_id = ? 
         AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY mes DESC`,
      [payload.userId],
    )

    // Últimas acciones
    const ultimasResult = await query<any>(
      `SELECT ia.*, i.titulo AS nombre_item
       FROM impacto_ambiental ia
       LEFT JOIN items i ON ia.item_id = i.id
       WHERE ia.usuario_id = ?
       ORDER BY ia.created_at DESC
       LIMIT 10`,
      [payload.userId],
    )

    const total = totalResult.rows[0] || { total_co2: 0, total_acciones: 0 }

    // Calcular equivalencias ambientales
    const co2Total = Number(total.total_co2) || 0
    const equivalencias = {
      arboles_equivalentes: Math.round(co2Total / 21), // Un árbol absorbe ~21kg CO2/año
      km_auto_evitados: Math.round(co2Total / 0.12), // ~0.12 kg CO2 por km
      litros_agua_ahorrados: Math.round(co2Total * 100), // Estimación
      bolsas_plastico_evitadas: Math.round(co2Total * 10),
    }

    return NextResponse.json({
      success: true,
      data: {
        total_co2_ahorrado: co2Total,
        total_acciones: Number(total.total_acciones) || 0,
        desglose: desgloseResult.rows,
        mensual: mensualResult.rows,
        ultimas_acciones: ultimasResult.rows,
        equivalencias,
      },
    })
  } catch (error) {
    console.error("[API IMPACTO] Error:", error)
    return NextResponse.json({ success: false, error: "Error al obtener impacto" }, { status: 500 })
  }
}

// POST /api/impacto - Registrar nueva acción de impacto
export async function POST(request: NextRequest) {
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
    const { tipo_accion, item_id, descripcion } = body

    if (!tipo_accion || !["donacion", "venta", "intercambio", "recoleccion"].includes(tipo_accion)) {
      return NextResponse.json({ success: false, error: "Tipo de acción inválido" }, { status: 400 })
    }

    const co2_ahorrado = CO2_POR_ACCION[tipo_accion as keyof typeof CO2_POR_ACCION]
    const puntos = PUNTOS_POR_ACCION[tipo_accion as keyof typeof PUNTOS_POR_ACCION]

    // Registrar impacto ambiental
    await query(
      `INSERT INTO impacto_ambiental (usuario_id, item_id, tipo_accion, co2_ahorrado, descripcion)
       VALUES (?, ?, ?, ?, ?)`,
      [payload.userId, item_id || null, tipo_accion, co2_ahorrado, descripcion || `Acción de ${tipo_accion}`],
    )

    // Actualizar puntos del usuario
    await query(`UPDATE usuarios SET puntos = puntos + ? WHERE id = ?`, [puntos, payload.userId])

    // Actualizar nivel si corresponde
    const userResult = await query<any>(`SELECT puntos FROM usuarios WHERE id = ?`, [payload.userId])
    const nuevosPuntos = userResult.rows[0]?.puntos || 0
    const nuevoNivel = calcularNivel(nuevosPuntos)

    await query(`UPDATE usuarios SET nivel = ? WHERE id = ?`, [nuevoNivel, payload.userId])

    return NextResponse.json({
      success: true,
      message: "Impacto registrado",
      data: {
        co2_ahorrado,
        puntos_ganados: puntos,
        puntos_totales: nuevosPuntos,
        nivel: nuevoNivel,
      },
    })
  } catch (error) {
    console.error("[API IMPACTO] Error:", error)
    return NextResponse.json({ success: false, error: "Error al registrar impacto" }, { status: 500 })
  }
}

function calcularNivel(puntos: number): number {
  if (puntos >= 5000) return 5
  if (puntos >= 2000) return 4
  if (puntos >= 1000) return 3
  if (puntos >= 500) return 2
  return 1
}
