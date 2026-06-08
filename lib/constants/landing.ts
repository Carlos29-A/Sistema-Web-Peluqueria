import { Scissors, Palette, Sparkles, Hand, Heart, Star } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export const SERVICE_CATEGORIES: Record<string, LucideIcon> = {
  Corte: Scissors,
  Color: Palette,
  Tratamiento: Sparkles,
  Peinado: Hand,
  Novias: Heart,
  Barbería: Scissors,
  default: Star,
}

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80"

export const ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&q=80"

export interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  rating: number
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Carolina Méndez",
    role: "Cliente frecuente",
    content:
      "El mejor salón al que he ido. María es increíble con el color, siempre salgo feliz con mi nuevo look.",
    rating: 5,
  },
  {
    id: 2,
    name: "Valentina Rojas",
    role: "Novia GlamStudio",
    content:
      "Para mi matrimonio confié en GlamStudio y fue la mejor decisión. Mi peinado y maquillaje fueron perfectos.",
    rating: 5,
  },
  {
    id: 3,
    name: "Camila Torres",
    role: "Cliente",
    content:
      "Ambiente súper agradable, profesionales muy capacitadas. La keratina me cambió la vida, mi cabello quedó increíble.",
    rating: 5,
  },
  {
    id: 4,
    name: "Daniela Vargas",
    role: "Cliente",
    content:
      "Llevo años yendo a GlamStudio. Siempre me atienden de maravilla y los resultados son consistentes.",
    rating: 5,
  },
]
