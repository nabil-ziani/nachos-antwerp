"use client"

import { useCart } from "@/hooks/useCart"
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect, MouseEvent } from 'react'

const MiniCart = () => {
    const router = useRouter()
    const [isNavigating, setIsNavigating] = useState(false)
    const { cartItems, cartTotal, removeFromCart, setMiniCart } = useCart()
    const miniCartRef = useRef<HTMLDivElement>(null);

    console.log('cartItems', cartItems)

    useEffect(() => {
        const cartNumberEl = document.querySelector('.tst-cart-number')

        if (cartNumberEl) {
            const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)
            cartNumberEl.innerHTML = String(totalQuantity)
        }
    }, [cartTotal])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if ((event.target as Element).closest('.tst-cart')) {
                return;
            }

            if (miniCartRef.current && !miniCartRef.current.contains(event.target as Node)) {
                setMiniCart(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside as any);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside as any);
        };
    }, [setMiniCart]);

    const handleRemove = (e: MouseEvent, itemId: string) => {
        e.preventDefault()
        e.stopPropagation()
        removeFromCart(itemId)
    }

    const handleCheckout = () => {
        setIsNavigating(true)
        router.push('/checkout')
    }

    const calculateItemTotal = (item: any) => {
        //console.log('item in calculateItemTotal', item)

        const isJarritos = item.title.toLowerCase().includes('jarritos');

        if (isJarritos && item.selectedVariations) {
            // Tel alle quantities van de variaties op
            const totalQuantity = Object.values(item.selectedVariations)
                .flat()
                .reduce((total: number, variation: any) =>
                    total + (variation.quantity || 0), 0);

            // Vermenigvuldig de totale quantity met de basisprijs
            return item.price * totalQuantity;
        }

        // Voor andere items, gebruik de bestaande logica
        const variationsPrice = item.selectedVariations
            ? Object.values(item.selectedVariations)
                .flat()
                .reduce((total: number, variation: any) =>
                    total + (variation.price || 0) * (variation.quantity || 1), 0)
            : 0;

        return (item.price + variationsPrice) * item.quantity;
    };

    const renderVariations = (item: any) => {
        if (!item.selectedVariations) return null;

        const isJarritos = item.title.toLowerCase().includes('jarritos');

        return Object.entries(item.selectedVariations).map(([groupTitle, variations]: [string, any]) => (
            <div key={groupTitle} className="tst-variations-group">
                {variations.map((variation: any) => (
                    <div key={`${groupTitle}-${variation.name}`} className="tst-variation-info">
                        <span className="tst-variation-name">
                            {variation.quantity}x {variation.name}
                        </span>
                    </div>
                ))}
            </div>
        ));
    };

    return (
        <div ref={miniCartRef}>
            <div className="tst-minicart-header">
                <div className="tst-suptitle tst-suptitle-center"></div>
                <h5>Uw bestelling!</h5>
            </div>
            <ul className="woocommerce-mini-cart cart_list product_list_widget" data-testid="mini-cart">
                {cartItems.length === 0 ? (
                    <div className="empty-cart-message">
                        <p>Uw winkelmand is leeg</p>
                    </div>
                ) : (
                    cartItems.map((item, key) => {
                        const isJarritos = item.title.toLowerCase().includes('jarritos');
                        return (
                            <li className={`woocommerce-mini-cart-item mini_cart_item mini-cart-item-${key}`} key={key}>
                                <a href="#." className="remove remove_from_cart_button" data-testid={`remove-from-cart-${item.title.toLowerCase().replace(/\s+/g, '-')}`} aria-label="Remove this item" onClick={(e) => handleRemove(e, item.itemId)}>×</a>
                                <img src={item.image} alt={item.title} className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" />
                                <div className="tst-cart-item-details">
                                    <div className="tst-cart-item-title">
                                        {!isJarritos && item.quantity > 1 && <span className="tst-quantity-badge">{item.quantity}x </span>}
                                        {item.title}
                                    </div>
                                    <div className="tst-cart-item-variations">
                                        {renderVariations(item)}
                                    </div>
                                    <span className="quantity">
                                        <span className="woocommerce-Price-amount amount">
                                            <bdi>
                                                <span className="text-nacho-500">
                                                    <span className="woocommerce-Price-currencySymbol">{item.currency}</span>
                                                    {calculateItemTotal(item).toFixed(2)}
                                                </span>
                                            </bdi>
                                        </span>
                                    </span>
                                </div>
                            </li>
                        );
                    })
                )}
            </ul>
            {cartItems.length > 0 && (
                <>
                    <p className="woocommerce-mini-cart__total subtotal">
                        <strong>Subtotaal:</strong> <span className="woocommerce-Price-amount amount">
                            <bdi>
                                <span className="text-nacho-500">
                                    <span className="woocommerce-Price-currencySymbol">€</span>
                                    {cartTotal.toFixed(2)}
                                </span>
                            </bdi>
                        </span>
                    </p>
                    <p className="woocommerce-mini-cart__total discount">
                        <strong>Korting (10%):</strong> <span className="woocommerce-Price-amount amount">
                            <bdi>
                                <span className="text-nacho-500">
                                    <span className="woocommerce-Price-currencySymbol">- €</span>
                                    {(cartTotal * 0.1).toFixed(2)}
                                </span>
                            </bdi>
                        </span>
                    </p>
                    <p className="woocommerce-mini-cart__total total">
                        <strong>Totaal:</strong> <span className="woocommerce-Price-amount amount">
                            <bdi>
                                <span className="text-nacho-500">
                                    <span className="woocommerce-Price-currencySymbol">€</span>
                                    {(cartTotal * 0.9).toFixed(2)}
                                </span>
                            </bdi>
                        </span>
                    </p>
                </>
            )}
            <p className="woocommerce-mini-cart__buttons buttons">
                {cartItems.length > 0 && (
                    <button
                        onClick={handleCheckout}
                        className={`tst-btn ${isNavigating ? 'loading' : ''}`}
                        disabled={isNavigating}
                        data-testid="go-to-checkout-button"
                    >
                        {isNavigating ? 'Even geduld...' : 'Afrekenen'}
                        {isNavigating && <div className="spinner" />}
                    </button>
                )}
            </p>
        </div>
    );
};
export default MiniCart;