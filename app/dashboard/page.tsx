"use client"

import type React from "react"

import { ZirakoLogo } from "@/components/zirako-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CategoryIcon } from "@/components/category-icon"
import {
  Search,
  Menu,
  Leaf,
  User,
  MapPin,
  TrendingUp,
  Recycle,
  TreeDeciduous,
  Package,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface UserData {
  id: number
  nombre: string
  email: string
  puntos: number
  nivel: number
}

interface ImpactoData {
  total_co2: number
  total_acciones: number
  donaciones: number
  intercambios: number
  ventas: number
}

interface MiArticulo {
  id: number
  titulo: string
  tipo: string
  precio: number
  estado: string
  ciudad: string
  created_at: string
}

const featuredItems = [
  {
    id: 1,
    name: "Samsung Galaxy A54",
    condition: "Como nuevo",
    location: "Cali",
    category: "telefonos" as const,
    price: 850000,
    type: "venta" as const,
  },
  {
    id: 2,
    name: "Laptop HP Pavilion 15",
    condition: "Usado",
    location: "Palmira",
    category: "computadores" as const,
    price: 1200000,
    type: "venta" as const,
  },
  {
    id: 3,
    name: "Silla Ergonómica",
    condition: "Usado",
    location: "Tuluá",
    category: "muebles" as const,
    price: 280000,
    type: "venta" as const,
  },
  {
    id: 4,
    name: "Estantería 5 Niveles",
    condition: "Como nuevo",
    location: "Buga",
    category: "muebles" as const,
    price: 0,
    type: "donacion" as const,
  },
]

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

function getTypeLabel(type: string): { label: string; color: string } {
  switch (type) {
    case "venta":
      return { label: "Venta", color: "bg-emerald-600 text-white" }
    case "donacion":
      return { label: "Donación", color: "bg-purple-600 text-white" }
    case "intercambio":
      return { label: "Intercambio", color: "bg-orange-500 text-white" }
    default:
      return { label: "Disponible", color: "bg-gray-500 text-white" }
  }
}

function getNivelInfo(nivel: number): { nombre: string; color: string } {
  switch (nivel) {
    case 1:
      return { nombre: "Bronce", color: "text-amber-700" }
    case 2:
      return { nombre: "Plata", color: "text-gray-400" }
    case 3:
      return { nombre: "Oro", color: "text-yellow-500" }
    case 4:
      return { nombre: "Platino", color: "text-cyan-400" }
    case 5:
      return { nombre: "Diamante", color: "text-purple-400" }
    default:
      return { nombre: "Bronce", color: "text-amber-700" }
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [impacto, setImpacto] = useState<ImpactoData>({
    total_co2: 0,
    total_acciones: 0,
    donaciones: 0,
    intercambios: 0,
    ventas: 0,
  })
  const [misArticulos, setMisArticulos] = useState<MiArticulo[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("zirako_logged_in")
    if (isLoggedIn !== "true") {
      router.push("/auth/login")
      return
    }

    const nombre = localStorage.getItem("zirako_user_name") || "Usuario"
    const email = localStorage.getItem("zirako_user_email") || ""
    const id = Number.parseInt(localStorage.getItem("zirako_user_id") || "0")

    setUserData({
      id,
      nombre,
      email,
      puntos: 0,
      nivel: 1,
    })

    const fetchImpacto = async () => {
      try {
        const response = await fetch("/api/impacto", {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setImpacto({
              total_co2: data.data.total_co2 || 0,
              total_acciones: data.data.total_acciones || 0,
              donaciones: data.data.por_tipo?.donacion || 0,
              intercambios: data.data.por_tipo?.intercambio || 0,
              ventas: data.data.por_tipo?.venta || 0,
            })
          }
        }
      } catch (error) {
        console.error("Error cargando impacto:", error)
      }
    }

    const fetchPerfil = async () => {
      try {
        const response = await fetch("/api/usuarios/perfil", {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setUserData((prev) =>
              prev
                ? {
                    ...prev,
                    puntos: data.data.puntos || 0,
                    nivel: data.data.nivel || 1,
                  }
                : null,
            )
          }
        }
      } catch (error) {
        console.error("Error cargando perfil:", error)
      }
    }

    const fetchMisArticulos = async () => {
      try {
        const userId = localStorage.getItem("zirako_user_id")
        const response = await fetch(`/api/items/mis-articulos?userId=${userId}`, {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setMisArticulos(data.data.slice(0, 3))
          }
        }
      } catch (error) {
        console.error("Error cargando artículos:", error)
      }
    }

    fetchImpacto()
    fetchPerfil()
    fetchMisArticulos()
  }, [router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const nivelInfo = getNivelInfo(userData?.nivel || 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/90">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Leaf className="h-8 w-8 text-accent" />
            <span className="text-accent font-bold text-xl">ZIRAKO</span>
          </div>
          <Link href="/perfil">
            <Button variant="ghost" size="icon" className="text-accent hover:bg-white/20 border-2 border-accent/50">
              <User className="h-7 w-7" />
            </Button>
          </Link>
        </div>

        {/* Widget de impacto ambiental */}
        <Card className="bg-gradient-to-r from-emerald-800 to-green-700 border-none p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-full p-3">
                <TreeDeciduous className="h-10 w-10 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Hola, {userData?.nombre || "Usuario"}</p>
                <h2 className="text-white text-2xl font-bold">Tu Impacto Ambiental</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${nivelInfo.color} bg-white/20`}>Nivel {nivelInfo.nombre}</Badge>
                  <span className="text-white/80 text-sm">{userData?.puntos || 0} puntos</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Recycle className="h-5 w-5 text-green-300" />
                  <span className="text-3xl font-bold text-white">{impacto.total_co2.toFixed(1)}</span>
                </div>
                <p className="text-white/70 text-sm">kg CO₂ ahorrado</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="h-5 w-5 text-green-300" />
                  <span className="text-3xl font-bold text-white">{impacto.total_acciones}</span>
                </div>
                <p className="text-white/70 text-sm">acciones eco</p>
              </div>

              <div className="hidden md:flex gap-4">
                <div className="text-center px-4 border-l border-white/20">
                  <span className="text-xl font-bold text-white">{impacto.donaciones}</span>
                  <p className="text-white/70 text-xs">Donaciones</p>
                </div>
                <div className="text-center px-4 border-l border-white/20">
                  <span className="text-xl font-bold text-white">{impacto.intercambios}</span>
                  <p className="text-white/70 text-xs">Intercambios</p>
                </div>
                <div className="text-center px-4 border-l border-white/20">
                  <span className="text-xl font-bold text-white">{impacto.ventas}</span>
                  <p className="text-white/70 text-xs">Ventas</p>
                </div>
              </div>
            </div>

            <Link href="/perfil/impacto">
              <Button className="bg-white text-green-700 hover:bg-white/90 font-semibold">Ver Detalle</Button>
            </Link>
          </div>
        </Card>

        {/* Sección Mis Artículos */}
        <Card className="bg-secondary border-secondary p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-accent" />
              <h3 className="text-primary-foreground font-bold text-lg">Mis Artículos Publicados</h3>
            </div>
            <Link href="/perfil/mis-articulos">
              <Button variant="ghost" className="text-accent hover:bg-white/10 text-sm">
                Ver todos <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {misArticulos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {misArticulos.map((articulo) => {
                const typeInfo = getTypeLabel(articulo.tipo)
                return (
                  <Link key={articulo.id} href={`/item/${articulo.id}`}>
                    <div className="bg-primary/50 rounded-lg p-3 hover:bg-primary/70 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-primary-foreground text-sm truncate flex-1">
                          {articulo.titulo}
                        </h4>
                        <Badge className={`text-xs shrink-0 ${typeInfo.color}`}>{typeInfo.label}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-primary-foreground/70">{articulo.ciudad}</span>
                        <span className="text-accent font-bold text-sm">
                          {articulo.precio > 0
                            ? formatPrice(articulo.precio)
                            : articulo.tipo === "donacion"
                              ? "Donación"
                              : "Intercambio"}
                        </span>
                      </div>
                      <div className="mt-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            articulo.estado === "disponible"
                              ? "border-green-500 text-green-400"
                              : articulo.estado === "reservado"
                                ? "border-yellow-500 text-yellow-400"
                                : "border-gray-500 text-gray-400"
                          }`}
                        >
                          {articulo.estado}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <Package className="h-12 w-12 text-primary-foreground/30 mx-auto mb-2" />
              <p className="text-primary-foreground/70 mb-3">No has publicado artículos aún</p>
              <Link href="/publicar">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Publicar mi primer artículo
                </Button>
              </Link>
            </div>
          )}
        </Card>
        {/* Fin sección Mis Artículos */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal - Búsqueda y artículos */}
          <div className="lg:col-span-2">
            <Card className="bg-primary border-secondary p-6 mb-6">
              <ZirakoLogo className="justify-center mb-6" />

              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar productos en Valle del Cauca..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-24 bg-accent text-gray-900 placeholder:text-gray-500 border-none h-12 text-lg"
                />
                <Button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-10 bg-primary text-white hover:bg-primary/90"
                >
                  Buscar
                </Button>
              </form>
            </Card>

            <h3 className="text-accent font-bold text-lg mb-4">Artículos Destacados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredItems.map((item) => {
                const typeInfo = getTypeLabel(item.type)
                return (
                  <Link key={item.id} href={`/item/${item.id}`}>
                    <Card className="bg-secondary border-secondary hover:bg-secondary/90 transition-all hover:-translate-y-1 p-4 h-full">
                      <div className="flex items-start gap-4">
                        <div className="bg-accent rounded-lg p-3 shrink-0">
                          <CategoryIcon category={item.category} className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-bold text-lg text-primary-foreground truncate">{item.name}</h3>
                            <Badge className={`text-xs shrink-0 ${typeInfo.color}`}>{typeInfo.label}</Badge>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-primary-foreground/70 mb-2">
                            <MapPin className="h-3 w-3" />
                            <span>{item.location}, Valle del Cauca</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-primary-foreground/70">{item.condition}</span>
                            <span className="font-bold text-accent">
                              {item.price > 0 ? formatPrice(item.price) : "Donación"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Columna lateral - Accesos rápidos */}
          <div className="flex flex-col gap-4">
            <Link href="/categorias">
              <Card className="bg-secondary border-secondary hover:bg-secondary/90 transition-colors p-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <Menu className="h-10 w-10 text-accent" />
                  <h3 className="font-bold text-lg text-primary-foreground">Categorías</h3>
                  <p className="text-sm text-primary-foreground/70">Explora por categoría</p>
                </div>
              </Card>
            </Link>

            <Link href="/recoleccion">
              <Card className="bg-secondary border-secondary hover:bg-secondary/90 transition-colors p-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-accent"
                  >
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <h3 className="font-bold text-lg text-primary-foreground">Recolección</h3>
                  <p className="text-sm text-primary-foreground/70">Programa una recogida</p>
                </div>
              </Card>
            </Link>

            <Link href="/intercambio">
              <Card className="bg-secondary border-secondary hover:bg-secondary/90 transition-colors p-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-accent"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                  <h3 className="font-bold text-lg text-primary-foreground">Intercambio</h3>
                  <p className="text-sm text-primary-foreground/70">Gestiona propuestas</p>
                </div>
              </Card>
            </Link>

            <Link href="/publicar">
              <Card className="bg-secondary border-secondary hover:bg-secondary/90 transition-colors p-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-accent"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <h3 className="font-bold text-lg text-primary-foreground">Publicar</h3>
                  <p className="text-sm text-primary-foreground/70">Añade un artículo</p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
