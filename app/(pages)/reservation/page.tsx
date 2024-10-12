import AppData from "@/data/app.json";

import ScrollHint from "@/app/layouts/scroll-hint";
import Divider from "@/app/layouts/divider";

import PageBanner from "@/components/page-banner";
import ContactInfoSection from "@/components/sections/contact-info";
import ReservationFormSection from "@/components/sections/reservation-form";

export const metadata = {
    title: {
        default: "Reservation Form",
    },
    description: AppData.settings.siteDescription,
}

const Reservation = () => {
    return (
        <>
            <div id="tst-dynamic-banner" className="tst-dynamic-banner">
                <PageBanner pageTitle={"Reservering"} description={"We verwelkomen je graag! Reserveer een tafel en geniet van een unieke ervaring in een comfortabele omgeving."} breadTitle={"Tafel reserveren"} showMap={true} />
            </div>
            <div id="tst-dynamic-content" className="tst-dynamic-content">
                <div className="tst-content-frame">
                    <div className="tst-content-box">
                        <div className="container tst-p-60-60">
                            <ScrollHint />

                            <ReservationFormSection />
                            <Divider onlyBottom={0} />
                            <ContactInfoSection />

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Reservation