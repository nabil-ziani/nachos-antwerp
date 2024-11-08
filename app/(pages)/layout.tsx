import '@/styles/confirmation.css'

import Header from "@/app/layouts/header/index"
import Footer from "@/app/layouts/footer/index"

import { PaymentProvider } from "@/contexts/payment-context"
import { RestaurantProvider } from '@/contexts/restaurant-context'

const PagesLayouts = ({ children }: { children: React.ReactNode }) => {
    return (
        <RestaurantProvider>
            <PaymentProvider>
                <Header layout={"default"} />
                {children}
                <Footer layout={"default"} />
            </PaymentProvider>
        </RestaurantProvider>
    )
}
export default PagesLayouts