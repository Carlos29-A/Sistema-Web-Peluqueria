"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"

interface ImageUploadProps {
  value: string | null | undefined
  onChange: (url: string | null) => void
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function uploadToCloudinary(file: File) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset || cloudName === "tu_cloud_name_aqui") {
      setError("Configura Cloudinary en .env")
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", uploadPreset)

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      )

      if (!res.ok) throw new Error("Error al subir la imagen")

      const data = await res.json()
      onChange(data.secure_url)
    } catch {
      setError("Error al subir la imagen. Intenta de nuevo.")
    } finally {
      setUploading(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no debe superar 5MB")
      return
    }

    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes")
      return
    }

    uploadToCloudinary(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) uploadToCloudinary(file)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  if (value) {
    return (
      <div className="relative group">
        <Image
          src={value}
          alt="Preview"
          width={400}
          height={160}
          className="w-full h-40 object-cover rounded-lg border border-gray-200"
        />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-black"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition ${
          uploading
            ? "border-gray-300 bg-gray-50 cursor-wait"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {uploading ? (
          <>
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
            <p className="text-sm text-gray-500">Subiendo imagen...</p>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <Upload className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              Click o arrastra una imagen
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG hasta 5MB</p>
          </>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
          <ImageIcon className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  )
}
