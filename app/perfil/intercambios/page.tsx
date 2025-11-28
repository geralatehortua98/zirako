import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

const intercambios = [
  {
    id: 1,
    itemDado: "Laptop HP",
    itemRecibido: "Monitor LG",
    usuario: "María García",
    fecha: "20 Ene 2025",
    estado: "completado",
  },
  {
    id: 2,
    itemDado: "Teclado mecánico",
    itemRecibido: "Mouse inalámbrico",
    usuario: "Juan Pérez",
    fecha: "15 Ene 2025",
    estado: "completado",
  },
  {
    id: 3,
    itemDado: "Silla ergonómica",
    itemRecibido: "Escritorio ajustable",
    usuario: "Ana Martínez",
    fecha: "10 Ene 2025",
    estado: "en_proceso",
  },
]

export default function IntercambiosPage() {
  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
          <h1 className="text-2xl font-bold text-white">Mis Intercambios</h1>
        </div>

        {/* Lista de intercambios */}
        <div className="space-y-4">
          {intercambios.map((intercambio) => (
            <Card key={intercambio.id} className="bg-secondary border-secondary p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary rounded-full p-3">
                  <RefreshCw className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-primary-foreground/70">Intercambio con</p>
                  <h3 className="font-bold text-lg text-primary-foreground">{intercambio.usuario}</h3>
                  <p className="text-xs text-primary-foreground/50">{intercambio.fecha}</p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    intercambio.estado === "completado"
                      ? "bg-accent/20 text-accent"
                      : "bg-yellow-500/20 text-yellow-500"
                  }`}
                >
                  {intercambio.estado === "completado" ? "Completado" : "En proceso"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-primary/50 rounded-lg p-3">
                  <p className="text-xs text-primary-foreground/70 mb-1">Diste</p>
                  <p className="font-semibold text-primary-foreground">{intercambio.itemDado}</p>
                </div>
                <div className="bg-primary/50 rounded-lg p-3">
                  <p className="text-xs text-primary-foreground/70 mb-1">Recibiste</p>
                  <p className="font-semibold text-primary-foreground">{intercambio.itemRecibido}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
