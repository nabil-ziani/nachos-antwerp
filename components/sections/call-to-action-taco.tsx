import { GiTacos } from "react-icons/gi";

const CallToActionTacoSection = () => {
    return (
        <>
            {/* call to action taco */}
            <div className="tst-call-to-action">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            {/* text */}
                            <div className="tst-cta-frame">
                                <div className="tst-cta">
                                    <div className="tst-fade-up">
                                        <div className="tst-suptitle tst-suptitle-mobile-md-center tst-text-shadow tst-white-2 tst-mb-15">
                                            Taco Tuesday
                                        </div>
                                    </div>
                                    <h2 className="tst-white-2 tst-text-shadow tst-fade-up tst-mb-30">
                                        Koop 1 Taco<br />Krijg 1 Gratis
                                    </h2>
                                    <div className="tst-fade-up">
                                        <div className="tst-text tst-text-lg tst-text-shadow tst-white-2 tst-mb-30">
                                            Elke dinsdag is het feest! Bestel een taco naar keuze<br />en krijg er een tweede helemaal gratis bij.
                                        </div>
                                    </div>
                                    <a href="/menu" className="tst-btn tst-btn-lg tst-btn-shadow tst-anima-link tst-fade-up tst-mr-30">
                                        Bekijk Menu
                                    </a>
                                </div>
                            </div>
                            {/* text end */}
                        </div>
                        <div className="col-lg-6 d-flex justify-content-center">
                            {/* taco icon */}
                            <div className="tst-cta-discount">
                                <div className="tst-cta-discount__icon">
                                    <GiTacos size={200} color="#fff" />
                                </div>
                                <div className="tst-cta-discount__badge">
                                    <span>1+1 GRATIS</span>
                                </div>
                            </div>
                            {/* taco icon end */}
                        </div>
                    </div>
                </div>
            </div>
            {/* call to action taco end */}
        </>
    )
}

export default CallToActionTacoSection 