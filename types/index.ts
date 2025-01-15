import {
    Order as PrismaOrder,
    Restaurant as PrismaRestaurant,
    Reservation as PrismaReservation,
    MenuCategory as PrismaMenuCategory,
    MenuItem as PrismaMenuItem,
    DeliveryMethod,
    PaymentMethod,
    PaymentStatus,
    OrderStatus
} from '@prisma/client'
import { Tables } from './database.types'

// Menu types
export type MenuCategory = Tables<'menu_categories'>

export interface MenuItem extends Omit<PrismaMenuItem, 'variations'> {
    variations?: VariationGroup[]
}

export interface MenuItemWithCategory extends MenuItem {
    category: MenuCategory
}

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

// Cart types
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

// Order types
export type OrderItem = {
    image: string
    price: number
    title: string
    total: number
    currency: string
    quantity: number
    selectedVariations?: {
        [groupTitle: string]: Array<{
            name: string
            price?: number
            quantity?: number
        }>
    }
}

export type DeliveryAddress = {
    street: string
    city: string
    postcode: string
}

// Extend Prisma types with additional functionality
export interface Order extends Omit<PrismaOrder, 'orderItems' | 'deliveryAddress'> {
    orderItems: OrderItem[]
    deliveryAddress?: DeliveryAddress
}

export interface Restaurant extends PrismaRestaurant {
    allowedPostalcodes: string[]
    deliveryMinimums: { [key: string]: number }
}

// Form types
export interface CheckoutFormValues {
    firstName: string
    lastName: string
    email: string
    tel: string
    company: string
    vatNumber: string
    city: string
    address: string
    postcode: string
    message: string
    paymentMethod: PaymentMethod
    deliveryMethod: DeliveryMethod
    rememberDetails: boolean
}

// Re-export Prisma enums for convenience
export {
    DeliveryMethod,
    PaymentMethod,
    PaymentStatus,
    OrderStatus
} 