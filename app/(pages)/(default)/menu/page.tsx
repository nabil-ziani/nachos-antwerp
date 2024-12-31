import dynamic from "next/dynamic"

import AppData from "@/data/app.json"

import ScrollHint from "@/app/layouts/scroll-hint"

import PageBanner from "@/components/page-banner"
import { createClient } from "@/utils/supabase/server"
import { MenuItemWithCategory } from "@/lib/types"
import { Tables } from "@/types/database.types"

const MenuGrid = dynamic(() => import("@/components/menu/menu-grid"))

export const metadata = {
    title: {
        default: "Menu"
    },
    description: AppData.settings.siteDescription,
}

const Menu = async () => {
    const menu = await getMenu()

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

                            <MenuGrid items={menu.menu_items} categories={menu.menu_categories} />
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
        .select(`
            *,
            category(*)
        `)
        .returns<MenuItemWithCategory[]>()

    if (menu_items_err) {
        console.error('Error fetching menu items:', menu_items_err)
    }

    const { data: menu_categories, error: menu_categories_err } = await supabase
        .from('menu_categories')
        .select(`*`)
        .returns<Tables<'menu_categories'>[]>()

    if (menu_categories_err) {
        console.error('Error fetching menu categories:', menu_categories_err)
    }

    return { menu_items, menu_categories }
}

export default Menu