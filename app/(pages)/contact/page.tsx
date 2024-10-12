import AppData from "@/data/app.json"

import ScrollHint from "@/app/layouts/scroll-hint"
import Divider from "@/app/layouts/divider"

import PageBanner from "@/components/page-banner"
import ContactInfoSection from "@/components/sections/contact-info"
import ContactFormSection from "@/components/sections/contact-form"

export const metadata = {
    title: {
        default: "Contact",
    },
    description: AppData.settings.siteDescription,
}

const Contact = () => {
    return (
        <>
            <div id="tst-dynamic-banner" className="tst-dynamic-banner">
                <PageBanner
                    pageTitle={"Neem contact op"}
                    description={"We horen graag van je! <br>Neem contact met ons op."}
                    breadTitle={"Contact"}
                    showMap={true}
                />
            </div>
            <div id="tst-dynamic-content" className="tst-dynamic-content">
                <div className="tst-content-frame">
                    <div className="tst-content-box">
                        <div className="container tst-p-60-60">
                            <ScrollHint />

                            <ContactInfoSection />
                            <Divider />
                            <ContactFormSection />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contact