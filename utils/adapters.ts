import { Tables } from "@/types/database.types"
import { MenuItemWithCategory, VariationGroup } from "@/types"

export function adaptMenuItem(item: Tables<'menu_items'> & { category: Tables<'menu_categories'> }): MenuItemWithCategory {
    return {
        id: item.id,
        title: item.title,
        description: item.description,
        extraInfo: item.extra_info,
        price: item.price,
        currency: item.currency,
        imageUrl: item.image_url,
        variations: item.variations ? (item.variations as VariationGroup[]) : undefined,
        categoryId: item.category,
        category: item.category,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.created_at),
        isAvailable: true
    }
} 