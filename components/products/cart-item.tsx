// ******* IS NOT USED ANYMORE *******
"use client";

import { useCart } from "@/hooks/useCart";
import { CartItem as CartItemType } from "@/lib/types";
import Link from "next/link";
import { useState, useEffect } from "react";

const CartItem = ({ item, key }: { item: CartItemType, key: any }) => {
    const [quantity, setQuantity] = useState(item.quantity);
    const [total, setTotal] = useState((item.price * item.quantity).toFixed(2));
    const minQuantity = 1;
    const maxQuantity = 10;

    const { cartItems, cartTotal, removeFromCart } = useCart()

    useEffect(() => {
        const cartNumberEl = document.querySelector<HTMLElement>('.tst-cart-number')

        if (cartNumberEl) {
            const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)
            cartNumberEl.innerHTML = String(totalQuantity)
        }
    }, [cartTotal])

    useEffect(() => {
        setTotal((quantity * item.price).toFixed(2));
    }, [quantity]);

    const handleRemoveFromCart = (e: any, itemId: string) => {
        e.preventDefault();
        removeFromCart(itemId)

        const cartNumberEl = document.querySelector('.tst-cart-number')
        // setCartTotal(cartTotal - quantity);

        if (cartNumberEl) {
            cartNumberEl.classList.add('tst-added')

            setTimeout(() => {
                cartNumberEl.classList.remove('tst-added')

                const el = document.querySelector('.tst-cart-item-' + key)
                el && el.remove()
            }, 600)
        }
    }

    return (
        <>
            <div className={`tst-cart-item tst-cart-item-${key}`} data-testid={`cart-item-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <Link className="tst-product" href={`/product`}>
                            <div className="tst-cover-frame">
                                <img src={item.image} alt={item.title} />
                            </div>
                            <div className="tst-prod-description">
                                <h6 className="media-heading tst-mb-15">{item.title}</h6>
                                <p className="tst-text tst-text-sm">{item.description}</p>
                            </div>
                        </Link>
                    </div>
                    <div className="col-6 col-lg-3">
                        <div className="tst-input-number-frame">
                            <div className="tst-input-number-btn tst-sub" onClick={() => setQuantity(quantity > minQuantity ? quantity - 1 : quantity)}>-</div>
                            <input type="number" value={quantity} readOnly />
                            <div className="tst-input-number-btn tst-add" onClick={() => setQuantity(quantity < maxQuantity ? quantity + 1 : quantity)}>+</div>
                        </div>
                    </div>
                    <div className="col-3 col-lg-1">
                        <div className="tst-price-1"><span>Price: </span>{item.currency}{item.price}</div>
                    </div>
                    <div className="col-3 col-lg-1">
                        <div className="tst-price-2"><span>Total: </span>{item.currency}{total}</div>
                    </div>
                    <div className="col-1">
                        <a href="#." className="tst-remove" onClick={(e) => handleRemoveFromCart(e, item.itemId)}>+</a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartItem