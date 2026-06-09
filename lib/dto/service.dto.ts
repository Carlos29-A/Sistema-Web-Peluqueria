import type { Service } from "@/app/generated/prisma/client";
import type { ServiceTableItem, CatalogService } from "@/types";


export function toServiceTableItem(service: Service) : ServiceTableItem {
    return {
        id: service.id,
        name: service.name,
        description: service.description,
        price: Number(service.price), // Prisma devuelve decimal -> lo convertimos a numero
        duration: service.duration,
        category: service.category,
        imageUrl: service.imageUrl,
        isActive: service.isActive,     
    }
}
