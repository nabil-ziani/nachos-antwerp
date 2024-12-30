'use client'

import { CartItem } from '@/lib/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartState {
    cartItems: CartItem[]
    cartTotal: number
    miniCart: boolean
    isLoading: boolean
    setMiniCart: (open: boolean) => void
    setIsLoading: (loading: boolean) => void
    addToCart: (item: CartItem) => void
    removeFromCart: (itemId: string) => void
    clearCart: () => void
}

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            cartItems: [],
            cartTotal: 0,
            miniCart: false,
            isLoading: true,
            setIsLoading: (loading) => set({ isLoading: loading }),
            addToCart: (item) => {
                const itemTotalPrice = item.price + (item.selectedVariations ?
                    Object.values(item.selectedVariations).flat().reduce((total, variation) =>
                        total + (variation.price || 0) * (variation.quantity || 1), 0
                    ) : 0);

                const existingItem = get().cartItems.find(ci => ci.itemId === item.itemId);
                if (existingItem) {
                    set({
                        cartItems: get().cartItems.map(ci =>
                            ci.itemId === item.itemId ? { ...ci, quantity: ci.quantity + 1 } : ci
                        ),
                        cartTotal: get().cartTotal + itemTotalPrice
                    });
                } else {
                    set({
                        cartItems: [...get().cartItems, { ...item, quantity: 1 }],
                        cartTotal: get().cartTotal + itemTotalPrice
                    });
                }
            },
            removeFromCart: (itemId) => {
                const item = get().cartItems.find(ci => ci.itemId === itemId);
                if (item) {
                    const itemTotalPrice = item.price + (item.selectedVariations ?
                        Object.values(item.selectedVariations).flat().reduce((total, variation) =>
                            total + (variation.price || 0) * (variation.quantity || 1), 0
                        ) : 0);

                    set({
                        cartItems: get().cartItems.filter(ci => ci.itemId !== itemId),
                        cartTotal: get().cartTotal - (itemTotalPrice * item.quantity)
                    });
                }
            },
            setMiniCart: (open) => set({ miniCart: open }),
            clearCart: () => set({ cartItems: [], cartTotal: 0 })
        }),
        {
            name: 'cart-storage',
            onRehydrateStorage: () => (state) => {
                state?.setIsLoading(false);
            }
        }
    )
)
