/**
 *@fileoverview Entry point - Initialize all modules when DOM is ready
 */

import { initHamburgerMenu } from "./hamburger.js";
import { initMobileCarousel, initDesktopCarousel } from "./carousel.js";
import { initLightbox } from "./lightbox.js";
import { initCart } from "./cart.js";

const init = () => {
  initHamburgerMenu();
  initMobileCarousel();
  const lightboxControls = initLightbox();
  initDesktopCarousel(lightboxControls.openLightbox);
  initCart();
};

document.addEventListener("DOMContentLoaded", init);
