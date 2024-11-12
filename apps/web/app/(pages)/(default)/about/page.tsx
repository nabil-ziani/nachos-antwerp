import React, { Suspense } from "react"
import dynamic from "next/dynamic"

import AppData from "@/data/app.json"

import ScrollHint from "@/app/layouts/scroll-hint"
import Divider from "@/app/layouts/divider"

import PageBanner from "@/components/page-banner"
import PromoVideoSection from "@/components/sections/promo-video"
import FeaturesSection from "@/components/sections/features"
import ScheduleSection from "@/components/sections/schedule"
import CountersSection from "@/components/sections/counters"
import CallToActionFourSection from "@/components/sections/call-to-action-four"
import SubscribeSection from "@/components/sections/subscribe"

const TestimonialSlider = dynamic(() => import("@/components/sliders/testimonial"), { ssr: false });

export const metadata = {
    title: {
        default: "About",
    },
    description: AppData.settings.siteDescription,
}

async function About() {

    const Content = {
        "subtitle": "Over ons",
        "title": "Bezoek ons<br>restaurant",
        "description": "Wij heten je van harte welkom om te genieten van onze heerlijke gerechten, gezellige sfeer en warme gastvrijheid. Kom langs en ervaar het zelf!"
    }

    return (
        <>
            <div id="tst-dynamic-banner" className="tst-dynamic-banner">
                <PageBanner
                    pageTitle={"Nacho's Antwerp"}
                    description={"Ontdek hoe passie en traditie samenkomen om heerlijke gerechten te creëren."}
                    breadTitle={"Over ons"}
                />            </div>
            <div id="tst-dynamic-content" className="tst-dynamic-content">
                <div className="tst-content-frame">
                    <div className="tst-content-box">
                        <div className="container tst-p-60-0">
                            <ScrollHint />

                            <div className="row">
                                <div className="col-lg-12">

                                    {/* about text */}
                                    <div className="tst-mb-60 text-center">
                                        <div className="tst-suptitle tst-suptitle-center tst-mb-15" dangerouslySetInnerHTML={{ __html: Content.subtitle }} />
                                        <h3 className="tst-mb-30" dangerouslySetInnerHTML={{ __html: Content.title }} />
                                        <p className="tst-text tst-mb-30" dangerouslySetInnerHTML={{ __html: Content.description }} />

                                        {AppData.social.map((item, key) => (
                                            <a href={item.link} target="_blank" title={item.title} className="tst-icon-link" key={`about-social-item-${key}`}><i className={item.icon}></i></a>
                                        ))}
                                    </div>
                                    {/* about text end */}

                                </div>
                            </div>
                            <PromoVideoSection />
                            <Divider />
                            <FeaturesSection />
                            <Divider />
                            <ScheduleSection />
                            <Divider onlyBottom={0} />
                            <CountersSection />
                        </div>
                    </div>
                </div>
                <CallToActionFourSection />
                <div className="tst-content-frame">
                    <div className="tst-content-box">
                        <div className="container tst-p-60-60">
                            <TestimonialSlider />
                            <Divider onlyBottom={0} />
                            <SubscribeSection />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default About