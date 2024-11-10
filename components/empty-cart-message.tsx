'use client'

import Link from "next/link"
import { useCart } from "@/hooks/useCart"
import { LoadingSpinner } from "@/components/loading-spinner"

function EmptyCartMessage() {
    const { cartItems, isLoading } = useCart()

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (cartItems.length === 0) {
        return (
            <div className="tst-content-frame">
                <div className="tst-content-box">
                    <div className="container tst-p-60-60 text-center">
                        <h2>Je winkelwagen is leeg</h2>
                        <p>Voeg eerst items toe aan je bestelling voordat je afrekent.</p>
                        <Link href="/menu" className="tst-btn">
                            Ga naar het menu
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return null
}

export default EmptyCartMessage