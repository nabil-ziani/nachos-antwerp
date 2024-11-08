import AppData from "@/data/app.json"
import ScrollHint from "@/app/layouts/scroll-hint"

import PageBanner from "@/components/page-banner"
import CheckoutForm from "@/components/forms/checkout-form"
import CartSummary from "@/components/sections/cart-summary"

export const metadata = {
    title: {
        default: "Order checkout",
    },
    description: AppData.settings.siteDescription,
}

const Checkout = () => {
    return (
        <>
            <div id="tst-dynamic-banner" className="tst-dynamic-banner">
                <PageBanner pageTitle={"Checkout"} description={"Quaerat debitis, vel, sapiente dicta sequi <br>labore porro pariatur harum expedita."} breadTitle={"Checkout"} />
            </div>
            <div id="tst-dynamic-content" className="tst-dynamic-content">
                <div className="tst-content-frame">
                    <div className="tst-content-box">
                        <div className="container tst-p-60-60">
                            <ScrollHint />

                            {/* checkout */}
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
                            {/* checkout end */}

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Checkout