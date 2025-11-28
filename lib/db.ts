/**
 * ============================================
 * CLIENTE DE BASE DE DATOS MYSQL - RAILWAY
 * ============================================
 *
 * Conexión a MySQL en Railway para ZIRAKO
 * URL: mysql://root:xxx@ballast.proxy.rlwy.net:17649/railway
 */

import mysql from "mysql2/promise"

// Configuración de la conexión a MySQL Railway
const pool = mysql.createPool({
  uri: process.env.MYSQL_URL || "mysql://root:yxmVaGtPLvKGUfpOKtanUtgbkTNTshXt@ballast.proxy.rlwy.net:17649/railway",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
})

// Función helper para ejecutar queries
export async function query<T = any>(sql: string, params?: any[]): Promise<{ rows: T[]; fields?: any }> {
  try {
    const [rows, fields] = await pool.execute(sql, params || [])
    return { rows: rows as T[], fields }
  } catch (error) {
    console.error("[ZIRAKO DB] Error ejecutando query:", error)
    throw error
  }
}

// Función para obtener una conexión del pool
export async function getConnection() {
  return pool.getConnection()
}

// Verificar conexión a la base de datos
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()
    console.log("[ZIRAKO DB] Conexión a MySQL Railway exitosa")
    return true
  } catch (error) {
    console.error("[ZIRAKO DB] Error conectando a MySQL Railway:", error)
    return false
  }
}

export default pool
