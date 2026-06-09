import type { Gallery } from "@/app/generated/prisma/client";
import type { GalleryTableItem } from "@/types";


type GalleryWithStaff = Gallery & { staff: { name: string } | null }

export function toGalleryTableItem(gallery: GalleryWithStaff) : GalleryTableItem {
    return {
        id: gallery.id,
        imageUrl: gallery.imageUrl,
        description: gallery.description,
        category: gallery.category,
        staffId: gallery.staffId,
        isFeatured: gallery.isFeatured,
        staff: gallery.staff
    }
}