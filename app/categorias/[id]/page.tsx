import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CategoryIcon, type CategoryType } from "@/components/category-icon"
import { ChevronLeft, MapPin, ShoppingCart, Gift, Repeat } from "lucide-react"
import Link from "next/link"

const categoryData: Record<
  string,
  {
    name: string
    icon: CategoryType
    items: Array<{
      id: number
      name: string
      condition: "Nuevo" | "Como nuevo" | "Usado"
      location: string
      price: number
      type: "venta" | "donacion" | "intercambio"
      image: string
    }>
  }
> = {
  electronica: {
    name: "Electrónica",
    icon: "electronica",
    items: [
      {
        id: 1,
        name: "Samsung Galaxy A54",
        condition: "Como nuevo",
        location: "Cali",
        price: 850000,
        type: "venta",
        image: "/samsung-galaxy-a54-smartphone-negro.jpg",
      },
      {
        id: 9,
        name: "iPhone 12 64GB",
        condition: "Usado",
        location: "Palmira",
        price: 1200000,
        type: "venta",
        image: "/iphone-12-blanco-smartphone-apple.jpg",
      },
      {
        id: 10,
        name: "Xiaomi Redmi Note 12",
        condition: "Nuevo",
        location: "Tuluá",
        price: 680000,
        type: "venta",
        image: "/xiaomi-redmi-note-12-smartphone-azul.jpg",
      },
      {
        id: 11,
        name: "Audífonos Sony WH-1000XM4",
        condition: "Como nuevo",
        location: "Buga",
        price: 750000,
        type: "venta",
        image: "/sony-wh-1000xm4-audifonos-inalambricos-negro.jpg",
      },
      {
        id: 12,
        name: "Smartwatch Amazfit GTR",
        condition: "Usado",
        location: "Yumbo",
        price: 280000,
        type: "intercambio",
        image: "/amazfit-gtr-smartwatch-reloj-inteligente.jpg",
      },
      {
        id: 13,
        name: "Cargador Inalámbrico Samsung",
        condition: "Nuevo",
        location: "Jamundí",
        price: 0,
        type: "donacion",
        image: "/samsung-cargador-inalambrico-blanco.jpg",
      },
    ],
  },
  muebles: {
    name: "Muebles",
    icon: "muebles",
    items: [
      {
        id: 3,
        name: "Silla de Oficina Ergonómica",
        condition: "Usado",
        location: "Tuluá",
        price: 280000,
        type: "venta",
        image: "/silla-oficina-ergonomica-negra-con-ruedas.jpg",
      },
      {
        id: 4,
        name: "Estantería de Madera 5 Niveles",
        condition: "Como nuevo",
        location: "Buga",
        price: 0,
        type: "donacion",
        image: "/estanteria-madera-roble-5-niveles.jpg",
      },
      {
        id: 14,
        name: "Sofá 3 Puestos Gris",
        condition: "Usado",
        location: "Cali",
        price: 650000,
        type: "venta",
        image: "/sofa-gris-tres-puestos-sala-moderno.jpg",
      },
      {
        id: 15,
        name: "Mesa de Comedor 6 Puestos",
        condition: "Como nuevo",
        location: "Palmira",
        price: 480000,
        type: "venta",
        image: "/mesa-comedor-madera-6-puestos-moderna.jpg",
      },
      {
        id: 16,
        name: "Cama Doble con Colchón",
        condition: "Usado",
        location: "Cartago",
        price: 0,
        type: "intercambio",
        image: "/cama-doble-colchon-blanco-dormitorio.jpg",
      },
      {
        id: 17,
        name: "Mesa de Centro Moderna",
        condition: "Nuevo",
        location: "Buenaventura",
        price: 185000,
        type: "venta",
        image: "/mesa-centro-moderna-sala-vidrio-madera.jpg",
      },
    ],
  },
  libros: {
    name: "Libros",
    icon: "libros",
    items: [
      {
        id: 6,
        name: "Colección García Márquez",
        condition: "Como nuevo",
        location: "Yumbo",
        price: 0,
        type: "intercambio",
        image: "/coleccion-libros-gabriel-garcia-marquez-cien-a-os-.jpg",
      },
      {
        id: 18,
        name: "Harry Potter Saga Completa",
        condition: "Usado",
        location: "Cali",
        price: 180000,
        type: "venta",
        image: "/coleccion-harry-potter-libros-saga-completa.jpg",
      },
      {
        id: 19,
        name: "El Señor de los Anillos Trilogía",
        condition: "Como nuevo",
        location: "Palmira",
        price: 95000,
        type: "venta",
        image: "/trilogia-se-or-de-los-anillos-tolkien-libros.jpg",
      },
      {
        id: 20,
        name: "Enciclopedia Universal 12 Tomos",
        condition: "Usado",
        location: "Tuluá",
        price: 0,
        type: "donacion",
        image: "/Enciclopedia-Universal-12-Tomos.jpg",
      },
      {
        id: 21,
        name: "Libros de Programación Python",
        condition: "Como nuevo",
        location: "Buga",
        price: 120000,
        type: "venta",
        image: "/Introd_Programac_PYTHON-scaled.webp",
      },
      {
        id: 22,
        name: "Novelas de Suspenso (Pack 5)",
        condition: "Usado",
        location: "Jamundí",
        price: 0,
        type: "intercambio",
        image: "/Novelas-de-Suspenso.jpg",
      },
    ],
  },
  tecnologia: {
    name: "Tecnología",
    icon: "tecnologia",
    items: [
      {
        id: 2,
        name: "Laptop HP Pavilion 15",
        condition: "Usado",
        location: "Palmira",
        price: 1200000,
        type: "venta",
        image: "/hp-pavilion-laptop.jpg",
      },
      {
        id: 7,
        name: "Monitor LG 27 pulgadas 4K",
        condition: "Como nuevo",
        location: "Cartago",
        price: 950000,
        type: "venta",
        image: "/lg-27-inch-4k-monitor.jpg",
      },
      {
        id: 23,
        name: "MacBook Air cM1",
        condition: "Como nuevo",
        location: "Cali",
        price: 2800000,
        type: "venta",
        image: "/MacBook-Air-cM1.jpg",
      },
      {
        id: 24,
        name: "Teclado Mecánico RGB",
        condition: "Nuevo",
        location: "Yumbo",
        price: 180000,
        type: "venta",
        image: "/mechanical-keyboard-rgb.jpg",
      },
      {
        id: 25,
        name: "Mouse Logitech G502",
        condition: "Usado",
        location: "Tuluá",
        price: 120000,
        type: "venta",
        image: "/Mouse-Logitech-G502.jpg",
      },
      {
        id: 26,
        name: "Webcam Full HD",
        condition: "Como nuevo",
        location: "Buga",
        price: 0,
        type: "donacion",
        image: "/webcam-full-hd.jpg",
      },
    ],
  },
  herramientas: {
    name: "Herramientas",
    icon: "herramientas",
    items: [
      {
        id: 5,
        name: "Taladro Inalámbrico DeWalt",
        condition: "Nuevo",
        location: "Jamundí",
        price: 420000,
        type: "venta",
        image: "/dewalt-cordless-drill-yellow.jpg",
      },
      {
        id: 27,
        name: "Sierra Circular Bosch",
        condition: "Usado",
        location: "Cali",
        price: 350000,
        type: "venta",
        image: "/bosch-circular-saw.jpg",
      },
      {
        id: 28,
        name: "Set de Destornilladores Stanley",
        condition: "Nuevo",
        location: "Palmira",
        price: 85000,
        type: "venta",
        image: "/stanley-screwdriver-set.jpg",
      },
      {
        id: 29,
        name: "Compresor de Aire 50L",
        condition: "Usado",
        location: "Cartago",
        price: 580000,
        type: "venta",
        image: "/air-compressor.jpg",
      },
      {
        id: 30,
        name: "Escalera Aluminio 6 Pasos",
        condition: "Como nuevo",
        location: "Tuluá",
        price: 0,
        type: "intercambio",
        image: "/Escalera-Aluminio-6-Pasos.jpg",
      },
      {
        id: 31,
        name: "Caja de Herramientas Completa",
        condition: "Usado",
        location: "Buga",
        price: 150000,
        type: "donacion",
        image: "/Caja-de-Herramientas-Completa.webp",
      },
    ],
  },
  oficina: {
    name: "Oficina",
    icon: "oficina",
    items: [
      {
        id: 8,
        name: "Escritorio en L para Oficina",
        condition: "Usado",
        location: "Buenaventura",
        price: 350000,
        type: "venta",
        image: "/l-shaped-office-desk-white-modern.jpg",
      },
      {
        id: 32,
        name: "Archivador Metálico 4 Gavetas",
        condition: "Usado",
        location: "Cali",
        price: 220000,
        type: "venta",
        image: "/Archivador-Metálico-4-Gavetas.webp",
      },
      {
        id: 33,
        name: "Impresora HP LaserJet",
        condition: "Como nuevo",
        location: "Palmira",
        price: 450000,
        type: "venta",
        image: "/Impresora-HP-LaserJet.png",
      },
      {
        id: 34,
        name: "Silla Ejecutiva de Cuero",
        condition: "Usado",
        location: "Yumbo",
        price: 380000,
        type: "venta",
        image: "/silla-oficina-ergonomica-negra-con-ruedas.jpg",
      },
      {
        id: 35,
        name: "Tablero Acrílico 120x80cm",
        condition: "Nuevo",
        location: "Tuluá",
        price: 0,
        type: "donacion",
        image: "/Tablero-Acrílico-120x80cm.jpg",
      },
      {
        id: 36,
        name: "Organizador de Escritorio",
        condition: "Como nuevo",
        location: "Jamundí",
        price: 45000,
        type: "venta",
        image: "/Organizador-de-Escritorio.jpg",
      },
    ],
  },
  ropa: {
    name: "Ropa y Accesorios",
    icon: "ropa",
    items: [
      {
        id: 37,
        name: "Chaqueta de Cuero Negra",
        condition: "Como nuevo",
        location: "Cali",
        price: 180000,
        type: "venta",
        image: "/Chaqueta-de-Cuero-Negra.jpg",
      },
      {
        id: 38,
        name: "Vestido de Fiesta Azul",
        condition: "Nuevo",
        location: "Palmira",
        price: 0,
        type: "donacion",
        image: "/Vestido-de-Fiesta-Azul.jpg",
      },
      {
        id: 39,
        name: "Zapatillas Nike Air Max",
        condition: "Usado",
        location: "Tuluá",
        price: 220000,
        type: "venta",
        image: "/Zapatillas-Nike-Air-Max.webp",
      },
      {
        id: 40,
        name: "Bolso de Mano Coach",
        condition: "Como nuevo",
        location: "Buga",
        price: 350000,
        type: "venta",
        image: "/Bolso-de-Mano-Coach.webp",
      },
      {
        id: 41,
        name: "Jeans Levi's 501",
        condition: "Usado",
        location: "Yumbo",
        price: 0,
        type: "intercambio",
        image: "/Jeans-Levis-501.webp",
      },
      {
        id: 42,
        name: "Reloj Casio Vintage",
        condition: "Como nuevo",
        location: "Jamundí",
        price: 85000,
        type: "venta",
        image: "/Reloj-Casio-Vintage.webp",
      },
    ],
  },
  electrodomesticos: {
    name: "Electrodomésticos",
    icon: "electrodomesticos",
    items: [
      {
        id: 43,
        name: "Nevera Samsung No Frost",
        condition: "Usado",
        location: "Cali",
        price: 1200000,
        type: "venta",
        image: "/Nevera-Samsung-No-Frost.webp",
      },
      {
        id: 44,
        name: "Lavadora LG 12kg",
        condition: "Como nuevo",
        location: "Palmira",
        price: 950000,
        type: "venta",
        image: "/Lavadora-LG-12kg.webp",
      },
      {
        id: 45,
        name: "Microondas Panasonic",
        condition: "Usado",
        location: "Tuluá",
        price: 0,
        type: "donacion",
        image: "/Microondas-Panasonic.webp",
      },
      {
        id: 46,
        name: "Licuadora Oster",
        condition: "Nuevo",
        location: "Buga",
        price: 180000,
        type: "venta",
        image: "/Licuadora-Oster.webp",
      },
      {
        id: 47,
        name: "Aire Acondicionado 12000 BTU",
        condition: "Usado",
        location: "Cartago",
        price: 850000,
        type: "venta",
        image: "/Aire-Acondicionado-12000-BTU.webp",
      },
      {
        id: 48,
        name: "Ventilador de Pie Samurai",
        condition: "Como nuevo",
        location: "Buenaventura",
        price: 0,
        type: "intercambio",
        image: "/Ventilador-de-Pie-Samurai.webp",
      },
    ],
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

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const category = categoryData[id] || categoryData.electronica

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/categorias">
            <Button
              variant="outline"
              className="bg-accent text-accent-foreground border-accent hover:bg-accent/90 h-10 px-4 flex items-center gap-2"
            >
              <ChevronLeft className="h-5 w-5" />
              Regresar
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-accent rounded-lg p-2">
              <CategoryIcon category={category.icon} className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-primary-foreground">{category.name}</h1>
          </div>
        </div>

        {/* Contador de productos */}
        <p className="text-primary-foreground/80 mb-6">{category.items.length} productos disponibles</p>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {category.items.map((item) => {
            const typeInfo = getTypeLabel(item.type)
            const actionInfo = getActionButton(item.type)
            const ActionIcon = actionInfo.icon

            return (
              <Card
                key={item.id}
                className="bg-card border-none hover:shadow-lg transition-all overflow-hidden h-full flex flex-col"
              >
                {/* Imagen del producto */}
                <Link href={`/item/${item.id}`}>
                  <div className="aspect-square relative bg-muted">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className={`absolute top-2 left-2 text-xs ${typeInfo.color}`}>{typeInfo.label}</Badge>
                  </div>
                </Link>

                {/* Info del producto */}
                <div className="p-3 space-y-2 flex-1 flex flex-col">
                  <Link href={`/item/${item.id}`}>
                    <h3 className="font-semibold text-sm text-card-foreground line-clamp-2 hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{item.location}, Valle del Cauca</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{item.condition}</span>
                    <span className="font-bold text-primary text-sm">
                      {item.price > 0 ? formatPrice(item.price) : item.type === "donacion" ? "Gratis" : "Intercambio"}
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
      </div>
    </div>
  )
}
