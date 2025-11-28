import { Smartphone, Monitor, Cable, Armchair, BookOpen, Laptop, Drill, Briefcase, type LucideIcon } from "lucide-react"

export type CategoryType =
  | "electronica"
  | "telefonos"
  | "computadores"
  | "cables"
  | "muebles"
  | "libros"
  | "tecnologia"
  | "herramientas"
  | "oficina"

const categoryIcons: Record<CategoryType, LucideIcon> = {
  electronica: Monitor,
  telefonos: Smartphone,
  computadores: Laptop,
  cables: Cable,
  muebles: Armchair,
  libros: BookOpen,
  tecnologia: Laptop,
  herramientas: Drill,
  oficina: Briefcase,
}

interface CategoryIconProps {
  category: CategoryType
  className?: string
}

export function CategoryIcon({ category, className = "" }: CategoryIconProps) {
  const Icon = categoryIcons[category]
  return <Icon className={className} />
}
