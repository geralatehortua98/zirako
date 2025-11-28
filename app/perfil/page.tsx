"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ChevronLeft,
  Award,
  History,
  RefreshCw,
  HeadphonesIcon,
  LogOut,
  Package,
  Leaf,
  Settings,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: number
  nombre: string
  email: string
  telefono: string
  ciudad: string
  nombre_empresa: string
  foto_perfil: string
  puntos: number
  nivel: number
  nivel_nombre: string
  puntos_siguiente_nivel: number
  created_at: string
  estadisticas: {
    total_articulos: number
    articulos_venta: number
    articulos_donacion: number
    articulos_intercambio: number
    total_intercambios: number
    total_recolecciones: number
    total_favoritos: number
  }
  impacto_ambiental: {
    total_co2_ahorrado: number
    acciones: {
      donaciones: number
      ventas: number
      intercambios: number
      recolecciones: number
    }
  }
}

export default function PerfilPage() {
  const router = useRouter()
  const [perfil, setPerfil] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarPerfil()
  }, [])

  const cargarPerfil = async () => {
    try {
      const res = await fetch("/api/usuarios/perfil", {
        credentials: "include",
      })
      const data = await res.json()

      if (data.success) {
        setPerfil(data.data)
      } else {
        // Si no está autenticado, usar datos de localStorage
        const nombre = localStorage.getItem("zirako_nombre") || "Usuario ZIRAKO"
        const email = localStorage.getItem("zirako_email") || ""
        setPerfil({
          id: 0,
          nombre,
          email,
          telefono: "",
          ciudad: "Cali",
          nombre_empresa: "",
          foto_perfil: "",
          puntos: 0,
          nivel: 1,
          nivel_nombre: "Bronce",
          puntos_siguiente_nivel: 500,
          created_at: new Date().toISOString(),
          estadisticas: {
            total_articulos: 0,
            articulos_venta: 0,
            articulos_donacion: 0,
            articulos_intercambio: 0,
            total_intercambios: 0,
            total_recolecciones: 0,
            total_favoritos: 0,
          },
          impacto_ambiental: {
            total_co2_ahorrado: 0,
            acciones: { donaciones: 0, ventas: 0, intercambios: 0, recolecciones: 0 },
          },
        })
      }
    } catch (error) {
      console.error("Error cargando perfil:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    localStorage.removeItem("zirako_logged_in")
    localStorage.removeItem("zirako_email")
    localStorage.removeItem("zirako_nombre")
    localStorage.removeItem("zirako_user_id")
    router.push("/auth/login")
  }

  const getNivelColor = (nivel: number) => {
    const colores: Record<number, string> = {
      1: "text-amber-600", // Bronce
      2: "text-gray-400", // Plata
      3: "text-yellow-500", // Oro
      4: "text-cyan-400", // Platino
      5: "text-purple-400", // Diamante
    }
    return colores[nivel] || "text-amber-600"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="bg-accent text-accent-foreground border-accent hover:bg-accent/90 h-10 px-4 flex items-center gap-2"
            >
              <ChevronLeft className="h-5 w-5" />
              Regresar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
          <Link href="/perfil/configuracion">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Información del usuario */}
        <Card className="bg-secondary border-secondary p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-accent rounded-full p-4">
              {perfil?.foto_perfil ? (
                <img
                  src={perfil.foto_perfil || "/placeholder.svg"}
                  alt={perfil.nombre}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary-foreground">{perfil?.nombre}</h2>
              <p className="text-primary-foreground/70">{perfil?.email}</p>
              {perfil?.nombre_empresa && <p className="text-sm text-accent">{perfil.nombre_empresa}</p>}
            </div>
          </div>

          {/* Puntos y Nivel */}
          <div className="bg-primary rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className={`h-8 w-8 ${getNivelColor(perfil?.nivel || 1)}`} />
                <div>
                  <p className="text-sm text-primary-foreground/70">Puntos ZIRAKO</p>
                  <p className="text-3xl font-bold text-accent">{perfil?.puntos?.toLocaleString() || 0}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary-foreground/70">Nivel</p>
                <p className={`text-2xl font-bold ${getNivelColor(perfil?.nivel || 1)}`}>
                  {perfil?.nivel_nombre || "Bronce"}
                </p>
              </div>
            </div>
            {perfil?.puntos_siguiente_nivel && perfil.puntos_siguiente_nivel > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-primary-foreground/60 mb-1">
                  <span>Progreso al siguiente nivel</span>
                  <span>{perfil.puntos_siguiente_nivel} puntos restantes</span>
                </div>
                <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, ((perfil.puntos || 0) / ((perfil.puntos || 0) + perfil.puntos_siguiente_nivel)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Impacto Ambiental Resumen */}
          <div className="bg-green-900/30 rounded-lg p-4 border border-green-700/50">
            <div className="flex items-center gap-3 mb-3">
              <Leaf className="h-6 w-6 text-green-400" />
              <h3 className="font-semibold text-green-400">Tu Impacto Ambiental</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-white">
                  {perfil?.impacto_ambiental?.total_co2_ahorrado?.toFixed(1) || 0} kg
                </p>
                <p className="text-sm text-green-400/70">CO₂ evitado</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {(perfil?.impacto_ambiental?.acciones?.donaciones || 0) +
                    (perfil?.impacto_ambiental?.acciones?.intercambios || 0) +
                    (perfil?.impacto_ambiental?.acciones?.ventas || 0)}
                </p>
                <p className="text-sm text-green-400/70">Acciones realizadas</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-secondary border-secondary p-4 text-center">
            <p className="text-2xl font-bold text-accent">{perfil?.estadisticas?.total_articulos || 0}</p>
            <p className="text-xs text-primary-foreground/70">Artículos</p>
          </Card>
          <Card className="bg-secondary border-secondary p-4 text-center">
            <p className="text-2xl font-bold text-accent">{perfil?.estadisticas?.total_intercambios || 0}</p>
            <p className="text-xs text-primary-foreground/70">Intercambios</p>
          </Card>
          <Card className="bg-secondary border-secondary p-4 text-center">
            <p className="text-2xl font-bold text-accent">{perfil?.estadisticas?.total_recolecciones || 0}</p>
            <p className="text-xs text-primary-foreground/70">Recolecciones</p>
          </Card>
        </div>

        {/* Opciones del perfil */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link href="/perfil/mis-articulos">
            <Card className="bg-secondary border-secondary hover:bg-secondary/90 transition-colors p-6 h-full">
              <div className="flex items-center gap-4">
                <div className="bg-primary rounded-full p-3">
                  <Package className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary-foreground">Mis Artículos</h3>
                  <p className="text-sm text-primary-foreground/70">
                    {perfil?.estadisticas?.total_articulos || 0} publicados
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/perfil/impacto">
            <Card className="bg-secondary border-secondary hover:bg-secondary/90 transition-colors p-6 h-full">
              <div className="flex items-center gap-4">
                <div className="bg-green-900 rounded-full p-3">
                  <Leaf className="h-8 w-8 text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary-foreground">Dashboard Ambiental</h3>
                  <p className="text-sm text-green-400">
                    {perfil?.impacto_ambiental?.total_co2_ahorrado?.toFixed(1) || 0} kg CO₂ ahorrado
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/perfil/historial">
            <Card className="bg-secondary border-secondary hover:bg-secondary/90 transition-colors p-6 h-full">
              <div className="flex items-center gap-4">
                <div className="bg-primary rounded-full p-3">
                  <History className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary-foreground">Historial</h3>
                  <p className="text-sm text-primary-foreground/70">Ver todas tus transacciones</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/perfil/intercambios">
            <Card className="bg-secondary border-secondary hover:bg-secondary/90 transition-colors p-6 h-full">
              <div className="flex items-center gap-4">
                <div className="bg-primary rounded-full p-3">
                  <RefreshCw className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary-foreground">Mis Intercambios</h3>
                  <p className="text-sm text-primary-foreground/70">
                    {perfil?.estadisticas?.total_intercambios || 0} intercambios
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/perfil/recolecciones">
            <Card className="bg-secondary border-secondary hover:bg-secondary/90 transition-colors p-6 h-full">
              <div className="flex items-center gap-4">
                <div className="bg-primary rounded-full p-3">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary-foreground">Mis Recolecciones</h3>
                  <p className="text-sm text-primary-foreground/70">
                    {perfil?.estadisticas?.total_recolecciones || 0} programadas
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/perfil/soporte">
            <Card className="bg-secondary border-secondary hover:bg-secondary/90 transition-colors p-6 h-full">
              <div className="flex items-center gap-4">
                <div className="bg-primary rounded-full p-3">
                  <HeadphonesIcon className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary-foreground">Soporte Técnico</h3>
                  <p className="text-sm text-primary-foreground/70">Ayuda y asistencia</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full bg-red-500/20 border-2 border-red-500 text-red-400 hover:bg-red-500/30 hover:text-red-300 h-14 font-semibold text-base"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
