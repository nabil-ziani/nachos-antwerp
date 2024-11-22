import dynamic from "next/dynamic"

import AppData from "@/data/app.json"

import ScrollHint from "@/app/layouts/scroll-hint"
import Divider from "@/app/layouts/divider"

import AboutSection from "@/components/sections/about"
import FeaturesSection from "@/components/sections/features"
import ScheduleSection from "@/components/sections/schedule"
import CountersSection from "@/components/sections/counters"
import CallToActionSection from "@/components/sections/call-to-action"
import CallToActionTwoSection from "@/components/sections/call-to-action-two"
import CallToActionThreeSection from "@/components/sections/call-to-action-three"
import ContactInfoSection from "@/components/sections/contact-info"
import ContactFormSection from "@/components/sections/contact-form"
import { createClient } from "@/utils/supabase/server"
import { MenuItemWithCategory } from "@/lib/types"
import { Tables } from "@/types/database.types"
import SubscribeSection from "@/components/sections/subscribe"

const HeroSlider = dynamic(() => import("@/components/sliders/hero"))
const TestimonialSlider = dynamic(() => import("@/components/sliders/testimonial"))

const MenuFiltered = dynamic(() => import("@/components/menu/menu-filtered"))

export const metadata = {
  title: {
    default: "Home",
  },
  description: AppData.settings.siteDescription,
}

export default async function HomePage() {
  const menu = await getMenu()

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
              <Divider />
              <CountersSection />
            </div>
          </div>
        </div>
        <CallToActionSection />
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

async function getMenu() {
  const supabase = await createClient()

  const { data: menu_items, error: menu_items_err } = await supabase
    .from('menu_items')
    .select(`*, category(*)`)
    .returns<MenuItemWithCategory[]>()

  if (menu_items_err) {
    console.error('Error fetching menu items:', menu_items_err);
  }

  const { data: menu_categories, error: menu_categories_err } = await supabase
    .from('menu_categories')
    .select(`*`)
    .returns<Tables<'menu_categories'>[]>()

  if (menu_categories_err) {
    console.error('Error fetching menu categories:', menu_categories_err);
  }

  return { menu_items, menu_categories }
}