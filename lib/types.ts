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