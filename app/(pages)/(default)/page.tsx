import dynamic from "next/dynamic"

import AppData from "@/data/app.json"

import ScrollHint from "@/app/layouts/scroll-hint"
import Divider from "@/app/layouts/divider"

import AboutSection from "@/components/sections/about"
import FeaturesSection from "@/components/sections/features"
import ScheduleSection from "@/components/sections/schedule"
import CountersSection from "@/components/sections/counters"
import CallToActionSection from "@/components/sections/call-to-action"
import SubscribeSection from "@/components/sections/subscribe"
import CallToActionTacoSection from "@/components/sections/call-to-action-taco"

const HeroSlider = dynamic(() => import("@/components/sliders/hero"))
const TestimonialSlider = dynamic(() => import("@/components/sliders/testimonial"))

export const metadata = {
  title: {
    default: "Home",
  },
  description: AppData.settings.siteDescription,
}

export default async function HomePage() {
  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <HeroSlider />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <ScrollHint />
              <AboutSection />
              <Divider />
              <FeaturesSection />
              <Divider />
              <ScheduleSection />
              <Divider onlyBottom={0} />
              <CountersSection />
            </div>
          </div>
        </div>
        <CallToActionTacoSection />
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