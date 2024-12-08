"use client"

import { useCart } from "@/hooks/useCart";
import Link from "next/link"
import { useEffect, MouseEvent, useRef } from "react"

const MiniCart = () => {
    const { cartItems, cartTotal, removeFromCart, setMiniCart } = useCart()
    const miniCartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cartNumberEl = document.querySelector('.tst-cart-number')

        if (cartNumberEl) {
            const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)
            cartNumberEl.innerHTML = String(totalQuantity)
        }
    }, [cartTotal])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Ignore clicks on the cart button itself
            if ((event.target as Element).closest('.tst-cart')) {
                return;
            }

            // Check if click is outside the mini-cart
            if (miniCartRef.current && !miniCartRef.current.contains(event.target as Node)) {
                setMiniCart(false);
            }
        };

        // Only use mousedown event to prevent conflicts
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

    return (
        <div ref={miniCartRef}>
            <div className="tst-minicart-header">
                <div className="tst-suptitle tst-suptitle-center"></div>
                <h5>Uw bestelling!</h5>
            </div>
            <ul className="woocommerce-mini-cart cart_list product_list_widget" data-testid="mini-cart">
                {cartItems.map((item, key) => (
                    <li className={`woocommerce-mini-cart-item mini_cart_item mini-cart-item-${key}`} key={key}>
                        <a href="#." className="remove remove_from_cart_button" data-testid={`remove-from-cart-${item.title.toLowerCase().replace(/\s+/g, '-')}`} aria-label="Remove this item" onClick={(e) => handleRemove(e, item.itemId)}>×</a>
                        <img src={item.image} alt={item.title} className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" />
                        {item.title}
                        <span className="quantity">{item.quantity} × <span className="woocommerce-Price-amount amount">
                            <bdi>
                                <span className="text-nacho-500">
                                    <span className="woocommerce-Price-currencySymbol">{item.currency}</span>
                                    {(item.price * 0.9).toFixed(2)}
                                </span>
                            </bdi>
                        </span></span>
                    </li>
                ))}
            </ul>
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
            <p className="woocommerce-mini-cart__buttons buttons">
                {cartItems.length > 0 && (
                    <Link href="/checkout" className="tst-btn" data-testid="go-to-checkout-button">Afrekenen</Link>
                )}
            </p>
        </div>
    );
};
export default MiniCart;