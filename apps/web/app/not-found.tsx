import Link from "next/link"
import Header from "@/app/layouts/header/layout-default"
import Footer from "@/app/layouts/footer/layout-default"

const NotFound = () => {
    return (
        <>
            <Header />

            <div id="tst-dynamic-banner" className="tst-dynamic-banner">
                {/* banner -*/}
                <div className="tst-banner">
                    <div className="tst-cover-frame" style={{ "overflow": "hidden" }}>
                        <img src="/img/banners/banner-sm-1.jpg" alt="cover" className="tst-cover tst-parallax" />
                        <div className="tst-overlay"></div>
                    </div>
                    <div className="tst-banner-content-frame">
                        <div className="container">
                            <div className="tst-main-title-frame">
                                <div className="tst-main-title text-center">
                                    <div className="tst-suptitle tst-suptitle-center tst-suptitle-mobile-center tst-text-shadow tst-white-2 tst-mb-15">404</div>
                                    <h1 className="tst-white-2 tst-text-shadow tst-mb-30">Oeps!</h1>
                                    <div className="tst-text tst-text-shadow tst-text-lg tst-white-2 tst-mb-30">Pagina niet gevonden! De pagina die je zoekt is verplaatst,<br /> verwijderd, hernoemd of heeft mogelijks nooit bestaan.</div>
                                    <Link href="/" className="tst-btn">
                                        <span>Terug naar de hoofdpagina</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* banner end */}
            </div>

            <Footer />
        </>
    );
};
export default NotFound