"use client"

import { useState, useEffect, MouseEvent } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

import { useStore } from "@/hooks/useStore"
import { CartItem } from "@/lib/types"

const MenuItem = ({ item }: { item: CartItem }) => {
  const [img, setImg] = useState(false);
  const [imgValue, setImgValue] = useState<any>([]);

  const { cartItems, cartTotal, addToCart, setMiniCart } = useStore()

  useEffect(() => {
    const cartNumberEl = document.querySelector('.tst-cart-number')

    if (cartNumberEl) {
      const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)
      cartNumberEl.innerHTML = String(totalQuantity)
    }
  }, [cartTotal])

  const handleAddToCard = (e: MouseEvent) => {
    e.preventDefault()

    // Open mini-cart
    addToCart(item)
    setMiniCart(true)
  }

  return (
    <>
      <div className="tst-menu-book-item tst-mbi-3" data-swiper-parallax-y="60" data-swiper-parallax-opacity="0" data-swiper-parallax-duration="1000">
        <a href={item.image} data-fancybox="menu" className="tst-item-cover-frame tst-cursor-zoom" onClick={(e) => { e.preventDefault(); setImg(true); setImgValue([{ "src": item.image, "alt": item.title }]); }}>
          <img src={item.image} alt={item.title} />
          <span className="tst-overlay"></span>
        </a>
        <div className="tst-menu-book-descr">
          <div className="tst-menu-book-name">
            <h5 className="tst-mb-15">{item.title}</h5>
            <div className="tst-text">
              {item.description}
            </div>
            <div className="tst-spacer-sm"></div>
          </div>
          <div className="tst-menu-book-bottom">
            <div className="tst-menu-book-price">
              <div className="tst-price"><span className="tst-symbol">{item.currency}</span>{Number(item.price).toFixed(2)}</div>
            </div>
            <div className="tst-input-number-frame">
              <div className="tst-input-number-btn tst-add" onClick={(e) => handleAddToCard(e)}>+</div>
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        open={img}
        close={() => setImg(false)}
        slides={imgValue}
        styles={{ container: { backgroundColor: "rgba(26, 47, 51, .85)" } }}
        render={{
          buttonPrev: imgValue.length <= 1 ? () => null : undefined,
          buttonNext: imgValue.length <= 1 ? () => null : undefined,
        }}
      />
    </>
  )
}

export default MenuItem
