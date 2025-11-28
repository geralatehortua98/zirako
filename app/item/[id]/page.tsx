"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { CategoryIcon, type CategoryType } from "@/components/category-icon"
import {
  ChevronLeft,
  MapPin,
  Clock,
  User,
  Heart,
  Share2,
  MessageCircle,
  Package,
  Tag,
  CheckCircle,
  Loader2,
  ShoppingCart,
  Repeat,
  Gift,
} from "lucide-react"
import Link from "next/link"
import { useState, use, useEffect } from "react"
import { useRouter } from "next/navigation"

// Datos de productos de ejemplo - Valle del Cauca, precios en COP
const itemsData: Record<
  string,
  {
    id: number
    name: string
    description: string
    condition: "Nuevo" | "Como nuevo" | "Usado"
    location: string
    price: number
    type: "venta" | "donacion" | "intercambio"
    category: CategoryType
    seller: string
    sellerEmail: string
    sellerRating: number
    publishedAt: string
    views: number
    images: string[]
  }
> = {
  "1": {
    id: 1,
    name: "Samsung Galaxy A54",
    description:
      "Teléfono Samsung Galaxy A54 en excelente estado. Incluye cargador original, audífonos y estuche protector. Batería con excelente duración, pantalla sin rayones. Ideal para quien busca un smartphone de gama media con excelentes características. Memoria de 128GB expandible, 6GB RAM.",
    condition: "Como nuevo",
    location: "Cali, Valle del Cauca",
    price: 850000,
    type: "venta",
    category: "telefonos",
    seller: "Carlos Martínez",
    sellerEmail: "carlos@email.com",
    sellerRating: 4.8,
    publishedAt: "Hace 2 días",
    views: 124,
    images: ["/samsung-galaxy-a54-smartphone.jpg"],
  },
  "2": {
    id: 2,
    name: "Laptop HP Pavilion 15",
    description:
      "Computador portátil HP Pavilion con procesador Intel Core i5, 8GB RAM y 512GB SSD. Perfecto para trabajo de oficina, estudios universitarios o uso general. Pantalla de 15.6 pulgadas Full HD. Incluye maletín de transporte y mouse inalámbrico.",
    condition: "Usado",
    location: "Palmira, Valle del Cauca",
    price: 1200000,
    type: "venta",
    category: "computadores",
    seller: "María López",
    sellerEmail: "maria@email.com",
    sellerRating: 4.5,
    publishedAt: "Hace 5 días",
    views: 89,
    images: ["/hp-pavilion-laptop-computer.jpg"],
  },
  "3": {
    id: 3,
    name: "Silla de Oficina Ergonómica",
    description:
      "Silla de oficina ergonómica con soporte lumbar ajustable, reposabrazos regulables y ruedas de goma. Material transpirable que mantiene la comodidad durante largas jornadas de trabajo. Color negro, altura ajustable. Ideal para home office.",
    condition: "Usado",
    location: "Tuluá, Valle del Cauca",
    price: 280000,
    type: "venta",
    category: "muebles",
    seller: "Andrés García",
    sellerEmail: "andres@email.com",
    sellerRating: 4.9,
    publishedAt: "Hace 1 semana",
    views: 67,
    images: ["/ergonomic-office-chair-black.jpg"],
  },
  "4": {
    id: 4,
    name: "Estantería de Madera 5 Niveles",
    description:
      "Estantería de madera maciza con 5 niveles, perfecta para libros, decoración o almacenamiento. Acabado en color roble natural. Dimensiones: 180cm alto x 80cm ancho x 30cm profundo. Muy resistente y estable. Fácil de armar.",
    condition: "Como nuevo",
    location: "Buga, Valle del Cauca",
    price: 0,
    type: "donacion",
    category: "muebles",
    seller: "Patricia Rodríguez",
    sellerEmail: "patricia@email.com",
    sellerRating: 5.0,
    publishedAt: "Hace 3 días",
    views: 156,
    images: ["/wooden-bookshelf-5-levels-oak.jpg"],
  },
  "5": {
    id: 5,
    name: "Taladro Inalámbrico DeWalt",
    description:
      "Taladro percutor inalámbrico DeWalt 20V con batería de litio de larga duración. Incluye cargador rápido, maletín de transporte y juego de 10 brocas. Potente y versátil para trabajos de bricolaje en casa o profesionales.",
    condition: "Nuevo",
    location: "Jamundí, Valle del Cauca",
    price: 420000,
    type: "venta",
    category: "herramientas",
    seller: "Roberto Sánchez",
    sellerEmail: "roberto@email.com",
    sellerRating: 4.7,
    publishedAt: "Hace 4 días",
    views: 93,
    images: ["/dewalt-cordless-drill-yellow.jpg"],
  },
  "6": {
    id: 6,
    name: "Colección Libros Gabriel García Márquez",
    description:
      "Colección completa de 8 libros de Gabriel García Márquez, incluyendo Cien Años de Soledad, El Amor en los Tiempos del Cólera, Crónica de una Muerte Anunciada y más. Ediciones en pasta dura, excelente estado. Ideal para coleccionistas.",
    condition: "Como nuevo",
    location: "Yumbo, Valle del Cauca",
    price: 0,
    type: "intercambio",
    category: "libros",
    seller: "Laura Mejía",
    sellerEmail: "laura@email.com",
    sellerRating: 4.6,
    publishedAt: "Hace 6 días",
    views: 201,
    images: ["/gabriel-garcia-marquez-book-collection.jpg"],
  },
  "7": {
    id: 7,
    name: "Monitor LG 27 pulgadas 4K",
    description:
      "Monitor LG UltraFine 27 pulgadas resolución 4K UHD. Ideal para diseño gráfico, edición de video o gaming. Panel IPS con colores precisos. Incluye cable HDMI y cable USB-C. Base ajustable en altura.",
    condition: "Como nuevo",
    location: "Cartago, Valle del Cauca",
    price: 950000,
    type: "venta",
    category: "tecnologia",
    seller: "Diego Vargas",
    sellerEmail: "diego@email.com",
    sellerRating: 4.8,
    publishedAt: "Hace 2 días",
    views: 178,
    images: ["/lg-27-inch-4k-monitor.jpg"],
  },
  "8": {
    id: 8,
    name: "Escritorio en L para Oficina",
    description:
      "Escritorio en forma de L, perfecto para espacios de trabajo amplios. Superficie resistente a rayones, estructura metálica robusta. Incluye organizador de cables integrado. Color blanco con patas negras. Dimensiones: 150x120cm.",
    condition: "Usado",
    location: "Buenaventura, Valle del Cauca",
    price: 350000,
    type: "venta",
    category: "oficina",
    seller: "Camila Torres",
    sellerEmail: "camila@email.com",
    sellerRating: 4.4,
    publishedAt: "Hace 1 semana",
    views: 82,
    images: ["/l-shaped-office-desk-white-modern.jpg"],
  },
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

function getConditionColor(condition: string): string {
  switch (condition) {
    case "Nuevo":
      return "bg-green-500 text-white"
    case "Como nuevo":
      return "bg-blue-500 text-white"
    case "Usado":
      return "bg-amber-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
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

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const id = resolvedParams.id
  const item = itemsData[id] || itemsData["1"]
  const typeInfo = getTypeLabel(item.type)

  const [showContactModal, setShowContactModal] = useState(false)
  const [showProposalModal, setShowProposalModal] = useState(false)
  const [proposalType, setProposalType] = useState<"compra" | "intercambio" | "donacion">("compra")
  const [mensaje, setMensaje] = useState("")
  const [propuesta, setPropuesta] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [usuarioLogueado, setUsuarioLogueado] = useState<{ nombre: string; email: string } | null>(null)

  useEffect(() => {
    const logged = localStorage.getItem("zirako_logged_in") === "true"
    setIsLoggedIn(logged)

    if (logged) {
      const nombre = localStorage.getItem("zirako_user_name") || ""
      const email = localStorage.getItem("zirako_user_email") || ""
      setUsuarioLogueado({ nombre, email })
    }
  }, [])

  const handleContactar = async () => {
    if (!mensaje.trim()) {
      setError("Escribe un mensaje")
      return
    }

    if (!isLoggedIn) {
      setError("Debes iniciar sesión para contactar al vendedor")
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/contactar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          itemId: item.id,
          itemName: item.name,
          sellerEmail: item.sellerEmail,
          sellerName: item.seller,
          mensaje: mensaje.trim(),
          contactadorNombre: usuarioLogueado?.nombre,
          contactadorEmail: usuarioLogueado?.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar mensaje")
      }

      setShowContactModal(false)
      setSuccessMessage("Tu mensaje ha sido enviado al vendedor. Recibirás una respuesta por correo.")
      setShowSuccess(true)
      setMensaje("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePropuesta = async () => {
    if (!propuesta.trim()) {
      setError("Escribe tu propuesta")
      return
    }

    if (!isLoggedIn) {
      setError("Debes iniciar sesión para hacer una propuesta")
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Determinar el tipo de mensaje según la propuesta
      let tipoMensaje = ""
      if (proposalType === "compra") {
        tipoMensaje = `PROPUESTA DE COMPRA para "${item.name}"\n\nPrecio publicado: ${formatPrice(item.price)}\n\nMi propuesta: ${propuesta}`
      } else if (proposalType === "intercambio") {
        tipoMensaje = `PROPUESTA DE INTERCAMBIO para "${item.name}"\n\nOfrezco a cambio: ${propuesta}`
      } else {
        tipoMensaje = `SOLICITUD DE DONACIÓN para "${item.name}"\n\nMotivo de la solicitud: ${propuesta}`
      }

      const response = await fetch("/api/contactar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          itemId: item.id,
          itemName: item.name,
          sellerEmail: item.sellerEmail,
          sellerName: item.seller,
          mensaje: tipoMensaje,
          contactadorNombre: usuarioLogueado?.nombre,
          contactadorEmail: usuarioLogueado?.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar propuesta")
      }

      setShowProposalModal(false)

      if (proposalType === "compra") {
        setSuccessMessage("Tu propuesta de compra ha sido enviada. El vendedor te contactará por correo.")
      } else if (proposalType === "intercambio") {
        setSuccessMessage("Tu propuesta de intercambio ha sido enviada. El publicador te contactará por correo.")
      } else {
        setSuccessMessage("Tu solicitud de donación ha sido enviada. El donante te contactará por correo.")
      }

      setShowSuccess(true)
      setPropuesta("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const openProposalModal = (type: "compra" | "intercambio" | "donacion") => {
    setProposalType(type)
    setPropuesta("")
    setError("")
    setShowProposalModal(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-primary-foreground hover:bg-white/20 flex items-center gap-2">
                <ChevronLeft className="h-5 w-5" />
                Volver
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Card className="overflow-hidden bg-card">
              <div className="aspect-square relative bg-muted flex items-center justify-center">
                <img
                  src={item.images[0] || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <Badge className={`absolute top-4 left-4 ${typeInfo.color}`}>{typeInfo.label}</Badge>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-2xl lg:text-3xl font-bold text-card-foreground">{item.name}</h1>
                <Badge className={getConditionColor(item.condition)}>{item.condition}</Badge>
              </div>

              {item.type === "venta" && item.price > 0 ? (
                <p className="text-3xl font-bold text-primary">{formatPrice(item.price)}</p>
              ) : item.type === "donacion" ? (
                <p className="text-2xl font-semibold text-purple-600">Donación</p>
              ) : (
                <p className="text-2xl font-semibold text-orange-500">Disponible para intercambio</p>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{item.publishedAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>{item.views} visitas</span>
              </div>
            </div>

            <Card className="bg-card p-5">
              <h2 className="text-lg font-semibold mb-3 text-card-foreground">Descripción</h2>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </Card>

            <div className="flex items-center gap-3">
              <div className="bg-accent rounded-lg p-2">
                <CategoryIcon category={item.category} className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground capitalize">{item.category}</span>
              </div>
            </div>

            <Card className="bg-card p-5">
              <h2 className="text-lg font-semibold mb-3 text-card-foreground">Publicado por</h2>
              <div className="flex items-center gap-4">
                <div className="bg-primary rounded-full p-3">
                  <User className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-card-foreground">{item.seller}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500">★</span>
                    <span className="text-sm text-muted-foreground">{item.sellerRating} / 5.0</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setShowContactModal(true)}
                className="w-full h-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Contactar
              </Button>

              {item.type === "venta" && (
                <Button
                  onClick={() => openProposalModal("compra")}
                  className="w-full h-12 text-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Hacer Propuesta de Compra
                </Button>
              )}

              {item.type === "intercambio" && (
                <Button
                  onClick={() => openProposalModal("intercambio")}
                  className="w-full h-12 text-lg bg-orange-500 text-white hover:bg-orange-600"
                >
                  <Repeat className="h-5 w-5 mr-2" />
                  Proponer Intercambio
                </Button>
              )}

              {item.type === "donacion" && (
                <Button
                  onClick={() => openProposalModal("donacion")}
                  className="w-full h-12 text-lg bg-purple-600 text-white hover:bg-purple-700"
                >
                  <Gift className="h-5 w-5 mr-2" />
                  Solicitar Donación
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6 text-card-foreground">Productos similares</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.values(itemsData)
              .filter((i) => i.id !== item.id && i.category === item.category)
              .slice(0, 4)
              .map((similarItem) => (
                <Link key={similarItem.id} href={`/item/${similarItem.id}`}>
                  <Card className="bg-card hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="aspect-square bg-muted">
                      <img
                        src={similarItem.images[0] || "/placeholder.svg"}
                        alt={similarItem.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-sm truncate text-card-foreground">{similarItem.name}</p>
                      <p className="text-primary font-bold text-sm">
                        {similarItem.price > 0
                          ? formatPrice(similarItem.price)
                          : similarItem.type === "donacion"
                            ? "Donación"
                            : "Intercambio"}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </div>

      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Contactar a {item.seller}</DialogTitle>
            <DialogDescription className="text-gray-600">
              Envía un mensaje sobre "{item.name}". El publicador recibirá tu mensaje por correo.
            </DialogDescription>
          </DialogHeader>

          {usuarioLogueado && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <strong>Enviando como:</strong> {usuarioLogueado.nombre} ({usuarioLogueado.email})
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>
          )}

          <Textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Hola, estoy interesado en este artículo. ¿Sigue disponible?"
            className="min-h-32 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowContactModal(false)}
              className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleContactar}
              disabled={isLoading}
              className="flex-1 bg-primary text-white hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar mensaje"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProposalModal} onOpenChange={setShowProposalModal}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900 flex items-center gap-2">
              {proposalType === "compra" && <ShoppingCart className="h-5 w-5 text-emerald-600" />}
              {proposalType === "intercambio" && <Repeat className="h-5 w-5 text-orange-500" />}
              {proposalType === "donacion" && <Gift className="h-5 w-5 text-purple-600" />}
              {proposalType === "compra" && "Propuesta de Compra"}
              {proposalType === "intercambio" && "Propuesta de Intercambio"}
              {proposalType === "donacion" && "Solicitar Donación"}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {proposalType === "compra" && `Precio publicado: ${formatPrice(item.price)}. Escribe tu oferta.`}
              {proposalType === "intercambio" && "Describe qué artículo ofreces a cambio."}
              {proposalType === "donacion" && "Explica por qué te interesa este artículo."}
            </DialogDescription>
          </DialogHeader>

          {usuarioLogueado && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <strong>Enviando como:</strong> {usuarioLogueado.nombre} ({usuarioLogueado.email})
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>
          )}

          <Textarea
            value={propuesta}
            onChange={(e) => setPropuesta(e.target.value)}
            placeholder={
              proposalType === "compra"
                ? "Ej: Ofrezco $750.000 COP, puedo recogerlo hoy..."
                : proposalType === "intercambio"
                  ? "Ej: Ofrezco un iPhone 12 en excelente estado a cambio..."
                  : "Ej: Me interesa este artículo porque lo necesito para..."
            }
            className="min-h-32 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowProposalModal(false)}
              className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePropuesta}
              disabled={isLoading}
              className={`flex-1 text-white ${
                proposalType === "compra"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : proposalType === "intercambio"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Propuesta"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-gray-900">¡Enviado Exitosamente!</DialogTitle>
            <DialogDescription className="text-center text-gray-600">{successMessage}</DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowSuccess(false)} className="w-full bg-primary text-white hover:bg-primary/90">
            Entendido
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
