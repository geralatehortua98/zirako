"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Truck, Calendar, MapPin, Clock, Package } from "lucide-react"
import Link from "next/link"

interface Recoleccion {
  id: number
  direccion: string
  ciudad: string
  fecha_programada: string
  horario_preferido: string
  descripcion: string
  estado: string
  created_at: string
}

export default function MisRecoleccionesPage() {
  const [recolecciones, setRecolecciones] = useState<Recoleccion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarRecolecciones()
  }, [])

  const cargarRecolecciones = async () => {
    try {
      const res = await fetch("/api/collections?mis_recolecciones=true", {
        credentials: "include",
      })
      const data = await res.json()

      if (data.success) {
        setRecolecciones(data.data || [])
      }
    } catch (error) {
      console.error("Error cargando recolecciones:", error)
    } finally {
      setLoading(false)
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-500/20 text-yellow-400"
      case "confirmada":
        return "bg-blue-500/20 text-blue-400"
      case "en_camino":
        return "bg-purple-500/20 text-purple-400"
      case "completada":
        return "bg-green-500/20 text-green-400"
      case "cancelada":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      pendiente: "Pendiente",
      confirmada: "Confirmada",
      en_camino: "En camino",
      completada: "Completada",
      cancelada: "Cancelada",
    }
    return labels[estado] || estado
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
          <div className="flex items-center gap-4">
            <Link href="/perfil">
              <Button
                variant="outline"
                className="bg-accent text-accent-foreground border-accent hover:bg-accent/90 h-10 px-4 flex items-center gap-2"
              >
                <ChevronLeft className="h-5 w-5" />
                Regresar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">Mis Recolecciones</h1>
          </div>
          <Link href="/recoleccion">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Truck className="h-4 w-4 mr-2" />
              Nueva
            </Button>
          </Link>
        </div>

        {/* Lista de recolecciones */}
        {recolecciones.length === 0 ? (
          <Card className="bg-secondary border-secondary p-8 text-center">
            <Truck className="h-12 w-12 text-accent/50 mx-auto mb-4" />
            <p className="text-primary-foreground/70">No tienes recolecciones programadas</p>
            <Link href="/recoleccion">
              <Button className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                Programar recolección
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {recolecciones.map((rec) => (
              <Card key={rec.id} className="bg-secondary border-secondary p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary rounded-full p-3">
                      <Truck className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-primary-foreground">Recolección #{rec.id}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getEstadoColor(rec.estado)}`}>
                        {getEstadoLabel(rec.estado)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-primary-foreground/70">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(rec.fecha_programada).toLocaleDateString("es-CO")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-foreground/70">
                    <Clock className="h-4 w-4" />
                    <span>{rec.horario_preferido}</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-foreground/70 md:col-span-2">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {rec.direccion}, {rec.ciudad}
                    </span>
                  </div>
                  {rec.descripcion && (
                    <div className="flex items-start gap-2 text-primary-foreground/70 md:col-span-2">
                      <Package className="h-4 w-4 mt-0.5" />
                      <span>{rec.descripcion}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
