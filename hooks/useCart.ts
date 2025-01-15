'use client'

import { CartItem } from '@/types'
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
                const isJarritos = item.title.toLowerCase().includes('jarritos');

                // Calculate item price including variations
                const calculateItemTotal = (item: CartItem) => {
                    if (isJarritos && item.selectedVariations) {
                        // For Jarritos, multiply base price by total quantity of all variations
                        const totalQuantity = Object.values(item.selectedVariations)
                            .flat()
                            .reduce((total, variation: any) => total + (variation.quantity || 0), 0);
                        return item.price * totalQuantity;
                    }

                    if (item.selectedVariations) {
                        // For other items with variations, add variation prices
                        const variationsPrice = Object.values(item.selectedVariations)
                            .flat()
                            .reduce((total, variation: any) =>
                                total + (variation.price || 0) * (variation.quantity || 1), 0);
                        return (item.price + variationsPrice) * item.quantity;
                    }

                    // For regular items
                    return item.price * item.quantity;
                };

                if (isJarritos && item.selectedVariations) {
                    // Add Jarritos as a new item always
                    const totalPrice = calculateItemTotal(item);
                    set({
                        cartItems: [...get().cartItems, {
                            ...item,
                            quantity: item.quantity || 0
                        }],
                        cartTotal: get().cartTotal + totalPrice
                    });
                    return;
                }

                // For regular items and items with variations
                const existingItem = get().cartItems.find(ci => {
                    // For items without variations, just check the ID
                    if (!item.selectedVariations) {
                        return ci.itemId === item.itemId;
                    }

                    // For items with variations, check both ID and variations
                    return ci.itemId === item.itemId &&
                        ci.selectedVariations &&
                        JSON.stringify(ci.selectedVariations) === JSON.stringify(item.selectedVariations);
                });

                if (existingItem) {
                    // Update quantity for existing item
                    const updatedItems = get().cartItems.map(ci => {
                        if (!item.selectedVariations && ci.itemId === item.itemId) {
                            return { ...ci, quantity: ci.quantity + 1 };
                        }
                        if (item.selectedVariations &&
                            ci.itemId === item.itemId &&
                            ci.selectedVariations &&
                            JSON.stringify(ci.selectedVariations) === JSON.stringify(item.selectedVariations)) {
                            return { ...ci, quantity: ci.quantity + 1 };
                        }
                        return ci;
                    });

                    // Recalculate total
                    const newTotal = updatedItems.reduce((total, item) => total + calculateItemTotal(item), 0);

                    set({
                        cartItems: updatedItems,
                        cartTotal: newTotal
                    });
                } else {
                    // Add new item
                    const newItem = { ...item, quantity: 1 };
                    const totalPrice = calculateItemTotal(newItem);

                    set({
                        cartItems: [...get().cartItems, newItem],
                        cartTotal: get().cartTotal + totalPrice
                    });
                }
            },
            removeFromCart: (itemId) => {
                const item = get().cartItems.find(ci => ci.itemId === itemId);
                if (!item) return;

                const isJarritos = item.title.toLowerCase().includes('jarritos');
                let itemTotal;

                if (isJarritos && item.selectedVariations) {
                    const totalQuantity = Object.values(item.selectedVariations)
                        .flat()
                        .reduce((total, variation: any) => total + (variation.quantity || 0), 0);
                    itemTotal = item.price * totalQuantity;
                } else if (item.selectedVariations) {
                    const variationsPrice = Object.values(item.selectedVariations)
                        .flat()
                        .reduce((total, variation: any) =>
                            total + (variation.price || 0) * (variation.quantity || 1), 0);
                    itemTotal = (item.price + variationsPrice) * item.quantity;
                } else {
                    itemTotal = item.price * item.quantity;
                }

                set({
                    cartItems: get().cartItems.filter(ci => ci.itemId !== itemId),
                    cartTotal: get().cartTotal - itemTotal
                });
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
