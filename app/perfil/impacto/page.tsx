"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ChevronLeft,
  Leaf,
  TreePine,
  Car,
  Droplets,
  ShoppingBag,
  Gift,
  RefreshCw,
  DollarSign,
  Truck,
} from "lucide-react"
import Link from "next/link"

interface ImpactoData {
  total_co2_ahorrado: number
  total_acciones: number
  desglose: Array<{
    tipo_accion: string
    cantidad: number
    co2_total: number
  }>
  mensual: Array<{
    mes: string
    co2_mes: number
    acciones_mes: number
  }>
  ultimas_acciones: Array<{
    id: number
    tipo_accion: string
    co2_ahorrado: number
    nombre_item: string
    created_at: string
  }>
  equivalencias: {
    arboles_equivalentes: number
    km_auto_evitados: number
    litros_agua_ahorrados: number
    bolsas_plastico_evitadas: number
  }
}

export default function ImpactoAmbientalPage() {
  const [impacto, setImpacto] = useState<ImpactoData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarImpacto()
  }, [])

  const cargarImpacto = async () => {
    try {
      const res = await fetch("/api/impacto", { credentials: "include" })
      const data = await res.json()

      if (data.success) {
        setImpacto(data.data)
      } else {
        // Datos por defecto si no hay sesión
        setImpacto({
          total_co2_ahorrado: 0,
          total_acciones: 0,
          desglose: [],
          mensual: [],
          ultimas_acciones: [],
          equivalencias: {
            arboles_equivalentes: 0,
            km_auto_evitados: 0,
            litros_agua_ahorrados: 0,
            bolsas_plastico_evitadas: 0,
          },
        })
      }
    } catch (error) {
      console.error("Error cargando impacto:", error)
    } finally {
      setLoading(false)
    }
  }

  const getIconoAccion = (tipo: string) => {
    switch (tipo) {
      case "donacion":
        return <Gift className="h-5 w-5 text-pink-400" />
      case "intercambio":
        return <RefreshCw className="h-5 w-5 text-blue-400" />
      case "venta":
        return <DollarSign className="h-5 w-5 text-green-400" />
      case "recoleccion":
        return <Truck className="h-5 w-5 text-orange-400" />
      default:
        return <Leaf className="h-5 w-5 text-green-400" />
    }
  }

  const getNombreAccion = (tipo: string) => {
    const nombres: Record<string, string> = {
      donacion: "Donación",
      intercambio: "Intercambio",
      venta: "Venta",
      recoleccion: "Recolección",
    }
    return nombres[tipo] || tipo
  }

  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
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
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Leaf className="h-7 w-7 text-green-400" />
              Dashboard Ambiental
            </h1>
            <p className="text-sm text-green-400/70">Tu impacto en el planeta</p>
          </div>
        </div>

        {/* Total CO2 Ahorrado */}
        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50 p-6 mb-6">
          <div className="text-center">
            <p className="text-sm text-green-400/80 mb-2">Total de CO₂ evitado</p>
            <p className="text-6xl font-bold text-white mb-2">
              {impacto?.total_co2_ahorrado?.toFixed(1) || 0}
              <span className="text-2xl text-green-400 ml-2">kg</span>
            </p>
            <p className="text-green-400/70">Gracias a tus {impacto?.total_acciones || 0} acciones sostenibles</p>
          </div>
        </Card>

        {/* Equivalencias */}
        <h2 className="text-lg font-semibold text-white mb-4">Esto equivale a...</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-secondary border-secondary p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-900/50 rounded-full p-2">
                <TreePine className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{impacto?.equivalencias?.arboles_equivalentes || 0}</p>
                <p className="text-xs text-primary-foreground/70">Árboles plantados</p>
              </div>
            </div>
          </Card>

          <Card className="bg-secondary border-secondary p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-900/50 rounded-full p-2">
                <Car className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{impacto?.equivalencias?.km_auto_evitados || 0}</p>
                <p className="text-xs text-primary-foreground/70">Km en auto evitados</p>
              </div>
            </div>
          </Card>

          <Card className="bg-secondary border-secondary p-4">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-900/50 rounded-full p-2">
                <Droplets className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{impacto?.equivalencias?.litros_agua_ahorrados || 0}</p>
                <p className="text-xs text-primary-foreground/70">Litros de agua</p>
              </div>
            </div>
          </Card>

          <Card className="bg-secondary border-secondary p-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-900/50 rounded-full p-2">
                <ShoppingBag className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{impacto?.equivalencias?.bolsas_plastico_evitadas || 0}</p>
                <p className="text-xs text-primary-foreground/70">Bolsas plásticas</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Desglose por tipo */}
        <h2 className="text-lg font-semibold text-white mb-4">Desglose por acción</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { tipo: "donacion", label: "Donaciones", co2: 3, color: "pink" },
            { tipo: "intercambio", label: "Intercambios", co2: 2, color: "blue" },
            { tipo: "venta", label: "Ventas", co2: 1, color: "green" },
            { tipo: "recoleccion", label: "Recolecciones", co2: 0.5, color: "orange" },
          ].map((item) => {
            const data = impacto?.desglose?.find((d) => d.tipo_accion === item.tipo)
            return (
              <Card key={item.tipo} className="bg-secondary border-secondary p-4 text-center">
                {getIconoAccion(item.tipo)}
                <p className="text-xl font-bold text-white mt-2">{data?.cantidad || 0}</p>
                <p className="text-xs text-primary-foreground/70">{item.label}</p>
                <p className="text-xs text-green-400 mt-1">{((data?.cantidad || 0) * item.co2).toFixed(1)} kg CO₂</p>
              </Card>
            )
          })}
        </div>

        {/* Gráfica mensual (simple) */}
        {impacto?.mensual && impacto.mensual.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-white mb-4">Impacto mensual</h2>
            <Card className="bg-secondary border-secondary p-4 mb-6">
              <div className="flex items-end justify-between h-32 gap-2">
                {impacto.mensual
                  .slice(0, 6)
                  .reverse()
                  .map((m, i) => {
                    const maxCo2 = Math.max(...impacto.mensual.map((x) => Number(x.co2_mes)))
                    const height = maxCo2 > 0 ? (Number(m.co2_mes) / maxCo2) * 100 : 0
                    const mesNum = Number.parseInt(m.mes.split("-")[1]) - 1

                    return (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-green-500 rounded-t transition-all"
                          style={{ height: `${Math.max(height, 5)}%` }}
                        />
                        <p className="text-xs text-primary-foreground/70 mt-2">{meses[mesNum]}</p>
                        <p className="text-xs text-green-400">{Number(m.co2_mes).toFixed(1)}</p>
                      </div>
                    )
                  })}
              </div>
            </Card>
          </>
        )}

        {/* Últimas acciones */}
        <h2 className="text-lg font-semibold text-white mb-4">Últimas acciones</h2>
        <div className="space-y-3">
          {impacto?.ultimas_acciones && impacto.ultimas_acciones.length > 0 ? (
            impacto.ultimas_acciones.map((accion) => (
              <Card key={accion.id} className="bg-secondary border-secondary p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary rounded-full p-2">{getIconoAccion(accion.tipo_accion)}</div>
                    <div>
                      <p className="font-medium text-primary-foreground">
                        {accion.nombre_item || getNombreAccion(accion.tipo_accion)}
                      </p>
                      <p className="text-xs text-primary-foreground/70">
                        {new Date(accion.created_at).toLocaleDateString("es-CO")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">-{accion.co2_ahorrado} kg</p>
                    <p className="text-xs text-green-400/70">CO₂</p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="bg-secondary border-secondary p-8 text-center">
              <Leaf className="h-12 w-12 text-green-400/50 mx-auto mb-4" />
              <p className="text-primary-foreground/70">Aún no tienes acciones registradas</p>
              <p className="text-sm text-primary-foreground/50 mt-2">
                Publica, dona, intercambia o vende artículos para generar impacto
              </p>
              <Link href="/publicar">
                <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white">Publicar mi primer artículo</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
