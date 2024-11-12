"use client"

import { useCart } from "@/hooks/useCart";
import Link from "next/link"
import { useEffect, MouseEvent } from "react"

const MiniCart = () => {
    const { cartItems, cartTotal, removeFromCart } = useCart()

    useEffect(() => {
        const cartNumberEl = document.querySelector('.tst-cart-number')

        if (cartNumberEl) {
            const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)
            // console.log('total quantity: ', totalQuantity)
            cartNumberEl.innerHTML = String(totalQuantity)
        }
    }, [cartTotal])

    const handleRemove = (e: MouseEvent, itemId: string) => {
        e.preventDefault()

        removeFromCart(itemId)
    }

    return (
        <>
            <div className="tst-minicart-header">
                <div className="tst-suptitle tst-suptitle-center"></div>
                <h5>Uw bestelling!</h5>
            </div>
            <ul className="woocommerce-mini-cart cart_list product_list_widget">
                {cartItems.map((item, key) => (
                    <li className={`woocommerce-mini-cart-item mini_cart_item mini-cart-item-${key}`} key={key}>
                        <a href="#." className="remove remove_from_cart_button" aria-label="Remove this item" onClick={(e) => handleRemove(e, item.itemId)}>×</a>
                        {/* <Link href="/product"> */}
                        <img src={item.image} alt={item.title} className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" />
                        {item.title}
                        {/* </Link> */}
                        <span className="quantity">{item.quantity} × <span className="woocommerce-Price-amount amount"><bdi><span className="woocommerce-Price-currencySymbol">{item.currency}</span>{item.price}</bdi></span></span>
                    </li>
                ))}
            </ul>
            <p className="woocommerce-mini-cart__total total">
                <strong>Totaal:</strong> <span className="woocommerce-Price-amount amount"><bdi><span className="woocommerce-Price-currencySymbol">€</span>{cartTotal.toFixed(2)}</bdi></span>
            </p>
            <p className="woocommerce-mini-cart__buttons buttons">
                {/* <Link href="/cart" className="tst-btn tst-btn-2">Bekijk bestelling</Link> */}
                {cartItems.length > 0 && <Link href="/checkout" className="tst-btn">Afrekenen</Link>}
            </p>
        </>
    );
};
export default MiniCart;