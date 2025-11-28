"use client"

import type React from "react"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ChevronLeft, MapPin, Search, ShoppingCart, Gift, Repeat, Loader2 } from "lucide-react"
import Link from "next/link"

interface Articulo {
  id: number
  titulo: string
  descripcion: string
  tipo: string
  condicion: string
  precio: number
  ciudad: string
  imagenes: string[]
  nombre_vendedor: string
  nombre_categoria: string
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price)
}

function getTypeLabel(type: string): { label: string; color: string } {
  switch (type) {
    case "venta":
      return { label: "Venta", color: "bg-emerald-600 text-white" }
    case "donacion":
      return { label: "Donación", color: "bg-purple-600 text-white" }
    case "intercambio":
      return { label: "Intercambio", color: "bg-orange-500 text-white" }
    default:
      return { label: "Disponible", color: "bg-gray-500 text-white" }
  }
}

function getActionButton(type: string): { label: string; icon: any; color: string } {
  switch (type) {
    case "venta":
      return { label: "Comprar", icon: ShoppingCart, color: "bg-emerald-600 hover:bg-emerald-700 text-white" }
    case "donacion":
      return { label: "Solicitar", icon: Gift, color: "bg-purple-600 hover:bg-purple-700 text-white" }
    case "intercambio":
      return { label: "Intercambiar", icon: Repeat, color: "bg-orange-500 hover:bg-orange-600 text-white" }
    default:
      return { label: "Ver más", icon: ShoppingCart, color: "bg-gray-600 hover:bg-gray-700 text-white" }
  }
}

function BuscarContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""

  const [resultados, setResultados] = useState<Articulo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchInput, setSearchInput] = useState(query)

  useEffect(() => {
    if (query) {
      buscarArticulos(query)
    }
  }, [query])

  const buscarArticulos = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/items?search=${encodeURIComponent(searchQuery)}&status=disponible`)
      const data = await response.json()
      if (data.success) {
        setResultados(data.data || [])
      }
    } catch (error) {
      console.error("Error buscando:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button variant="outline" className="bg-accent text-accent-foreground border-accent hover:bg-accent/90">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Volver
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-primary-foreground">Resultados de búsqueda</h1>
        </div>

        {/* Barra de búsqueda */}
        <Card className="bg-secondary border-secondary p-4 mb-6">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-24 bg-white text-gray-900 placeholder:text-gray-500 border-gray-300 h-12"
            />
            <Button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 h-10 bg-primary">
              Buscar
            </Button>
          </form>
        </Card>

        {/* Resultados */}
        {query && (
          <p className="text-primary-foreground/70 mb-4">
            {isLoading ? "Buscando..." : `${resultados.length} resultado(s) para "${query}"`}
          </p>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : resultados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {resultados.map((item) => {
              const typeInfo = getTypeLabel(item.tipo)
              const actionInfo = getActionButton(item.tipo)
              const ActionIcon = actionInfo.icon
              const imagen = item.imagenes && item.imagenes.length > 0 ? item.imagenes[0] : "/placeholder.svg"

              return (
                <Card key={item.id} className="bg-card border-none overflow-hidden flex flex-col">
                  <Link href={`/item/${item.id}`}>
                    <div className="aspect-square relative bg-muted">
                      <img
                        src={imagen || "/placeholder.svg"}
                        alt={item.titulo}
                        className="w-full h-full object-cover"
                      />
                      <Badge className={`absolute top-2 left-2 text-xs ${typeInfo.color}`}>{typeInfo.label}</Badge>
                    </div>
                  </Link>
                  <div className="p-3 flex-1 flex flex-col">
                    <Link href={`/item/${item.id}`}>
                      <h3 className="font-semibold text-sm text-card-foreground line-clamp-2 hover:text-primary">
                        {item.titulo}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{item.ciudad}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{item.condicion}</span>
                      <span className="font-bold text-primary text-sm">
                        {item.precio > 0
                          ? formatPrice(item.precio)
                          : item.tipo === "donacion"
                            ? "Gratis"
                            : "Intercambio"}
                      </span>
                    </div>
                    <div className="mt-auto pt-2">
                      <Link href={`/item/${item.id}`}>
                        <Button className={`w-full ${actionInfo.color} text-sm h-9`}>
                          <ActionIcon className="h-4 w-4 mr-1" />
                          {actionInfo.label}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : query ? (
          <Card className="bg-secondary border-secondary p-8 text-center">
            <Search className="h-12 w-12 text-primary-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-primary-foreground mb-2">No se encontraron resultados</h3>
            <p className="text-primary-foreground/70 mb-4">Intenta con otros términos de búsqueda</p>
            <Link href="/categorias">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Explorar categorías</Button>
            </Link>
          </Card>
        ) : (
          <Card className="bg-secondary border-secondary p-8 text-center">
            <Search className="h-12 w-12 text-primary-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-primary-foreground mb-2">Busca productos en ZIRAKO</h3>
            <p className="text-primary-foreground/70">Escribe lo que buscas en la barra de búsqueda</p>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function BuscarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-primary flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      }
    >
      <BuscarContent />
    </Suspense>
  )
}
