"use client";

import CartData from "@/data/cart.json";
import Link from "next/link";
import { useState, useEffect, MouseEvent } from "react";

const MiniCart = () => {
    const [cartTotal, setCartTotal] = useState<any>(CartData.total);

    useEffect(() => {
        const cartNumberEl = document.querySelector('.tst-cart-number');

        if (cartNumberEl) {
            cartNumberEl.innerHTML = cartTotal;
        }
    }, [cartTotal]);

    const removeFromCart = (e: MouseEvent, key: string | number) => {
        e.preventDefault();
        const cartNumberEl = document.querySelector('.tst-cart-number');
        setCartTotal(cartTotal - 1);

        if (cartNumberEl) {
            cartNumberEl.classList.add('tst-added');

            setTimeout(() => {
                cartNumberEl.classList.remove('tst-added');
                document.querySelector('.mini-cart-item-' + key)!.remove();
            }, 600);
        }
    }

    return (
        <>
            <div className="tst-minicart-header">
                <div className="tst-suptitle tst-suptitle-center"></div>
                <h5>Uw bestelling!</h5>
            </div>
            <ul className="woocommerce-mini-cart cart_list product_list_widget">
                {CartData.items.map((item, key) => (
                    <li className={`woocommerce-mini-cart-item mini_cart_item mini-cart-item-${key}`} key={key}>
                        <a href="#." className="remove remove_from_cart_button" aria-label="Remove this item" onClick={(e) => removeFromCart(e, key)}>×</a>
                        <Link href="/product">
                            <img src={item.image} alt={item.title} className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" />
                            {item.title}
                        </Link>
                        <span className="quantity">{item.quantity} × <span className="woocommerce-Price-amount amount"><bdi><span className="woocommerce-Price-currencySymbol">{item.currency}</span>{item.price}</bdi></span></span>
                    </li>
                ))}
            </ul>
            <p className="woocommerce-mini-cart__total total">
                <strong>Totaal:</strong> <span className="woocommerce-Price-amount amount"><bdi><span className="woocommerce-Price-currencySymbol">€</span>15</bdi></span>
            </p>
            <p className="woocommerce-mini-cart__buttons buttons">
                <Link href="/cart" className="tst-btn tst-btn-2">Bekijk bestelling</Link>
                <Link href="/checkout" className="tst-btn">Betalen</Link>
            </p>
        </>
    );
};
export default MiniCart;