"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, MessageCircle, Loader2, CheckCircle, AlertCircle, Leaf } from "lucide-react"

const ciudadesValle = [
  "Cali",
  "Palmira",
  "Buenaventura",
  "Tuluá",
  "Buga",
  "Cartago",
  "Jamundí",
  "Yumbo",
  "Candelaria",
  "Florida",
  "Pradera",
  "Zarzal",
  "Sevilla",
  "Caicedonia",
  "Roldanillo",
  "La Unión",
  "Dagua",
  "Ginebra",
  "El Cerrito",
  "Guacarí",
]

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    ciudad: "",
    direccion: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }
    if (!formData.acceptTerms) {
      setError("Debes aceptar los términos y condiciones")
      return
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }
    if (!formData.ciudad) {
      setError("Debes seleccionar tu ciudad")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          ciudad: formData.ciudad,
          direccion: formData.direccion,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar usuario")
      }

      setShowSuccess(true)
    } catch (err: any) {
      setError(err.message || "Error al registrar usuario")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-primary rounded-lg p-8">
          <Link href="/auth/login">
            <Button
              variant="outline"
              className="bg-accent text-accent-foreground border-accent hover:bg-accent/90 h-10 px-4 flex items-center gap-2 mb-4"
            >
              <ChevronLeft className="h-5 w-5" />
              Regresar
            </Button>
          </Link>

          <div className="flex justify-center mb-4">
            <div className="bg-accent/20 rounded-full p-4">
              <Leaf className="h-12 w-12 text-accent" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-accent mb-2 text-center">ZIRAKO</h1>
          <p className="text-accent text-sm mb-6 text-center">Crear cuenta nueva</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-accent text-sm">Nombre completo *</Label>
              <Input
                type="text"
                placeholder="Ingresa tu nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white text-gray-900 placeholder:text-gray-500 border-none h-12"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-accent text-sm">Correo electrónico *</Label>
              <Input
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white text-gray-900 placeholder:text-gray-500 border-none h-12"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-accent text-sm">Teléfono</Label>
              <Input
                type="tel"
                placeholder="300 123 4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-white text-gray-900 placeholder:text-gray-500 border-none h-12"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-accent text-sm">Ciudad (Valle del Cauca) *</Label>
              <Select
                value={formData.ciudad}
                onValueChange={(value) => setFormData({ ...formData, ciudad: value })}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-white text-gray-900 border-none h-12">
                  <SelectValue placeholder="Selecciona tu ciudad" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {ciudadesValle.map((ciudad) => (
                    <SelectItem key={ciudad} value={ciudad} className="text-gray-900">
                      {ciudad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-accent text-sm">Dirección</Label>
              <Input
                type="text"
                placeholder="Calle, barrio, número"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="bg-white text-gray-900 placeholder:text-gray-500 border-none h-12"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-accent text-sm">Contraseña *</Label>
              <Input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-white text-gray-900 placeholder:text-gray-500 border-none h-12"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-accent text-sm">Confirmar contraseña *</Label>
              <Input
                type="password"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="bg-white text-gray-900 placeholder:text-gray-500 border-none h-12"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                className="border-accent data-[state=checked]:bg-accent"
                disabled={isLoading}
              />
              <Label htmlFor="terms" className="text-accent text-sm cursor-pointer">
                Acepto los términos y condiciones
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-base font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Crear Cuenta"
              )}
            </Button>

            <div className="text-center">
              <span className="text-accent text-sm">¿Ya tienes cuenta? </span>
              <Link href="/auth/login" className="text-accent text-sm font-semibold hover:underline">
                Inicia sesión
              </Link>
            </div>
          </form>

          <Link href="/soporte/ticket" className="mt-6 block">
            <Button
              variant="outline"
              className="w-full border-accent/50 text-accent hover:bg-accent/10 h-10 text-sm font-medium bg-transparent flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              ¿Necesitas ayuda? Envía un ticket
            </Button>
          </Link>

          <div className="mt-6 text-accent text-xs text-center">T &C Versión 1.2</div>
        </div>
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-secondary border-secondary text-primary-foreground">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-500/20 rounded-full p-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">¡Cuenta Creada!</DialogTitle>
            <DialogDescription className="text-center text-primary-foreground/70">
              Tu cuenta ha sido creada exitosamente. Hemos enviado un correo de bienvenida a {formData.email}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              onClick={() => router.push("/auth/login")}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Iniciar Sesión
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
