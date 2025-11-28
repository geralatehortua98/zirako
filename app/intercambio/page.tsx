"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Play, Package, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"

interface ExchangeProposal {
  id: number
  titulo_ofrecido: string
  titulo_solicitado: string
  imagenes_ofrecido: string[]
  imagenes_solicitado: string[]
  nombre_propone: string
  nombre_recibe: string
  estado: string
  created_at: string
  usuario_propone_id: number
  usuario_recibe_id: number
}

export default function IntercambioPage() {
  const [proposals, setProposals] = useState<ExchangeProposal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchExchanges()
  }, [])

  const fetchExchanges = async () => {
    try {
      const response = await fetch("/api/exchanges")
      const data = await response.json()

      if (data.success) {
        setProposals(data.data || [])
      } else {
        setError(data.error || "Error al cargar intercambios")
      }
    } catch (err) {
      setError("Error al cargar intercambios")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async (id: number) => {
    setActionLoading(id)
    try {
      const response = await fetch("/api/exchanges", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado: "aceptado" }),
      })

      if (response.ok) {
        setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, estado: "aceptado" } : p)))
      }
    } catch (err) {
      console.error("Error al aceptar:", err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id: number) => {
    setActionLoading(id)
    try {
      const response = await fetch("/api/exchanges", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado: "rechazado" }),
      })

      if (response.ok) {
        setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, estado: "rechazado" } : p)))
      }
    } catch (err) {
      console.error("Error al rechazar:", err)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="bg-accent text-accent-foreground border-accent hover:bg-accent/90 h-10 px-4 flex items-center gap-2"
            >
              <ChevronLeft className="h-5 w-5" />
              Regresar
            </Button>
          </Link>
        </div>

        {/* Card principal */}
        <Card className="bg-secondary border-secondary p-6 mb-6">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-accent rounded-full p-6 mb-4 relative">
              <RefreshCw className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-primary-foreground text-center">INTERCAMBIO</h1>
            <p className="text-primary-foreground/70 text-center mt-2">Gestiona tus propuestas de intercambio</p>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-primary-foreground mb-4">Propuestas de intercambio</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-400">{error}</div>
          ) : proposals.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-primary-foreground/30 mx-auto mb-4" />
              <p className="text-primary-foreground/70">No tienes propuestas de intercambio</p>
              <Link href="/dashboard">
                <Button className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">Explorar artículos</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <Card
                  key={proposal.id}
                  className={`bg-primary border-primary p-4 ${
                    proposal.estado === "aceptado" ? "opacity-75" : proposal.estado === "rechazado" ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    {/* Info del intercambio */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          {proposal.imagenes_ofrecido?.[0] ? (
                            <Image
                              src={proposal.imagenes_ofrecido[0] || "/placeholder.svg"}
                              alt={proposal.titulo_ofrecido}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Package className="w-8 h-8 text-primary-foreground/50 m-auto" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-primary-foreground/70">Te ofrecen:</p>
                          <h3 className="font-bold text-primary-foreground truncate">{proposal.titulo_ofrecido}</h3>
                          <p className="text-xs text-primary-foreground/50">de {proposal.nombre_propone}</p>
                        </div>
                      </div>

                      <RefreshCw className="h-6 w-6 text-accent flex-shrink-0" />

                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          {proposal.imagenes_solicitado?.[0] ? (
                            <Image
                              src={proposal.imagenes_solicitado[0] || "/placeholder.svg"}
                              alt={proposal.titulo_solicitado}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Package className="w-8 h-8 text-primary-foreground/50 m-auto" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-primary-foreground/70">Por tu:</p>
                          <h3 className="font-bold text-primary-foreground truncate">{proposal.titulo_solicitado}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    {proposal.estado === "pendiente" && (
                      <div className="flex gap-2 justify-end">
                        <Button
                          onClick={() => handleAccept(proposal.id)}
                          disabled={actionLoading === proposal.id}
                          className="bg-accent text-accent-foreground hover:bg-accent/90 h-10 px-6"
                        >
                          {actionLoading === proposal.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aceptar"}
                        </Button>
                        <Button
                          onClick={() => handleReject(proposal.id)}
                          disabled={actionLoading === proposal.id}
                          variant="outline"
                          className="border-2 border-red-500 text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white h-10 px-6 font-semibold"
                        >
                          Rechazar
                        </Button>
                      </div>
                    )}

                    {proposal.estado === "aceptado" && (
                      <div className="flex justify-end">
                        <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-semibold">
                          Aceptado
                        </span>
                      </div>
                    )}

                    {proposal.estado === "rechazado" && (
                      <div className="flex justify-end">
                        <span className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-semibold">Rechazado</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* Información adicional */}
        <Card className="bg-secondary/50 border-secondary p-4">
          <div className="flex items-start gap-3">
            <Play className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
            <div className="text-sm text-primary-foreground/80">
              <p className="font-semibold mb-1">Sistema de intercambio</p>
              <p>
                Revisa las propuestas de intercambio de otros usuarios. Acepta las que te interesen o rechaza las que no
                se ajusten a tus necesidades. Recibirás notificaciones por correo.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
