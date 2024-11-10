import Link from 'next/link'

import { useCart } from '@/hooks/useCart'
import { CartItem } from '@/lib/types'
import { LoadingSpinner } from '@/components/loading-spinner'

const CartSummary = () => {
    const { cartItems, cartTotal, isLoading } = useCart()

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (cartItems.length === 0) {
        return null;
    }

    return (
        <div className="tst-pad-type-2 tst-sticky" data-margin-top="120">
            <div className="tst-co-cart-frame">
                <div className="tst-cart-table">
                    <div className="tst-cart-table-header">
                        <div className="row">
                            <div className="col-lg-9">Bestelling</div>
                            <div className="col-lg-3 text-right">Totaal</div>
                        </div>
                    </div>

                    {cartItems.map((item: CartItem, key) => (
                        <div className="tst-cart-item" key={key}>
                            <div className="row align-items-center">
                                <div className="col-lg-9">
                                    <Link className="tst-product" href="/product">
                                        <div className="tst-cover-frame">
                                            <img src={item.image} alt={item.title} />
                                        </div>
                                        <div className="tst-prod-description">
                                            <h6 className="tst-mb-15">{item.title}</h6>
                                            <p className="tst-text tst-text-sm">x{item.quantity}</p>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-lg-3 text-md-right">
                                    <div className="tst-price-2"><span>Totaal: </span>{item.currency}{item.price}</div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="tst-cart-total tst-cart-total-2">
                        <div className="tst-realy-sum">
                            <div className="row">
                                <div className="col-6">
                                    <div className="tst-total-title">Totaal:</div>
                                </div>
                                <div className="col-6">
                                    <div className="tst-price-2 text-right">€{cartTotal.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartSummary