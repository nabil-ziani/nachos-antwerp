import Header from "@/app/layouts/header/index"
import Footer from "@/app/layouts/footer/index"

const PagesLayouts = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header layout={"default"} />

            {/* dynamic content */}
            {children}
            {/* dynamic content end */}

            <Footer layout={"default"} />
        </>
    )
}
export default PagesLayouts