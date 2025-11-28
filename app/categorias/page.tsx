import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CategoryIcon } from "@/components/category-icon"
import { ChevronRight, X } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    id: "electronica",
    name: "Electrónica",
    icon: "electronica" as const,
    subcategories: ["Teléfonos", "Computadores", "Cables", "Accesorios"],
  },
  {
    id: "muebles",
    name: "Muebles",
    icon: "muebles" as const,
    subcategories: ["Sillas", "Mesas", "Estanterías", "Sofás"],
  },
  {
    id: "libros",
    name: "Libros",
    icon: "libros" as const,
    subcategories: ["Ficción", "No ficción", "Académicos", "Infantiles"],
  },
  {
    id: "tecnologia",
    name: "Tecnología",
    icon: "tecnologia" as const,
    subcategories: ["Laptops", "Tablets", "Monitores", "Periféricos"],
  },
  {
    id: "herramientas",
    name: "Herramientas",
    icon: "herramientas" as const,
    subcategories: ["Eléctricas", "Manuales", "Jardín", "Construcción"],
  },
  {
    id: "oficina",
    name: "Oficina",
    icon: "oficina" as const,
    subcategories: ["Escritorios", "Sillas", "Archivadores", "Papelería"],
  },
]

export default function CategoriasPage() {
  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-primary-foreground">
              <X className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-primary-foreground">CATEGORÍAS</h1>
          <div className="w-10" />
        </div>

        {/* Lista de categorías */}
        <div className="space-y-3">
          {categories.map((category) => (
            <Card key={category.id} className="bg-secondary border-secondary hover:bg-secondary/90 transition-colors">
              <Link href={`/categorias/${category.id}`}>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-accent rounded-lg p-2">
                      <CategoryIcon category={category.icon} className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-lg font-semibold text-primary-foreground">{category.name}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-primary-foreground/60" />
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {/* Categorías visuales */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Card className="bg-secondary border-secondary p-6 flex flex-col items-center gap-3">
            <div className="bg-accent rounded-full p-4">
              <CategoryIcon category="electronica" className="h-8 w-8 text-primary" />
            </div>
            <span className="text-primary-foreground font-semibold">Electrónica</span>
          </Card>

          <Card className="bg-secondary border-secondary p-6 flex flex-col items-center gap-3">
            <div className="bg-accent rounded-full p-4">
              <CategoryIcon category="muebles" className="h-8 w-8 text-primary" />
            </div>
            <span className="text-primary-foreground font-semibold">Muebles</span>
          </Card>

          <Card className="bg-secondary border-secondary p-6 flex flex-col items-center gap-3">
            <div className="bg-accent rounded-full p-4">
              <CategoryIcon category="libros" className="h-8 w-8 text-primary" />
            </div>
            <span className="text-primary-foreground font-semibold">Libros</span>
          </Card>

          <Card className="bg-secondary border-secondary p-6 flex flex-col items-center gap-3">
            <div className="bg-accent rounded-full p-4">
              <CategoryIcon category="oficina" className="h-8 w-8 text-primary" />
            </div>
            <span className="text-primary-foreground font-semibold">Oficina</span>
          </Card>
        </div>
      </div>
    </div>
  )
}
