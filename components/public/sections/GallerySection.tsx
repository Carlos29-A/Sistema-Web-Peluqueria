"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Star } from "lucide-react"
import type { PublicGalleryItem } from "@/types"
import Container from "../ui/Container"
import SectionHeader from "../ui/SectionHeader"

interface GallerySectionProps {
  items: PublicGalleryItem[]
}

export default function GallerySection({ items }: GallerySectionProps) {
  const [selected, setSelected] = useState<PublicGalleryItem | null>(null)

  if (items.length === 0) return null

  return (
    <section id="galeria" className="py-20 lg:py-28 bg-gradient-to-b from-white to-amber-50/30">
      <Container>
        <SectionHeader
          eyebrow="Galería"
          title="Nuestros trabajos"
          subtitle="Una muestra del talento y la dedicación que ponemos en cada servicio."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.slice(0, 8).map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className={`group relative overflow-hidden rounded-xl cursor-pointer ${
                idx === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
              }`}
            >
              <Image
                src={item.imageUrl}
                alt={item.description ?? "Trabajo de GlamStudio"}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {item.isFeatured && (
                <div className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-amber-900 text-xs font-semibold">
                  <Star className="w-3 h-3 fill-current" />
                </div>
              )}
              {item.category && (
                <div className="absolute bottom-3 left-3 right-3 text-left opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium">{item.category}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </Container>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
              <Image
                src={selected.imageUrl}
                alt={selected.description ?? "Trabajo de GlamStudio"}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-contain"
              />
            </div>
            {(selected.description || selected.category || selected.staff) && (
              <div className="bg-white rounded-2xl mt-3 p-4">
                {selected.description && (
                  <p className="text-sm text-gray-700 mb-2">{selected.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {selected.category && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      {selected.category}
                    </span>
                  )}
                  {selected.staff && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      por {selected.staff.name}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
