'use client'

import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { LoadingSpinner } from '@/components/loading-spinner'
import { getTacoTuesdayDiscount, shouldShowTacoTuesdayReminder, isTuesday } from "@/lib/utils";
import { GiTacos } from "react-icons/gi";

const CartSummary = () => {
    const { cartItems, cartTotal, isLoading } = useCart()
    const tacoTuesdayDiscount = getTacoTuesdayDiscount(cartItems);
    const showTacoReminder = shouldShowTacoTuesdayReminder(cartItems);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (cartItems.length === 0) {
        return null;
    }

    const renderVariations = (item: any) => {
        if (!item.selectedVariations) return null;

        return Object.entries(item.selectedVariations).map(([groupTitle, variations]: [string, any]) => (
            <div key={groupTitle} className="tst-variation-group">
                {variations.map((variation: any) => (
                    <div key={`${groupTitle}-${variation.name}`} className="tst-variation-info">
                        <span className="tst-variation-name">{variation.name}</span>
                        {variation.price > 0 && (
                            <span className="tst-variation-price">+€{variation.price.toFixed(2)}</span>
                        )}
                        {variation.quantity > 1 && (
                            <span className="tst-variation-quantity">x{variation.quantity}</span>
                        )}
                    </div>
                ))}
            </div>
        ));
    };

    return (
        <div className="tst-pad-type-2 tst-sticky" data-margin-top="120" >
            <div className="tst-co-cart-frame">
                <div className="tst-cart-table">
                    <div className="tst-cart-table-header">
                        <div className="row">
                            <div className="col-lg-9">Bestelling</div>
                            <div className="col-lg-3 text-right">Totaal</div>
                        </div>
                    </div>

                    {cartItems.map((item, key) => (
                        <div className="tst-cart-item" key={key}>
                            <div className="row align-items-center">
                                <div className="col-lg-9">
                                    <Link className="tst-product" href="/product">
                                        <div className="tst-cover-frame">
                                            <img src={item.image} alt={item.title} />
                                        </div>
                                        <div className="tst-prod-description">
                                            <h6 className="tst-mb-15">{item.title}</h6>
                                            <div className="tst-variations-summary">
                                                {renderVariations(item)}
                                            </div>
                                            <p className="tst-text tst-text-sm">x{item.quantity}</p>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-lg-3 text-md-right">
                                    <div className="tst-price-2">
                                        <span>Totaal: </span>
                                        {item.currency}{(item.price * (item.quantity || 1)).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="tst-cart-total tst-cart-total-2">
                        <div className="tst-subtotal">
                            <div className="row">
                                <div className="col-6">
                                    <div className="tst-total-title">Subtotaal:</div>
                                </div>
                                <div className="col-6">
                                    <div className="tst-price-2 text-right">€{cartTotal.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="tst-discount-section">
                            <div className="tst-discount-code">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="tst-total-title">Kortingscode:</div>
                                    <div className="tst-code-display text-right">
                                        <span className="tst-code">WEBSITE</span>
                                        <span className="tst-discount-badge">- €{(cartTotal * 0.1).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            {tacoTuesdayDiscount > 0 && (
                                <div className="tst-discount-amount">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="tst-total-title">
                                            <GiTacos size={18} />
                                            {"  "}Taco Tuesday:
                                        </div>
                                        <div className="tst-price-2 text-right text-nacho-500">- €{tacoTuesdayDiscount.toFixed(2)}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="tst-realy-sum">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="tst-total-title">Totaal:</div>
                                <div className="tst-price-2 text-right">€{(cartTotal * 0.9 - tacoTuesdayDiscount).toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isTuesday() && showTacoReminder && (
                <div className="tst-cart-promo">
                    <div className="tst-cart-promo__icon">
                        <GiTacos size={24} />
                    </div>
                    <div className="tst-cart-promo__content">
                        <div className="tst-cart-promo__title">
                            Taco Tuesday
                        </div>
                        <div className="tst-cart-promo__message">
                            Voeg 2 taco's aan je winkelmand toe om te genieten van de 1+1 gratis promo!
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CartSummary