/**
 * ============================================
 * AUTENTICACIÓN - ZIRAKO
 * ============================================
 *
 * Sistema de autenticación con JWT y bcrypt
 * Compatible con MySQL Railway
 */

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "zirako-secret-key-2024-change-in-production"
const JWT_EXPIRES_IN = "7d"

// Interfaz para el payload del JWT
export interface JWTPayload {
  userId: number
  email: string
  name: string
}

// Hash de contraseña
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

// Verificar contraseña
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Generar token JWT
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Verificar token JWT
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    console.error("[ZIRAKO AUTH] Error al verificar token:", error)
    return null
  }
}

// Generar token de verificación de email
export function generateVerificationToken(): string {
  return jwt.sign({ purpose: "email-verification" }, JWT_SECRET, { expiresIn: "24h" })
}

// Generar token de recuperación de contraseña
export function generatePasswordResetToken(): string {
  return jwt.sign({ purpose: "password-reset" }, JWT_SECRET, { expiresIn: "1h" })
}

// Registrar nuevo usuario
export async function registerUser(
  email: string,
  password: string,
  name: string,
  phone?: string,
  ciudad?: string,
  direccion?: string,
) {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await query<any>("SELECT id FROM usuarios WHERE email = ?", [email])

    if (existingUser.rows.length > 0) {
      return { success: false, error: "El correo electrónico ya está registrado" }
    }

    // Hash de la contraseña
    const passwordHash = await hashPassword(password)

    // Generar token de verificación
    const verificationToken = generateVerificationToken()

    // Insertar usuario en la base de datos
    const result = await query<any>(
      `INSERT INTO usuarios (email, password_hash, nombre, telefono, ciudad, direccion, token_verificacion, puntos, nivel) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, 1)`,
      [email, passwordHash, name, phone || null, ciudad || "Cali", direccion || null, verificationToken],
    )

    // Obtener el usuario insertado
    const newUser = await query<any>(
      "SELECT id, email, nombre, puntos, ciudad, direccion, email_verificado, created_at FROM usuarios WHERE email = ?",
      [email],
    )

    const user = newUser.rows[0]

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.nombre,
        points: user.puntos,
        city: user.ciudad,
        address: user.direccion,
        emailVerified: user.email_verificado,
        createdAt: user.created_at,
      },
      verificationToken,
    }
  } catch (error) {
    console.error("[ZIRAKO AUTH] Error al registrar usuario:", error)
    return { success: false, error: "Error al registrar usuario" }
  }
}

// Iniciar sesión
export async function loginUser(email: string, password: string) {
  try {
    // Buscar usuario por email
    const result = await query<any>(
      "SELECT id, email, password_hash, nombre, telefono, ciudad, puntos, nivel, email_verificado FROM usuarios WHERE email = ?",
      [email],
    )

    if (result.rows.length === 0) {
      return { success: false, error: "Credenciales inválidas" }
    }

    const user = result.rows[0]

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return { success: false, error: "Credenciales inválidas" }
    }

    await query("UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?", [user.id])

    // Generar token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.nombre,
    })

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.nombre,
        phone: user.telefono,
        city: user.ciudad,
        points: user.puntos,
        level: user.nivel || 1,
        emailVerified: user.email_verificado,
      },
    }
  } catch (error) {
    console.error("[ZIRAKO AUTH] Error al iniciar sesión:", error)
    return { success: false, error: "Error al iniciar sesión" }
  }
}

// Verificar email
export async function verifyEmail(token: string) {
  try {
    // Buscar usuario con el token de verificación
    const result = await query<any>("SELECT id, email, nombre FROM usuarios WHERE token_verificacion = ?", [token])

    if (result.rows.length === 0) {
      return { success: false, error: "Token de verificación inválido" }
    }

    const user = result.rows[0]

    // Actualizar usuario como verificado
    await query("UPDATE usuarios SET email_verificado = TRUE, token_verificacion = NULL WHERE id = ?", [user.id])

    return {
      success: true,
      message: "Email verificado exitosamente",
      user,
    }
  } catch (error) {
    console.error("[ZIRAKO AUTH] Error al verificar email:", error)
    return { success: false, error: "Error al verificar email" }
  }
}

