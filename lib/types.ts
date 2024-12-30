import { Tables } from "@/types/database.types"

export type VariationOption = {
    name: string
    price?: number
    isVegetarian?: boolean
    isVegan?: boolean
    isGlutenFree?: boolean
    quantity?: number
}

export type VariationGroup = {
    title: string
    description?: string
    type: 'single' | 'multiple'
    required?: boolean
    options: VariationOption[]
    maxSelections?: number
}

export type CartItemVariation = {
    name: string
    price?: number
    quantity: number
}

export type CartItem = {
    itemId: string
    title: string
    description: string
    image: string
    quantity: number
    price: number
    currency: string
    selectedVariations?: {
        [groupTitle: string]: CartItemVariation[]
    }
    variations?: VariationGroup[]
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
    variations?: {
        name: string
        price?: number
    }[]
    category: MenuCategory
}

// CHECKOUT FORM TYPES
export interface CheckoutFormValues {
    firstname: string
    lastname: string
    email: string
    tel: string
    company: string
    vatNumber: string
    city: string
    postcode: string
    address: string
    message: string
    payment_method: string
    delivery_method: string
    remember_details: boolean
}

export interface FormFieldProps {
    values: CheckoutFormValues;
    errors: any;
    touched: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
} 