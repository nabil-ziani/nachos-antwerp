import React, { Suspense } from "react"
import dynamic from "next/dynamic"

import AppData from "@/data/app.json"
import MenuData from "@/data/menu.json"

import ScrollHint from "@/app/layouts/scroll-hint"
import Divider from "@/app/layouts/divider"

import AboutSection from "@/components/sections/about"
import FeaturesSection from "@/components/sections/features"
// import TeamSection from "@components/sections/Team"
import ScheduleSection from "@/components/sections/schedule"
import CountersSection from "@/components/sections/counters"
import CallToActionSection from "@/components/sections/call-to-action"
import CallToActionTwoSection from "@/components/sections/call-to-action-two"
import CallToActionThreeSection from "@/components/sections/call-to-action-three"
// import SubscribeSection from "@components/sections/Subscribe"
import ContactInfoSection from "@/components/sections/contact-info"
import ContactFormSection from "@/components/sections/contact-form"

const HeroSlider = dynamic(() => import("@/components/sliders/hero"), { ssr: false });
const TestimonialSlider = dynamic(() => import("@/components/sliders/testimonial"), { ssr: false });

const MenuFiltered = dynamic(() => import("@/components/menu/menu-filtered"), { ssr: false });

export const metadata = {
  title: {
    default: "Nacho's Antwerp",
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
              {/* <Divider /> */}
              {/* <TeamSection /> */}
              <Divider />
              <CountersSection />
              <Divider />
              <ScheduleSection />
            </div>
          </div>
        </div>
        <CallToActionSection />
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-0">
              <MenuFiltered
                heading={
                  {
                    "subtitle": "Menu",
                    "title": "Ons Menu",
                    "description": "Geniet van authentieke Mexicaanse smaken met onze heerlijke gerechten!"
                  }
                }
                categories={MenuData.categories}
              />
            </div>
          </div>
        </div>
        <CallToActionTwoSection />
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <TestimonialSlider />
              {/* <Divider onlyBottom={0} /> */}
              {/* <Suspense fallback={<div>Loading...</div>}>
                <LatestPostsSection posts={posts} />
              </Suspense>
              <Divider onlyBottom={0} /> */}
              {/* <SubscribeSection /> */}
            </div>
          </div>
        </div>
        <CallToActionThreeSection />
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <ContactInfoSection />
              <Divider />
              <ContactFormSection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