// Solicitar recuperación de contraseña
export async function requestPasswordReset(email: string) {
  try {
    // Buscar usuario por email
    const result = await query<any>("SELECT id, nombre FROM usuarios WHERE email = ?", [email])

    if (result.rows.length === 0) {
      // Por seguridad, no revelar si el email existe o no
      return { success: true, message: "Si el correo existe, recibirás un enlace de recuperación" }
    }

    const user = result.rows[0]

    // Generar token de recuperación
    const resetToken = generatePasswordResetToken()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    // Guardar token en la base de datos
    await query("UPDATE usuarios SET token_reset_password = ?, reset_password_expira = ? WHERE id = ?", [
      resetToken,
      expiresAt,
      user.id,
    ])

    return {
      success: true,
      resetToken,
      user,
    }
  } catch (error) {
    console.error("[ZIRAKO AUTH] Error al solicitar recuperación de contraseña:", error)
    return { success: false, error: "Error al procesar la solicitud" }
  }
}

// Restablecer contraseña
export async function resetPassword(token: string, newPassword: string) {
  try {
    // Buscar usuario con el token de recuperación válido
    const result = await query<any>(
      "SELECT id FROM usuarios WHERE token_reset_password = ? AND reset_password_expira > NOW()",
      [token],
    )

    if (result.rows.length === 0) {
      return { success: false, error: "Token inválido o expirado" }
    }

    const user = result.rows[0]

    // Hash de la nueva contraseña
    const passwordHash = await hashPassword(newPassword)

    // Actualizar contraseña y limpiar tokens
    await query(
      "UPDATE usuarios SET password_hash = ?, token_reset_password = NULL, reset_password_expira = NULL WHERE id = ?",
      [passwordHash, user.id],
    )

    return {
      success: true,
      message: "Contraseña actualizada exitosamente",
    }
  } catch (error) {
    console.error("[ZIRAKO AUTH] Error al restablecer contraseña:", error)
    return { success: false, error: "Error al restablecer contraseña" }
  }
}

// Obtener usuario por ID
export async function getUserById(id: number) {
  try {
    const result = await query<any>(
      "SELECT id, email, nombre, telefono, ciudad, direccion, puntos, nivel, rol, email_verificado, created_at FROM usuarios WHERE id = ?",
      [id],
    )

    if (result.rows.length === 0) {
      return null
    }

    const user = result.rows[0]
    return {
      id: user.id,
      email: user.email,
      name: user.nombre,
      phone: user.telefono,
      city: user.ciudad,
      address: user.direccion,
      points: user.puntos,
      level: user.nivel || 1,
      role: user.rol,
      emailVerified: user.email_verificado,
      createdAt: user.created_at,
    }
  } catch (error) {
    console.error("[ZIRAKO AUTH] Error al obtener usuario:", error)
    return null
  }
}

export async function addPointsToUser(userId: number, points: number, reason: string) {
  try {
    await query("UPDATE usuarios SET puntos = puntos + ? WHERE id = ?", [points, userId])

    // Recalcular nivel basado en puntos
    const result = await query<any>("SELECT puntos FROM usuarios WHERE id = ?", [userId])
    if (result.rows.length > 0) {
      const totalPoints = result.rows[0].puntos
      let newLevel = 1
      if (totalPoints >= 1000)
        newLevel = 5 // Diamante
      else if (totalPoints >= 500)
        newLevel = 4 // Platino
      else if (totalPoints >= 200)
        newLevel = 3 // Oro
      else if (totalPoints >= 50) newLevel = 2 // Plata

      await query("UPDATE usuarios SET nivel = ? WHERE id = ?", [newLevel, userId])
    }

    return { success: true }
  } catch (error) {
    console.error("[ZIRAKO AUTH] Error al agregar puntos:", error)
    return { success: false }
  }
}
