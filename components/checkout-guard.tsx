'use client'

import { useCart } from "@/hooks/useCart"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"

export function CheckoutGuard({ children }: { children: React.ReactNode }) {
    const { cartItems, isLoading } = useCart()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && cartItems.length === 0) {
            router.push("/menu")
        }
    }, [cartItems, isLoading, router])

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (cartItems.length === 0) {
        return null
    }

    return <>{children}</>
} 