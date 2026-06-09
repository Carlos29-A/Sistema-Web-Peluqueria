import type { Staff } from "@/app/generated/prisma/client";
import type { StaffTableItem } from "@/types";

export function toStaffTableItem(staff: Staff): StaffTableItem {
    return {
        id: staff.id,
        name: staff.name,
        role: staff.role,
        bio: staff.bio,
        photoUrl: staff.photoUrl,
        instagram: staff.instagram,
        isActive: staff.isActive,
    }
}