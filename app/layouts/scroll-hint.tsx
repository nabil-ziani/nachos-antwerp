"use client"

import { MouseEvent } from "react"

const ScrollHint = () => {
    const scrollToSection = (e: MouseEvent) => {
        let topEl = document.querySelector<HTMLElement>('#tst-dynamic-content')

        if (topEl) {
            let topPos = topEl.offsetTop - 140

            window.scrollTo({ top: topPos, behavior: 'smooth' })
            e.preventDefault()
        }
    }

    return (
        <>
            {/* scroll hint */}
            <div className="container">
                <a href="#tst-dynamic-content" className="tst-scroll-hint-frame tst-anchor-scroll" onClick={(e) => scrollToSection(e)}>
                    <div className="tst-scroll-hint"></div>
                </a>
            </div>
            {/* scroll hint end */}
        </>
    )
}

export default ScrollHint