import AppData from "@/data/app.json"
import ScrollHint from "@/app/layouts/scroll-hint"

import PageBanner from "@/components/page-banner"
import CheckoutForm from "@/components/forms/checkout-form"
import CartSummary from "@/components/sections/cart-summary"
import { CheckoutGuard } from "@/components/checkout-guard"

export const metadata = {
    title: {
        default: "Afrekenen",
    },
    description: AppData.settings.siteDescription,
}

const Checkout = () => {
    return (
        <CheckoutGuard>
            <div id="tst-dynamic-banner" className="tst-dynamic-banner">
                <PageBanner
                    pageTitle="Bestelling afronden"
                    description="Vul je gegevens in om je bestelling te plaatsen"
                    breadTitle="Afrekenen"
                />
            </div>
            <div id="tst-dynamic-content" className="tst-dynamic-content">
                <div className="tst-content-frame">
                    <div className="tst-content-box">
                        <div className="container tst-p-60-60">
                            <ScrollHint />

                            <section className="tst-p-90-90">
                                <div className="container" data-sticky-container>
                                    <div className="row">
                                        <div className="col-lg-8">
                                            <CheckoutForm />
                                        </div>
                                        <div className="col-lg-4">
                                            <CartSummary />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </CheckoutGuard>
    )
}

export default Checkout