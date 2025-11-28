/**
 * ============================================
 * TIPOS TYPESCRIPT PARA ZIRAKO
 * ============================================
 *
 * Definiciones de tipos para todas las entidades del sistema.
 * Estos tipos se usan tanto en el frontend como en el backend.
 */

// ============================================
// USUARIOS
// ============================================

export interface User {
  id: string
  uid?: string // ID de Firebase Auth
  name: string
  email: string
  phone?: string
  points: number
  role: "user" | "admin"
  emailVerified: boolean
  createdAt: Date
  updatedAt?: Date
}

export type UserCreate = Omit<User, "id" | "createdAt" | "updatedAt" | "points" | "emailVerified"> & {
  password: string
}

// ============================================
// ARTÍCULOS/ITEMS
// ============================================

export type ItemCondition = "Nuevo" | "Como nuevo" | "Usado"
export type ItemType = "venta" | "donacion" | "intercambio"
export type ItemStatus = "available" | "reserved" | "completed"

export interface Item {
  id: string
  userId: string
  title: string
  description: string
  category: string
  condition: ItemCondition
  price: number // En COP, 0 para donaciones
  type: ItemType
  location: string // Ciudad del Valle del Cauca
  images: string[]
  status: ItemStatus
  views: number
  createdAt: Date
  updatedAt: Date
}

export type ItemCreate = Omit<Item, "id" | "createdAt" | "updatedAt" | "views" | "status"> & {
  status?: ItemStatus
}

// ============================================
// INTERCAMBIOS
// ============================================

export type ExchangeStatus = "pending" | "accepted" | "rejected" | "completed"

export interface Exchange {
  id: string
  proposerId: string // Usuario que propone el intercambio
  receiverId: string // Usuario que recibe la propuesta
  proposerItemId: string // Artículo ofrecido
  receiverItemId: string // Artículo deseado
  status: ExchangeStatus
  message?: string
  createdAt: Date
  updatedAt: Date
}

export type ExchangeCreate = Omit<Exchange, "id" | "createdAt" | "updatedAt">

// ============================================
// DONACIONES
// ============================================

export type DonationStatus = "available" | "reserved" | "completed"

export interface Donation {
  id: string
  donorId: string // Usuario donante
  itemId: string // Artículo donado
  recipientId?: string // Usuario receptor (opcional hasta que alguien lo solicite)
  status: DonationStatus
  createdAt: Date
  updatedAt: Date
}

export type DonationCreate = Omit<Donation, "id" | "createdAt" | "updatedAt">

// ============================================
// RECOLECCIONES
// ============================================

export type CollectionStatus = "pending" | "confirmed" | "completed" | "cancelled"

export interface Collection {
  id: string
  userId: string
  address: string
  city: string // Ciudad del Valle del Cauca
  schedule: string // Horario preferido
  description?: string
  status: CollectionStatus
  scheduledDate?: Date
  createdAt: Date
  updatedAt: Date
}

export type CollectionCreate = Omit<Collection, "id" | "createdAt" | "updatedAt">

// ============================================
// SOPORTE
// ============================================

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed"
export type TicketPriority = "low" | "medium" | "high"

export interface SupportTicket {
  id: string
  userId?: string // Opcional para usuarios no registrados
  name: string
  email: string
  subject: string
  message: string
  category?: string
  status: TicketStatus
  priority: TicketPriority
  createdAt: Date
  updatedAt: Date
}

export type SupportTicketCreate = Omit<SupportTicket, "id" | "createdAt" | "updatedAt">

// ============================================
// CHAT
// ============================================

export interface Chat {
  id: string
  participants: string[] // IDs de usuarios
  type: "user-user" | "user-support"
  lastMessage?: string
  lastMessageAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ChatMessage {
  id: string
  chatId?: string
  senderId: string
  receiverId: string
  message: string
  type: "text" | "image"
  read: boolean
  createdAt: Date
}

export type ChatMessageCreate = Omit<ChatMessage, "id" | "createdAt">

// ============================================
// CATEGORÍAS
// ============================================

export type CategoryId =
  | "electronica"
  | "muebles"
  | "ropa"
  | "hogar"
  | "deportes"
  | "libros"
  | "juguetes"
  | "herramientas"
  | "vehiculos"
  | "otros"

export interface Category {
  id: CategoryId
  name: string
  icon: string
  description: string
}

export const CATEGORIES: Category[] = [
  { id: "electronica", name: "Electrónica", icon: "Smartphone", description: "Teléfonos, computadoras, tablets y más" },
  { id: "muebles", name: "Muebles", icon: "Sofa", description: "Sofás, mesas, sillas y decoración" },
  { id: "ropa", name: "Ropa", icon: "Shirt", description: "Ropa, calzado y accesorios" },
  { id: "hogar", name: "Hogar", icon: "Home", description: "Artículos para el hogar y cocina" },
  { id: "deportes", name: "Deportes", icon: "Dumbbell", description: "Equipos deportivos y fitness" },
  { id: "libros", name: "Libros", icon: "BookOpen", description: "Libros, revistas y material educativo" },
  { id: "juguetes", name: "Juguetes", icon: "Gamepad2", description: "Juguetes y juegos para todas las edades" },
  { id: "herramientas", name: "Herramientas", icon: "Wrench", description: "Herramientas y equipos de trabajo" },
  { id: "vehiculos", name: "Vehículos", icon: "Car", description: "Bicicletas, motos y accesorios" },
  { id: "otros", name: "Otros", icon: "Package", description: "Otros artículos diversos" },
]

// ============================================
// CIUDADES DEL VALLE DEL CAUCA
// ============================================

export const VALLE_DEL_CAUCA_CITIES = [
  "Cali",
  "Palmira",
  "Buenaventura",
  "Tuluá",
  "Buga",
  "Cartago",
  "Yumbo",
  "Jamundí",
  "Sevilla",
  "Zarzal",
  "Candelaria",
  "Florida",
  "Pradera",
  "El Cerrito",
  "Dagua",
] as const

export type ValleDelCaucaCity = (typeof VALLE_DEL_CAUCA_CITIES)[number]

// ============================================
// RESPUESTAS DE API
// ============================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  limit: number
  hasMore: boolean
}
