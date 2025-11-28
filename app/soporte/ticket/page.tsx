"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import { ChevronLeft, MessageCircle, CheckCircle, Loader2, Ticket } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function TicketPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    categoria: "",
    asunto: "",
    descripcion: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [ticketNumber, setTicketNumber] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    // Cargar datos del usuario si está logueado
    const nombre = localStorage.getItem("zirako_user_name") || ""
    const email = localStorage.getItem("zirako_user_email") || ""
    setFormData((prev) => ({ ...prev, nombre, email }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          asunto: formData.asunto,
          mensaje: formData.descripcion,
          categoria: formData.categoria,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al crear el ticket")
      }

      // Generar número de ticket con formato ZRK-XXXXX
      const ticketNum = `ZRK-${String(data.data?.id || Math.floor(Math.random() * 90000) + 10000).padStart(5, "0")}`
      setTicketNumber(ticketNum)
      setShowSuccess(true)
    } catch (err: any) {
      setError(err.message || "Error al enviar el ticket")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/90 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="bg-accent text-accent-foreground border-accent hover:bg-accent/90 h-10 px-4 flex items-center gap-2 mb-4"
          >
            <ChevronLeft className="h-5 w-5" />
            Regresar
          </Button>
        </Link>

        <Card className="bg-card border-none p-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <MessageCircle className="h-10 w-10 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Soporte Técnico</h1>

          <p className="text-center text-gray-600 mb-8">
            Envíanos tu consulta y nuestro equipo te responderá lo antes posible
          </p>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-gray-900 font-semibold">
                Nombre completo
              </Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 font-semibold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria" className="text-gray-900 font-semibold">
                Categoría
              </Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData({ ...formData, categoria: value })}
              >
                <SelectTrigger className="h-12 bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tecnico">Problema técnico</SelectItem>
                  <SelectItem value="cuenta">Cuenta y acceso</SelectItem>
                  <SelectItem value="publicacion">Publicación de artículos</SelectItem>
                  <SelectItem value="intercambio">Intercambio y recolección</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="asunto" className="text-gray-900 font-semibold">
                Asunto
              </Label>
              <Input
                id="asunto"
                type="text"
                placeholder="Breve descripción del problema"
                value={formData.asunto}
                onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-gray-900 font-semibold">
                Descripción detallada
              </Label>
              <Textarea
                id="descripcion"
                placeholder="Describe tu problema o consulta en detalle"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="min-h-32 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Ticket"
              )}
            </Button>
          </form>
        </Card>
      </div>

      {/* Popup de éxito */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl text-gray-900">¡Ticket Creado Exitosamente!</DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Tu solicitud ha sido registrada. Te contactaremos pronto.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center my-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Ticket className="h-6 w-6 text-green-600" />
              <span className="text-gray-600 font-medium">Número de Ticket</span>
            </div>
            <p className="text-3xl font-bold text-green-700">{ticketNumber}</p>
            <p className="text-sm text-gray-500 mt-2">Guarda este número para dar seguimiento a tu solicitud</p>
          </div>

          <div className="text-center text-sm text-gray-500 mb-4">
            Recibirás una confirmación en tu correo electrónico
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Volver al Inicio
            </Button>
            <Button
              onClick={() => {
                setShowSuccess(false)
                setFormData({
                  nombre: formData.nombre,
                  email: formData.email,
                  categoria: "",
                  asunto: "",
                  descripcion: "",
                })
              }}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Crear Otro Ticket
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
