import '@/styles/confirmation.css'
import '@/app/styles/css/plugins/bootstrap.min.css'
import '@/app/styles/css/plugins/swiper.min.css'
import '@/app/styles/css/plugins/font-awesome.min.css'
import '@/app/styles/scss/style.scss'

import { PaymentProvider } from "@/contexts/payment-context"
import { RestaurantProvider } from '@/contexts/restaurant-context'

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
    return (
        <RestaurantProvider>
            <PaymentProvider>
                <div className="payment-layout">
                    {children}
                </div>
            </PaymentProvider>
        </RestaurantProvider>
    )
} 