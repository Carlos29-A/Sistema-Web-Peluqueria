import type { AppointmentStatus as AppointmentStatusEnum } from "@/app/generated/prisma/enums"

export type { AppointmentStatusEnum as AppointmentStatus }

export interface CatalogService {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  category: string | null
  imageUrl: string | null
}

export interface StaffServiceItem {
  id: string
  name: string
  category: string | null
}

export interface GalleryItem {
  id: string
  imageUrl: string
  description: string | null
  category: string | null
}

export interface CatalogStaff {
  id: string
  name: string
  role: string
  bio: string | null
  photoUrl: string | null
  instagram: string | null
  services: StaffServiceItem[]
  gallery: GalleryItem[]
}

export interface StaffWithSchedule {
  id: string
  name: string
  role: string
  photoUrl: string | null
  services: { id: string }[]
  schedules: ScheduleSlot[]
}

export interface ScheduleSlot {
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface ServiceSelectItem {
  id: string
  name: string
  price: number
  duration: number
}

export interface StaffSelectItem {
  id: string
  name: string
}

export interface AppointmentTableItem {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  serviceId: string
  staffId: string | null
  appointmentDate: string
  appointmentTime: string
  status: AppointmentStatusEnum
  notes: string | null
  totalPrice: number | null
  service: { name: string; price: number; duration: number }
  staff: { name: string } | null
}

export interface ServiceTableItem {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  category: string | null
  imageUrl: string | null
  isActive: boolean
}

export interface StaffTableItem {
  id: string
  name: string
  role: string
  bio: string | null
  photoUrl: string | null
  instagram: string | null
  isActive: boolean
}

export interface GalleryTableItem {
  id: string
  imageUrl: string
  description: string | null
  category: string | null
  staffId: string | null
  isFeatured: boolean
  staff: { name: string } | null
}

export interface PublicGalleryItem {
  id: string
  imageUrl: string
  description: string | null
  category: string | null
  isFeatured: boolean
  staff: { name: string } | null
}

export interface LandingService {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  category: string | null
}

export interface LandingStaff {
  id: string
  name: string
  role: string
  bio: string | null
  photoUrl: string | null
  instagram: string | null
}

export interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  rating: number
}

export type StatusFilter = "ALL" | AppointmentStatusEnum