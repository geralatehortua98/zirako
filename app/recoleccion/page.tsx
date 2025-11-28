"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Truck, Leaf, ChevronLeft, CalendarIcon, CheckCircle, Loader2, AlertCircle, Clock } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

const horariosDisponibles = ["08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00"]

const ciudadesValle = [
  "Cali",
  "Palmira",
  "Buenaventura",
  "Tuluá",
  "Cartago",
  "Buga",
  "Jamundí",
  "Yumbo",
  "Florida",
  "Candelaria",
]

export default function RecoleccionPage() {
  const router = useRouter()
  const [direccion, setDireccion] = useState("")
  const [ciudad, setCiudad] = useState("Cali")
  const [fecha, setFecha] = useState<Date>()
  const [horario, setHorario] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")
  const [recoleccionId, setRecoleccionId] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!direccion.trim()) {
      setError("La dirección es requerida")
      return
    }
    if (!fecha) {
      setError("La fecha es requerida")
      return
    }
    if (!horario) {
      setError("El horario es requerido")
      return
    }
    if (!descripcion.trim()) {
      setError("La descripción es requerida")
      return
    }

    const isLoggedIn = localStorage.getItem("zirako_logged_in")
    if (isLoggedIn !== "true") {
      setError("Debes iniciar sesión para programar una recolección")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Incluir cookies en la petición
        body: JSON.stringify({
          direccion: direccion.trim(),
          ciudad,
          fecha: fecha.toISOString(),
          horario,
          descripcion: descripcion.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("zirako_logged_in")
          throw new Error("Tu sesión ha expirado. Por favor inicia sesión de nuevo.")
        }
        throw new Error(data.error || "Error al programar la recolección")
      }

      // Generar ID de recolección
      const id = `REC-${Date.now().toString(36).toUpperCase()}`
      setRecoleccionId(data.data?.id ? `REC-${data.data.id}` : id)
      setShowSuccess(true)
    } catch (err: any) {
      setError(err.message || "Error al programar la recolección")
    } finally {
      setIsLoading(false)
    }
  }

  // Deshabilitar fechas pasadas
  const disabledDays = { before: new Date() }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/90">
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
        <Card className="bg-secondary border-secondary p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-accent rounded-full p-6 mb-4">
              <div className="relative">
                <Truck className="h-16 w-16 text-primary" />
                <Leaf className="h-6 w-6 text-primary absolute -top-2 -right-2" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-primary-foreground text-center">RECOLECCIÓN</h1>
            <p className="text-primary-foreground/70 text-center mt-2">Programa la recolección de tus artículos</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ciudad */}
            <div className="space-y-2">
              <Label className="text-primary-foreground font-semibold text-lg">Ciudad</Label>
              <Select value={ciudad} onValueChange={setCiudad}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ciudadesValle.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}, Valle del Cauca
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <Label htmlFor="direccion" className="text-primary-foreground font-semibold text-lg">
                Dirección completa
              </Label>
              <Input
                id="direccion"
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Ej: Calle 5 #10-20, Barrio San Fernando"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12"
                disabled={isLoading}
              />
            </div>

            {/* Fecha */}
            <div className="space-y-2">
              <Label className="text-primary-foreground font-semibold text-lg">Fecha de recolección</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 bg-white border-gray-300 text-gray-900 hover:bg-gray-50",
                      !fecha && "text-gray-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fecha ? format(fecha, "PPP", { locale: es }) : "Selecciona una fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fecha}
                    onSelect={setFecha}
                    disabled={disabledDays}
                    locale={es}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Horario */}
            <div className="space-y-2">
              <Label className="text-primary-foreground font-semibold text-lg">Horario disponible</Label>
              <Select value={horario} onValueChange={setHorario}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900 h-12">
                  <SelectValue placeholder="Selecciona un horario" />
                </SelectTrigger>
                <SelectContent>
                  {horariosDisponibles.map((h) => (
                    <SelectItem key={h} value={h}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {h}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-primary-foreground font-semibold text-lg">
                Descripción de artículos
              </Label>
              <Textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe los artículos a recolectar (cantidad, tipo, tamaño aproximado...)"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 min-h-32 resize-none"
                disabled={isLoading}
              />
            </div>

            {/* Botón */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-14 text-lg font-bold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Programando...
                </>
              ) : (
                "Programar recolección"
              )}
            </Button>
          </form>
        </Card>

        {/* Información adicional */}
        <Card className="bg-secondary/50 border-secondary p-4 mt-6">
          <div className="flex items-start gap-3">
            <Leaf className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
            <div className="text-sm text-primary-foreground/80">
              <p className="font-semibold mb-1">Servicio de recolección gratuito</p>
              <p>
                Nuestro equipo recogerá tus artículos en el horario acordado. Contribuye a la economía circular y ayuda
                al medio ambiente.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Dialog de éxito */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-secondary border-secondary text-primary-foreground">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-500/20 rounded-full p-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">¡Recolección Programada!</DialogTitle>
            <DialogDescription className="text-center text-primary-foreground/70">
              Tu recolección ha sido programada exitosamente.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-primary rounded-lg p-4 my-4">
            <p className="text-center text-primary-foreground/70 text-sm">Tu ID de recolección</p>
            <p className="text-center text-2xl font-bold text-accent">{recoleccionId}</p>
          </div>
          <div className="text-sm text-primary-foreground/70 space-y-2">
            <p>
              <strong>Fecha:</strong> {fecha ? format(fecha, "PPP", { locale: es }) : ""}
            </p>
            <p>
              <strong>Horario:</strong> {horario}
            </p>
            <p>
              <strong>Dirección:</strong> {direccion}, {ciudad}
            </p>
          </div>
          <p className="text-xs text-primary-foreground/50 text-center mt-2">
            Recibirás un correo de recordatorio un día antes de la recolección.
          </p>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Volver al inicio
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
