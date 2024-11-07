import Header from "@/app/layouts/header/index"
import Footer from "@/app/layouts/footer/index"
import { PaymentProvider } from "@/contexts/payment-context"

const PagesLayouts = ({ children }: { children: React.ReactNode }) => {
    return (
        <PaymentProvider>
            <Header layout={"default"} />
            {children}
            <Footer layout={"default"} />
        </PaymentProvider>
    )
}
export default PagesLayouts