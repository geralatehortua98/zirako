"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Package, Trash2, Eye, Loader2, Plus, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Item {
  id: number
  titulo: string
  descripcion: string
  tipo: "venta" | "donacion" | "intercambio"
  condicion: string
  precio: number
  ciudad: string
  imagenes: string[]
  estado: string
  vistas: number
  created_at: string
  nombre_categoria: string
}

export default function MisArticulosPage() {
  const router = useRouter()
  const [articulos, setArticulos] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("zirako_logged_in")
    if (isLoggedIn !== "true") {
      router.push("/auth/login")
      return
    }
    fetchArticulos()
  }, [router])

  const fetchArticulos = async () => {
    try {
      const userId = localStorage.getItem("zirako_user_id")
      const response = await fetch(`/api/items/mis-articulos?userId=${userId}`, {
        credentials: "include",
      })
      const data = await response.json()

      if (response.status === 401) {
        localStorage.removeItem("zirako_logged_in")
        router.push("/auth/login")
        return
      }

      if (data.success) {
        setArticulos(data.data)
      } else {
        setError(data.error || "Error al cargar artículos")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)

    try {
      const userId = localStorage.getItem("zirako_user_id")
      const response = await fetch(`/api/items/${deleteId}?userId=${userId}`, {
        method: "DELETE",
        credentials: "include",
      })
      const data = await response.json()

      if (data.success) {
        setArticulos((prev) => prev.filter((a) => a.id !== deleteId))
      } else {
        setError(data.error || "Error al eliminar")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "venta":
        return <Badge className="bg-emerald-600 text-white">Venta</Badge>
      case "donacion":
        return <Badge className="bg-purple-600 text-white">Donación</Badge>
      case "intercambio":
        return <Badge className="bg-orange-500 text-white">Intercambio</Badge>
      default:
        return null
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "disponible":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Disponible
          </Badge>
        )
      case "reservado":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Reservado
          </Badge>
        )
      case "completado":
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-500">
            Completado
          </Badge>
        )
      default:
        return null
    }
  }

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
            <h1 className="text-2xl font-bold text-primary-foreground">Mis Artículos</h1>
          </div>
          <Link href="/publicar">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-5 w-5 mr-2" />
              Publicar
            </Button>
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">{error}</div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : articulos.length === 0 ? (
          /* Sin artículos */
          <Card className="bg-secondary border-secondary p-12 text-center">
            <Package className="h-16 w-16 text-accent mx-auto mb-4" />
            <h2 className="text-xl font-bold text-primary-foreground mb-2">No tienes artículos publicados</h2>
            <p className="text-primary-foreground/70 mb-6">
              Comienza a vender, donar o intercambiar tus artículos en desuso
            </p>
            <Link href="/publicar">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-5 w-5 mr-2" />
                Publicar mi primer artículo
              </Button>
            </Link>
          </Card>
        ) : (
          /* Lista de artículos */
          <div className="space-y-4">
            {articulos.map((item) => (
              <Card key={item.id} className="bg-secondary border-secondary p-4">
                <div className="flex gap-4">
                  {/* Imagen */}
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    {item.imagenes && item.imagenes.length > 0 ? (
                      <Image
                        src={item.imagenes[0] || "/placeholder.svg"}
                        alt={item.titulo}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg text-primary-foreground truncate">{item.titulo}</h3>
                      <div className="flex gap-1 flex-shrink-0">
                        {getTipoBadge(item.tipo)}
                        {getEstadoBadge(item.estado)}
                      </div>
                    </div>

                    <p className="text-sm text-primary-foreground/70 mt-1">
                      {item.nombre_categoria} • {item.condicion}
                    </p>

                    <div className="flex items-center gap-1 text-sm text-primary-foreground/60 mt-1">
                      <MapPin className="h-4 w-4" />
                      {item.ciudad}
                    </div>

                    {item.tipo === "venta" && item.precio > 0 && (
                      <p className="text-accent font-bold text-lg mt-2">{formatPrecio(item.precio)}</p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4 text-sm text-primary-foreground/60">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {item.vistas} vistas
                        </span>
                        <span>{formatFecha(item.created_at)}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/item/${item.id}`)}
                          className="border-accent text-accent hover:bg-accent/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteId(item.id)}
                          className="border-red-500 text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-secondary border-secondary">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary-foreground">¿Eliminar este artículo?</AlertDialogTitle>
            <AlertDialogDescription className="text-primary-foreground/70">
              Esta acción no se puede deshacer. El artículo será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-accent text-accent hover:bg-accent/10 bg-transparent">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
