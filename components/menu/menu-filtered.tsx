"use client";

import { SliderProps } from "@/app/common/slider-props"
import { Swiper, SwiperSlide } from "swiper/react"

import MenuItem from "@/components/menu/menu-item"
import { MenuCategory, MenuItemWithCategory } from "@/types";

interface MenuFilteredProps {
    heading?: any
    categories: MenuCategory[] | null
    items: MenuItemWithCategory[] | null
}

const MenuFiltered = ({ heading = 0, categories, items }: MenuFilteredProps) => {
    return (
        <>
            <div className="row" id="menu">
                <div className="col-lg-12">
                    {heading != 0 &&
                        <>
                            <div className="text-center">
                                <div className="tst-suptitle tst-suptitle-center tst-mb-15">{heading.subtitle}</div>
                                <h3 className="tst-mb-30" dangerouslySetInnerHTML={{ __html: heading.title }} />
                                <p className="tst-text tst-mb-30" dangerouslySetInnerHTML={{ __html: heading.description }} />
                            </div>
                        </>
                    }
                </div>

                <div className="col-lg-12">
                    <div className="swiper-menu-nav">
                        {categories?.map((category: MenuCategory, key) => (
                            <span key={`menu-category-item-${key}`} data-slug={`${category.slug}`}>{category.name}</span>
                        ))}
                    </div>
                    <div className="tst-spacer tst-spacer-only-bottom-space"></div>
                </div>

                <div className="col-lg-12">
                    {/* Slider main container */}
                    <Swiper {...SliderProps.menuSlider} className="swiper-container swiper-menu">
                        {categories?.map((category, category_key) => (
                            <SwiperSlide className="swiper-slide" key={`menu-filtered-category-${category_key}`}>
                                <div className="row">
                                    {items?.filter(i => i.category.id === category.id).map((item, key) => (
                                        <div className="col-lg-6" key={`menu-filtered-item-${category_key}-${key}`}>
                                            <MenuItem item={{
                                                itemId: item.id,
                                                title: item.title,
                                                description: item.description ?? '',
                                                image: item.image_url,
                                                price: item.price,
                                                currency: item.currency,
                                                quantity: 1,
                                                variations: item.variations
                                            }} />
                                        </div>
                                    ))}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {/* Slider main container end */}
                </div>
            </div>
        </>
    )
}

export default MenuFiltered