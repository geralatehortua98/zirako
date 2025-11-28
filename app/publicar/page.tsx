import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Monitor, Drill, Laptop, Briefcase } from "lucide-react"
import Link from "next/link"

const publicationCategories = [
  {
    id: "espacios-trabajo",
    title: "Espacios de Trabajo y Oficina",
    description: "Escritorios, sillas, lámparas, papelería",
    icon: Monitor,
  },
  {
    id: "herramientas",
    title: "Herramientas y Equipamiento Técnico",
    description: "Herramientas, dispositivos, material",
    icon: Drill,
  },
  {
    id: "tecnologia",
    title: "Tecnología y Dispositivos Productivos",
    description: "Portátiles, monitores, teléfonos, accesorios",
    icon: Laptop,
  },
  {
    id: "mobiliario",
    title: "Mobiliario y Soporte Operativa",
    description: "Sillas, estantes, artículos de oficina",
    icon: Briefcase,
  },
]

export default function PublicarPage() {
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

        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4L42 14V34L24 44L6 34V14L24 4Z" fill="#E8F5E3" stroke="#E8F5E3" strokeWidth="1.5" />
            </svg>
            <span className="text-3xl font-bold text-white tracking-wide">ZIRAKO</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">¿Qué deseas publicar?</h1>
        </div>

        {/* Categorías de publicación */}
        <Card className="bg-white border-none rounded-3xl p-6">
          <div className="space-y-4">
            {publicationCategories.map((category, index) => (
              <Link key={category.id} href={`/publicar/${category.id}`}>
                <div
                  className={`flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors ${
                    index !== publicationCategories.length - 1 ? "border-b border-gray-200" : ""
                  }`}
                >
                  <div className="bg-primary rounded-full p-4 flex-shrink-0">
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{category.title}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
