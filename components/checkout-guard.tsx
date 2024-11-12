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

    // Show loading spinner while checking cart state
    if (isLoading) {
        return (
            <div className="container py-5 text-center">
                <LoadingSpinner />
                <p className="mt-3">Even geduld aub...</p>
            </div>
        )
    }

    // Don't render anything if cart is empty (prevents flash)
    if (cartItems.length === 0) {
        return null
    }

    return <>{children}</>
} 