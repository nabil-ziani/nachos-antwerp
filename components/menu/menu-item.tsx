"use client"

import { useState, useEffect, MouseEvent } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

import { useCart } from "@/hooks/useCart"
import { CartItem, VariationGroup, VariationOption, CartItemVariation } from "@/lib/types"

const MenuItem = ({ item }: { item: CartItem }) => {
  const [img, setImg] = useState(false)
  const [imgValue, setImgValue] = useState<any>([])
  const [showVariationsModal, setShowVariationsModal] = useState(false)
  const [selectedVariations, setSelectedVariations] = useState<{ [groupTitle: string]: CartItemVariation[] }>({})
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})

  const { cartItems, cartTotal, addToCart } = useCart()

  useEffect(() => {
    const cartNumberEl = document.querySelector('.tst-cart-number')

    if (cartNumberEl) {
      const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)
      cartNumberEl.innerHTML = String(totalQuantity)
    }
  }, [cartTotal])

  const handleAddToCard = (e: MouseEvent) => {
    e.preventDefault();

    if (item.variations?.length) {
      // Initialize selected variations if not already set
      if (Object.keys(selectedVariations).length === 0) {
        const initial = item.variations.reduce((acc, group) => {
          acc[group.title] = [];
          return acc;
        }, {} as { [key: string]: CartItemVariation[] });
        setSelectedVariations(initial);
      }
      setShowVariationsModal(true)
      return
    }

    addToCart({
      ...item,
      selectedVariations: undefined
    })
  }

  const handleQuantityChange = (groupTitle: string, optionName: string, delta: number) => {
    const key = `${groupTitle}-${optionName}`
    const currentQuantity = quantities[key] || 0
    const newQuantity = Math.max(0, currentQuantity + delta)

    // Update both quantities and selectedVariations in one go
    setQuantities(prev => ({
      ...prev,
      [key]: newQuantity
    }))

    // Update selectedVariations with the new quantity
    setSelectedVariations(prev => {
      const currentSelections = prev[groupTitle] || []
      const existingIndex = currentSelections.findIndex(v => v.name === optionName)
      let newSelections = [...currentSelections]

      if (newQuantity === 0) {
        // Remove this variation if quantity is 0
        newSelections = newSelections.filter(v => v.name !== optionName)
      } else {
        if (existingIndex >= 0) {
          // Update existing variation with new quantity
          newSelections[existingIndex] = {
            name: optionName,
            quantity: newQuantity
          }
        } else {
          // Add new variation with quantity
          newSelections.push({
            name: optionName,
            quantity: newQuantity
          })
        }
      }

      return {
        ...prev,
        [groupTitle]: newSelections
      }
    })
  }

  const handleVariationSelect = (groupTitle: string, optionName: string, option: VariationOption) => {
    const group = item.variations?.find(g => g.title === groupTitle)
    if (!group) return

    if (group.type === 'single') {
      // For single select variations (like burrito fillings)
      setSelectedVariations(prev => ({
        ...prev,
        [groupTitle]: [{
          name: optionName,
          price: option.price,
          quantity: 1
        }]
      }))
    }
    // We don't need the multiple type case anymore as it's handled in handleQuantityChange
  }

  const isVariationSelected = (groupTitle: string, optionName: string) => {
    return selectedVariations[groupTitle]?.some(v => v.name === optionName) || false;
  }

  const canAddToCart = () => {
    if (!item.variations) return true;

    return item.variations.every(group => {
      if (group.required) {
        const selections = selectedVariations[group.title] || [];
        return selections.length > 0;
      }
      return true;
    });
  }

  const handleAddToCartWithVariations = () => {
    if (!canAddToCart()) return;

    console.log('handleAddToCartWithVariations - Current state:', { selectedVariations, quantities })

    // Calculate total quantity from all variations
    const totalQuantity = Object.values(selectedVariations)
      .flat()
      .reduce((total, variation) => total + (variation.quantity || 0), 0);

    console.log('handleAddToCartWithVariations - Adding to cart:', {
      totalQuantity,
      selectedVariations
    })

    addToCart({
      ...item,
      quantity: totalQuantity,
      selectedVariations
    });

    setShowVariationsModal(false);
    setSelectedVariations({});
    setQuantities({});
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
              <div className="tst-input-number-btn tst-add" onClick={handleAddToCard}>+</div>
            </div>
          </div>
        </div>
      </div>

      {/* Variations Modal */}
      <div className={`tst-popup-bg ${showVariationsModal ? "tst-active" : ""}`}>
        <div className="tst-popup-frame">
          <div className="tst-popup-body">
            <div className="tst-close-popup" onClick={() => {
              setShowVariationsModal(false);
              setSelectedVariations({});
              setQuantities({});
            }}>
              <i className="fas fa-times"></i>
            </div>
            <div className="text-center">
              <div className="tst-suptitle tst-suptitle-center"></div>
              <h4 className="tst-mb-30">{item.title}</h4>
            </div>

            {item.variations?.map((group, groupIndex) => {
              const options = Array.isArray(group.options)
                ? group.options
                : [{ name: group.title, price: 0 }]

              return (
                <div key={groupIndex} className="tst-variation-section">
                  <h5>{group.title || 'Kies je optie'}</h5>
                  {group.description && <p>{group.description}</p>}
                  <div className="tst-variations-grid">
                    {options.map((option, optionIndex) => {
                      const key = `${group.title}-${option.name}`
                      const quantity = quantities[key] || 0
                      const isSelected = group.type === 'multiple' ? quantity > 0 : isVariationSelected(group.title, option.name)

                      return (
                        <div key={optionIndex} className="tst-variation-item">
                          <button
                            className={`tst-variation-btn ${group.type === 'multiple' ? 'multi-select' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              if (group.type === 'single') {
                                // For single select variations (like burrito fillings)
                                const isCurrentlySelected = isVariationSelected(group.title, option.name);
                                if (isCurrentlySelected) {
                                  setSelectedVariations(prev => ({
                                    ...prev,
                                    [group.title]: []
                                  }));
                                } else {
                                  handleVariationSelect(group.title, option.name, option);
                                }
                              } else if (quantity === 0) {
                                // For multiple select variations (like Jarritos)
                                handleQuantityChange(group.title, option.name, 1);
                              }
                            }}
                          >
                            <span className="tst-variation-name">{option.name}</span>
                            {(option.price && option.price > 0) ? (
                              <span className="tst-price-badge">+ €{option.price.toFixed(2)}</span>
                            ) : null}
                          </button>

                          {group.type === 'multiple' && (
                            <div className="tst-quantity-controls">
                              <button
                                className="tst-quantity-btn"
                                onClick={() => handleQuantityChange(group.title, option.name, -1)}
                                disabled={quantity === 0}
                              >
                                -
                              </button>
                              <span className="tst-quantity">{quantity}</span>
                              <button
                                className="tst-quantity-btn"
                                onClick={() => handleQuantityChange(group.title, option.name, 1)}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            <div className="text-center" style={{ marginTop: '30px' }}>
              <button
                className={`tst-btn ${!canAddToCart() ? 'tst-btn-disabled' : ''}`}
                onClick={handleAddToCartWithVariations}
                disabled={!canAddToCart()}
              >
                Toevoegen aan winkelwagen
              </button>
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
