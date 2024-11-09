import { Tables } from "@/types/database.types"

export type CartItem = {
    itemId: string
    title: string
    description: string
    image: string
    quantity: number
    price: number
    currency: string
}

export type MenuCategory = Tables<'menu_categories'>

export type Restaurant = {
    id: string
    name: string
    address: string
    latitude: number
    longitude: number
    allowed_postalcodes: string[]
    delivery_minimums: Record<string, number>
}

export type MenuItemWithCategory = {
    id: string
    created_at: string
    title: string
    description: string
    price: number
    currency: string
    image_url: string
    extra_info: string
    category: MenuCategory
}