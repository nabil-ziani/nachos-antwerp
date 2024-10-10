"use client";

export const Menu = () => {
    // scrolling animation
    const menuLinks = document.querySelectorAll('.tst-menu nav li a');

    if (menuLinks !== undefined) {
        menuLinks.forEach((menuLink) => {
            menuLink.addEventListener("click", (e: any) => {
                e.preventDefault();
                let topEl = document.querySelector(e.target.getAttribute('href'));
                let topPos = 0;
                if (topEl !== null) {
                    topPos = topEl.getBoundingClientRect().top + window.scrollY - 140;
                }
                window.scrollTo({ top: topPos, behavior: 'smooth' });

                menuLinks.forEach((link: any) => {
                    link.parentNode.classList.remove('current-menu-item');
                });
                e.target.parentNode.classList.add('current-menu-item');
            });
        });
    }
}