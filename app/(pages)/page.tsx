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
import { Tables } from "@/database.types"

const HeroSlider = dynamic(() => import("@/components/sliders/hero"), { ssr: false });
const TestimonialSlider = dynamic(() => import("@/components/sliders/testimonial"), { ssr: false });

const MenuFiltered = dynamic(() => import("@/components/menu/menu-filtered"), { ssr: false });

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
                categories={menu.menu_categories}
                items={menu.menu_items}
              />
            </div>
          </div>
        </div>
        <CallToActionTwoSection />
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <TestimonialSlider />
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
  )
}

async function getMenu() {
  const supabase = createClient()

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