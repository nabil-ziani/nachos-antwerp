import Data from "@/data/sections/call-to-action.json"
import { RiPercentLine } from 'react-icons/ri'

const CallToActionSection = () => {
    return (
        <>
            {/* call to action */}
            <div className="tst-call-to-action">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            {/* text */}
                            <div className="tst-cta-frame">
                                <div className="tst-cta">
                                    <div className="tst-fade-up">
                                        <div className="tst-suptitle tst-suptitle-mobile-md-center tst-text-shadow tst-white-2 tst-mb-15">
                                            Speciale Aanbieding
                                        </div>
                                    </div>
                                    <h2 className="tst-white-2 tst-text-shadow tst-mb-30 tst-fade-up">
                                        Bespaar 10% op je bestelling
                                    </h2>
                                    <div className="tst-fade-up">
                                        <div className="tst-text tst-text-lg tst-text-shadow tst-white-2">
                                            Profiteer van 10% korting op al onze gerechten bij online bestellen - geldig voor zowel afhalen als bezorgen. Ontdek onze authentieke Mexicaanse smaken vandaag nog!
                                        </div>
                                    </div>
                                    <a href="/menu" className="tst-btn tst-btn-lg tst-btn-shadow tst-mt-30 tst-mr-10 tst-fade-up">
                                        Bestel Nu
                                    </a>
                                </div>
                            </div>
                            {/* text end */}
                        </div>
                        <div className="col-lg-6">
                            {/* discount icon */}
                            <div className="tst-cta-discount">
                                <div className="tst-cta-discount__icon">
                                    <RiPercentLine size={200} color="#fff" />
                                </div>
                                <div className="tst-cta-discount__badge">
                                    <span>10% KORTING</span>
                                </div>
                            </div>
                            {/* discount icon end */}
                        </div>
                    </div>
                </div>
            </div>
            {/* call to action end */}
        </>
    )
}

export default CallToActionSection