import React from "react"
import dynamic from "next/dynamic"

import AppData from "@/data/app.json"
import MenuData from "@/data/menu.json"
// import ProductsData from "@/data/products.json"

import ScrollHint from "@/app/layouts/scroll-hint"

import PageBanner from "@/components/page-banner"
// import CallToActionTwoSection from "@/components/sections/call-to-action-two"

const MenuGrid = dynamic(() => import("@/components/menu/menu-grid"), { ssr: false })
// const ProductsSlider = dynamic(() => import("@/components/sliders/products"), { ssr: false })

export const metadata = {
    title: {
        default: "Menu",
    },
    description: AppData.settings.siteDescription,
}

const Menu = () => {
    return (
        <>
            <div id="tst-dynamic-banner" className="tst-dynamic-banner">
                <PageBanner
                    pageTitle={"Ontdek ons menu"}
                    description={"Ontdek heerlijke gerechten <br>vol smaak en passie."}
                    breadTitle={"Menu"}
                />
            </div>

            <div id="tst-dynamic-content" className="tst-dynamic-content">
                <div className="tst-content-frame">
                    <div className="tst-content-box">
                        <div className="container tst-p-60-0">
                            <ScrollHint />

                            <MenuGrid
                                categories={MenuData.categories}
                            />

                        </div>
                    </div>
                </div>
                {/* <CallToActionTwoSection />
                <div className="tst-content-frame">
                    <div className="tst-content-box">
                        <div className="container tst-p-60-60">

                            <ProductsSlider
                                heading={
                                    {
                                        "subtitle": "Menu",
                                        "title": "Special proposals",
                                        "description": "Porro eveniet, autem ipsam corrupti consectetur cum. <br>Repudiandae dignissimos fugiat sit nam."
                                    }
                                }
                                items={ProductsData.collection.special}
                                button={
                                    {
                                        "link": "/shop",
                                        "label": "Go to online store"
                                    }
                                }
                            />

                        </div>
                    </div>
                </div> */}
            </div>
        </>
    );
}

export default Menu