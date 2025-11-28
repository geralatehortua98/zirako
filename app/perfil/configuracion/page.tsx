"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Save, User, Building, Phone, MapPin } from "lucide-react"
import Link from "next/link"

const ciudadesValle = [
  "Cali",
  "Palmira",
  "Buenaventura",
  "Tuluá",
  "Cartago",
  "Buga",
  "Jamundí",
  "Yumbo",
  "Sevilla",
  "Candelaria",
]

export default function ConfiguracionPage() {
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "error"; texto: string } | null>(null)
  const [perfil, setPerfil] = useState({
    nombre: "",
    telefono: "",
    ciudad: "Cali",
    direccion: "",
    nombre_empresa: "",
  })

  useEffect(() => {
    cargarPerfil()
  }, [])

  const cargarPerfil = async () => {
    try {
      const res = await fetch("/api/usuarios/perfil", { credentials: "include" })
      const data = await res.json()
      if (data.success) {
        setPerfil({
          nombre: data.data.nombre || "",
          telefono: data.data.telefono || "",
          ciudad: data.data.ciudad || "Cali",
          direccion: data.data.direccion || "",
          nombre_empresa: data.data.nombre_empresa || "",
        })
      }
    } catch (error) {
      console.error("Error cargando perfil:", error)
    }
  }

  const guardarPerfil = async () => {
    setLoading(true)
    setMensaje(null)

    try {
      const res = await fetch("/api/usuarios/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(perfil),
      })

      const data = await res.json()

      if (data.success) {
        setMensaje({ tipo: "success", texto: "Perfil actualizado correctamente" })
        // Actualizar localStorage
        localStorage.setItem("zirako_nombre", perfil.nombre)
      } else {
        setMensaje({ tipo: "error", texto: data.error || "Error al actualizar" })
      }
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error de conexión" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
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
          <h1 className="text-2xl font-bold text-white">Configuración del Perfil</h1>
        </div>

        {mensaje && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              mensaje.tipo === "success"
                ? "bg-green-900/50 text-green-400 border border-green-700"
                : "bg-red-900/50 text-red-400 border border-red-700"
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        <Card className="bg-secondary border-secondary p-6">
          <div className="space-y-6">
            {/* Nombre */}
            <div>
              <Label className="text-primary-foreground flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                Nombre completo
              </Label>
              <Input
                value={perfil.nombre}
                onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
                className="bg-white text-gray-900 border-gray-300"
                placeholder="Tu nombre completo"
              />
            </div>

            {/* Empresa */}
            <div>
              <Label className="text-primary-foreground flex items-center gap-2 mb-2">
                <Building className="h-4 w-4" />
                Nombre de empresa (opcional)
              </Label>
              <Input
                value={perfil.nombre_empresa}
                onChange={(e) => setPerfil({ ...perfil, nombre_empresa: e.target.value })}
                className="bg-white text-gray-900 border-gray-300"
                placeholder="Nombre de tu empresa o emprendimiento"
              />
            </div>

            {/* Teléfono */}
            <div>
              <Label className="text-primary-foreground flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4" />
                Teléfono
              </Label>
              <Input
                value={perfil.telefono}
                onChange={(e) => setPerfil({ ...perfil, telefono: e.target.value })}
                className="bg-white text-gray-900 border-gray-300"
                placeholder="Tu número de teléfono"
              />
            </div>

            {/* Ciudad */}
            <div>
              <Label className="text-primary-foreground flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" />
                Ciudad
              </Label>
              <select
                value={perfil.ciudad}
                onChange={(e) => setPerfil({ ...perfil, ciudad: e.target.value })}
                className="w-full h-10 px-3 rounded-md bg-white text-gray-900 border border-gray-300"
              >
                {ciudadesValle.map((ciudad) => (
                  <option key={ciudad} value={ciudad}>
                    {ciudad}, Valle del Cauca
                  </option>
                ))}
              </select>
            </div>

            {/* Dirección */}
            <div>
              <Label className="text-primary-foreground flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" />
                Dirección
              </Label>
              <Input
                value={perfil.direccion}
                onChange={(e) => setPerfil({ ...perfil, direccion: e.target.value })}
                className="bg-white text-gray-900 border-gray-300"
                placeholder="Tu dirección completa"
              />
            </div>

            <Button
              onClick={guardarPerfil}
              disabled={loading}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
