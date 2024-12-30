"use client"

import MenuItem from "@/components/menu/menu-item"
import { MenuCategory, MenuItemWithCategory } from "@/lib/types";

interface MenuGridProps {
    items: MenuItemWithCategory[] | null
    categories: MenuCategory[] | null
    columns?: number
}

const MenuGrid = ({ categories, items, columns = 2 }: MenuGridProps) => {
    var columnsClass = '';

    switch (columns) {
        case 3:
            columnsClass = 'col-lg-4';
            break;
        case 2:
            columnsClass = 'col-lg-6';
            break;
        default:
            columnsClass = 'col-lg-3';
    }

    return (
        <>
            {categories?.map((category, category_key) => (
                <div key={`menu-category-item-${category_key}`}>
                    <div className="row">
                        <div className="col-lg-12">
                            {/* title */}
                            <div className="text-center">
                                <div className="tst-suptitle tst-suptitle-center tst-mb-15">{category.subtitle}</div>
                                <h3 className="tst-mb-30">
                                    {category.name}
                                </h3>
                                <p className="tst-text tst-mb-60">
                                    {category.description}
                                </p>
                            </div>
                            {/* title end */}
                        </div>

                        {items?.filter(i => i.category.id === category.id).map((item: MenuItemWithCategory, key) => (
                            <div className={columnsClass} key={`menu-grid-item-${key}`}>
                                <MenuItem item={{
                                    itemId: item.id,
                                    title: item.title,
                                    description: item.description,
                                    image: item.image_url,
                                    price: item.price,
                                    currency: item.currency,
                                    quantity: 1,
                                    variations: item.variations ? [{
                                        title: 'Opties',
                                        type: 'single',
                                        options: item.variations.map(v => ({
                                            name: v.name,
                                            price: v.price
                                        }))
                                    }] : undefined
                                }} />
                            </div>
                        ))}
                    </div>

                    {(categories.length - 1 > category_key) &&
                        <div className="tst-spacer tst-spacer-only-bottom-space"></div>
                    }
                </div>
            ))}
        </>
    )
}

export default MenuGrid