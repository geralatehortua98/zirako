"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, Upload, X, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useRef, use, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const categorias = [
  { id: "electronica", nombre: "Electrónica" },
  { id: "muebles", nombre: "Muebles" },
  { id: "ropa", nombre: "Ropa y Accesorios" },
  { id: "hogar", nombre: "Hogar y Cocina" },
  { id: "deportes", nombre: "Deportes" },
  { id: "libros", nombre: "Libros y Educación" },
  { id: "juguetes", nombre: "Juguetes y Juegos" },
  { id: "herramientas", nombre: "Herramientas" },
  { id: "vehiculos", nombre: "Vehículos" },
  { id: "electrodomesticos", nombre: "Electrodomésticos" },
  { id: "otros", nombre: "Otros" },
]

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
  "Pradera",
  "Dagua",
  "Sevilla",
  "Caicedonia",
  "Zarzal",
]

export default function PublicarCategoriaPage({ params }: { params: Promise<{ categoria: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estados del formulario
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [categoriaId, setCategoriaId] = useState(resolvedParams.categoria || "electronica")
  const [condicion, setCondicion] = useState("Usado")
  const [tipo, setTipo] = useState<"venta" | "donacion" | "intercambio">("venta")
  const [precio, setPrecio] = useState("")
  const [ciudad, setCiudad] = useState("Cali")
  const [imagenes, setImagenes] = useState<string[]>([])

  // Estados de UI
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")
  const [itemId, setItemId] = useState<number | null>(null)

  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    // Verificar si está logueado y obtener userId
    const isLoggedIn = localStorage.getItem("zirako_logged_in")
    if (isLoggedIn !== "true") {
      router.push("/auth/login")
      return
    }

    const storedUserId = localStorage.getItem("zirako_user_id")
    if (storedUserId) {
      setUserId(Number.parseInt(storedUserId))
    }
  }, [router])

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const maxImages = 5 - imagenes.length

    Array.from(files)
      .slice(0, maxImages)
      .forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = (event) => {
            if (event.target?.result) {
              setImagenes((prev) => [...prev, event.target!.result as string])
            }
          }
          reader.readAsDataURL(file)
        }
      })

    // Limpiar el input para permitir seleccionar el mismo archivo
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validaciones
      if (!titulo.trim()) {
        throw new Error("El título es requerido")
      }
      if (!descripcion.trim()) {
        throw new Error("La descripción es requerida")
      }
      if (tipo === "venta" && !precio) {
        throw new Error("El precio es requerido para artículos en venta")
      }
      if (imagenes.length === 0) {
        throw new Error("Debes agregar al menos una imagen")
      }

      if (!userId) {
        setError("Debes iniciar sesión para publicar")
        setTimeout(() => {
          router.push("/auth/login")
        }, 2000)
        return
      }

      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: userId, // Enviar userId directamente
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
          categoria_id: categoriaId,
          tipo,
          condicion,
          precio: tipo === "venta" ? Number.parseFloat(precio.replace(/[^0-9]/g, "")) : 0,
          ciudad,
          imagenes,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("zirako_logged_in")
          throw new Error("Tu sesión ha expirado. Por favor inicia sesión de nuevo.")
        }
        throw new Error(data.error || "Error al publicar el artículo")
      }

      setItemId(data.data?.id || null)
      setShowSuccess(true)
    } catch (err: any) {
      setError(err.message || "Error al publicar el artículo")
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrecio = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "")
    if (!numbers) return ""
    return new Intl.NumberFormat("es-CO").format(Number.parseInt(numbers))
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/publicar">
            <Button
              variant="outline"
              className="bg-accent text-accent-foreground border-accent hover:bg-accent/90 h-10 px-4 flex items-center gap-2"
            >
              <ChevronLeft className="h-5 w-5" />
              Regresar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-primary-foreground">Publicar artículo</h1>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">{error}</div>
        )}

        {/* Formulario */}
        <Card className="bg-secondary border-secondary p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="titulo" className="text-primary-foreground font-semibold">
                Título del artículo *
              </Label>
              <Input
                id="titulo"
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Samsung Galaxy S21 como nuevo"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                required
              />
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <Label className="text-primary-foreground font-semibold">Categoría *</Label>
              <Select value={categoriaId} onValueChange={setCategoriaId}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de publicación */}
            <div className="space-y-2">
              <Label className="text-primary-foreground font-semibold">Tipo de publicación *</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTipo("venta")}
                  className={`${
                    tipo === "venta"
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Venta
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTipo("donacion")}
                  className={`${
                    tipo === "donacion"
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Donación
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTipo("intercambio")}
                  className={`${
                    tipo === "intercambio"
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Intercambio
                </Button>
              </div>
            </div>

            {/* Condición */}
            <div className="space-y-2">
              <Label className="text-primary-foreground font-semibold">Condición *</Label>
              <Select value={condicion} onValueChange={setCondicion}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nuevo">Nuevo</SelectItem>
                  <SelectItem value="Como nuevo">Como nuevo</SelectItem>
                  <SelectItem value="Usado">Usado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Precio (solo si es venta) */}
            {tipo === "venta" && (
              <div className="space-y-2">
                <Label htmlFor="precio" className="text-primary-foreground font-semibold">
                  Precio (COP) *
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="precio"
                    type="text"
                    value={precio}
                    onChange={(e) => setPrecio(formatPrecio(e.target.value))}
                    placeholder="150.000"
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 pl-8"
                  />
                </div>
              </div>
            )}

            {/* Ciudad */}
            <div className="space-y-2">
              <Label className="text-primary-foreground font-semibold">Ciudad (Valle del Cauca) *</Label>
              <Select value={ciudad} onValueChange={setCiudad}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ciudadesValle.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-primary-foreground font-semibold">
                Descripción *
              </Label>
              <Textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe el artículo, su estado, características, razón de venta/donación..."
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 min-h-32"
                required
              />
            </div>

            {/* Imágenes */}
            <div className="space-y-2">
              <Label className="text-primary-foreground font-semibold">Imágenes * ({imagenes.length}/5)</Label>

              {/* Input oculto para seleccionar archivos */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />

              {/* Preview de imágenes */}
              {imagenes.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {imagenes.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-200">
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`Imagen ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Botón para agregar imágenes */}
              {imagenes.length < 5 && (
                <div
                  onClick={handleImageClick}
                  className="border-2 border-dashed border-accent rounded-lg p-8 text-center bg-primary/50 hover:bg-primary/70 transition-colors cursor-pointer"
                >
                  <Upload className="h-12 w-12 text-accent mx-auto mb-2" />
                  <p className="text-primary-foreground/80 text-sm">Haz clic para subir imágenes</p>
                  <p className="text-primary-foreground/60 text-xs mt-1">
                    {imagenes.length === 0 ? "Máximo 5 imágenes" : `Puedes agregar ${5 - imagenes.length} más`}
                  </p>
                </div>
              )}
            </div>

            {/* Botón publicar */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-14 text-lg font-bold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Publicando...
                </>
              ) : (
                "Publicar artículo"
              )}
            </Button>
          </form>
        </Card>
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-secondary border-secondary text-primary-foreground">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-500/20 rounded-full p-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">¡Publicación Exitosa!</DialogTitle>
            <DialogDescription className="text-center text-primary-foreground/70">
              Tu artículo ha sido publicado correctamente y ya está visible para otros usuarios de ZIRAKO.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              onClick={() => router.push("/perfil/mis-articulos")}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Ver mis artículos
            </Button>
            <Button
              onClick={() => {
                setShowSuccess(false)
                setTitulo("")
                setDescripcion("")
                setPrecio("")
                setImagenes([])
              }}
              variant="outline"
              className="border-accent text-accent hover:bg-accent/10"
            >
              Publicar otro artículo
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              variant="ghost"
              className="text-primary-foreground/70 hover:text-primary-foreground"
            >
              Volver al inicio
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
