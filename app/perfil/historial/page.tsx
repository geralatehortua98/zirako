"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Package, TrendingUp, Gift, RefreshCw, DollarSign, Truck } from "lucide-react"
import Link from "next/link"

interface HistorialItem {
  id: number
  tipo: string
  titulo: string
  fecha: string
  puntos: number
  estado: string
  co2_ahorrado?: number
}

export default function HistorialPage() {
  const [historial, setHistorial] = useState<HistorialItem[]>([])
  const [totales, setTotales] = useState({ puntos: 0, transacciones: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarHistorial()
  }, [])

  const cargarHistorial = async () => {
    try {
      // Cargar impacto ambiental como historial
      const res = await fetch("/api/impacto", { credentials: "include" })
      const data = await res.json()

      if (data.success && data.data.ultimas_acciones) {
        const items = data.data.ultimas_acciones.map((accion: any) => ({
          id: accion.id,
          tipo: accion.tipo_accion,
          titulo: accion.nombre_item || getNombreAccion(accion.tipo_accion),
          fecha: new Date(accion.created_at).toLocaleDateString("es-CO"),
          puntos: getPuntosPorAccion(accion.tipo_accion),
          estado: "completado",
          co2_ahorrado: accion.co2_ahorrado,
        }))
        setHistorial(items)
        setTotales({
          puntos: items.reduce((acc: number, item: HistorialItem) => acc + item.puntos, 0),
          transacciones: items.length,
        })
      }
    } catch (error) {
      console.error("Error cargando historial:", error)
    } finally {
      setLoading(false)
    }
  }

  const getNombreAccion = (tipo: string) => {
    const nombres: Record<string, string> = {
      donacion: "Donación realizada",
      intercambio: "Intercambio completado",
      venta: "Venta realizada",
      recoleccion: "Recolección completada",
    }
    return nombres[tipo] || tipo
  }

  const getPuntosPorAccion = (tipo: string) => {
    const puntos: Record<string, number> = {
      donacion: 50,
      intercambio: 30,
      venta: 10,
      recoleccion: 20,
    }
    return puntos[tipo] || 0
  }

  const getIconoAccion = (tipo: string) => {
    switch (tipo) {
      case "donacion":
        return <Gift className="h-6 w-6 text-pink-400" />
      case "intercambio":
        return <RefreshCw className="h-6 w-6 text-blue-400" />
      case "venta":
        return <DollarSign className="h-6 w-6 text-green-400" />
      case "recoleccion":
        return <Truck className="h-6 w-6 text-orange-400" />
      default:
        return <Package className="h-6 w-6 text-accent" />
    }
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
        <div className="flex items-center gap-4 mb-8">
          <Link href="/perfil">
            <Button
              variant="outline"
              className="bg-accent text-accent-foreground border-accent hover:bg-accent/90 h-10 px-4 flex items-center gap-2"
            >
              <ChevronLeft className="h-5 w-5" />
              Regresar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Historial de Actividad</h1>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-secondary border-secondary p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-accent" />
              <div>
                <p className="text-sm text-primary-foreground/70">Total Ganado</p>
                <p className="text-2xl font-bold text-accent">+{totales.puntos}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-secondary border-secondary p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-accent" />
              <div>
                <p className="text-sm text-primary-foreground/70">Transacciones</p>
                <p className="text-2xl font-bold text-primary-foreground">{totales.transacciones}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de historial */}
        <div className="space-y-4">
          {historial.length === 0 ? (
            <Card className="bg-secondary border-secondary p-8 text-center">
              <Package className="h-12 w-12 text-accent/50 mx-auto mb-4" />
              <p className="text-primary-foreground/70">Aún no tienes actividad registrada</p>
              <Link href="/publicar">
                <Button className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                  Publicar mi primer artículo
                </Button>
              </Link>
            </Card>
          ) : (
            historial.map((item) => (
              <Card key={item.id} className="bg-secondary border-secondary p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary rounded-full p-3">{getIconoAccion(item.tipo)}</div>
                    <div>
                      <h3 className="font-bold text-primary-foreground">{item.titulo}</h3>
                      <p className="text-sm text-primary-foreground/70 capitalize">{item.tipo}</p>
                      <p className="text-xs text-primary-foreground/50">{item.fecha}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-accent">+{item.puntos}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">{item.estado}</span>
                    {item.co2_ahorrado && <p className="text-xs text-green-400 mt-1">-{item.co2_ahorrado}kg CO₂</p>}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
