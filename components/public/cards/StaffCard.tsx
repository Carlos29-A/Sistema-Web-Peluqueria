"use client"

import { useState } from "react"
import Image from "next/image"
import { AtSign } from "lucide-react"
import { PLACEHOLDERS } from "@/lib/constants/landing"

interface StaffCardProps {
  name: string
  role: string
  bio: string | null
  photoUrl: string | null
  instagram: string | null
}

export default function StaffCard({ name, role, bio, photoUrl, instagram }: StaffCardProps) {
  const [imgError, setImgError] = useState(false)
  const showPlaceholder = !photoUrl || imgError
  const imgSrc = showPlaceholder ? PLACEHOLDERS.staff : photoUrl

  return (
    <div className="group text-center">
      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform">
        <Image
          src={imgSrc}
          alt={name}
          fill
          sizes="128px"
          className={showPlaceholder ? "object-contain p-4" : "object-cover"}
          onError={() => setImgError(true)}
        />
      </div>

      <h3 className="text-lg font-bold text-gray-900">{name}</h3>
      <p className="text-sm font-medium text-amber-600 mt-0.5">{role}</p>

      {bio && (
        <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-3 max-w-[200px] mx-auto">
          {bio}
        </p>
      )}

      {instagram && (
        <a
          href={`https://instagram.com/${instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-3 text-xs text-gray-500 hover:text-pink-500 transition-colors"
        >
          <AtSign className="w-3 h-3" />
          {instagram}
        </a>
      )}
    </div>
  )
}
