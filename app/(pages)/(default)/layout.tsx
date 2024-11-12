import Header from "@/app/layouts/header/index"
import Footer from "@/app/layouts/footer/index"

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header layout={"default"} />
            {children}
            <Footer layout={"default"} />
        </>
    )
}
export default DefaultLayout