/**
 * @fileoverview Carousel module - handles mobile and desktop carousel behavior.
 */

import { state } from "./state.js";
/**
 * Initializes the mobile / tablet carousel.
 * @returns {void}
 */
const initMobileCarousel = () => {
  const track = document.getElementById("carousel-track-mobile");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const slides = Array.from(track.querySelectorAll(".carousel-slide"));
  const totalSlides = slides.length;

  // guard clause
  if (!track || !prevBtn || !nextBtn) {
    console.error(
      "MobileCarousel: one or more required DOM elements not found",
    );
    return;
  }

  /**
   * Updates the carousel position and the button states based on the current index
   *  @returns {void}
   */
  const updateCarousel = () => {
    track.style.transform = `translateX(-${state.mobileCarouselIndex * 100}%)`;
    prevBtn.disabled = state.mobileCarouselIndex === 0;
    nextBtn.disabled = state.mobileCarouselIndex === totalSlides - 1;
  };

  /**
   * Navigates to the previous slide
   * @returns {void}
   */
  const goToPrev = () => {
    if (state.mobileCarouselIndex > 0) {
      state.mobileCarouselIndex--;
      updateCarousel();
    }
  };

  /**
   * Navigates to the next slide
   */
  const goToNext = () => {
    if (state.mobileCarouselIndex < totalSlides - 1) {
      state.mobileCarouselIndex++;
      updateCarousel();
    }
  };

  prevBtn.addEventListener("click", goToPrev);
  nextBtn.addEventListener("click", goToNext);

  updateCarousel();
};

/**
 * Initializes the desktop carousel with thumbnail navigation and lightbox trigger
 * @returns {void}
 */
const initDesktopCarousel = (openLightbox) => {
  const track = document.getElementById("carousel-track-desktop");
  const thumbnailBtns = Array.from(
    document.querySelectorAll("[id^='show-thumbnail-']"),
  );
  const thumbnailOverlays = thumbnailBtns.map((btn) =>
    btn.querySelector(".thumbnail-btn-overlay"),
  );
  const slideBtns = Array.from(track.querySelectorAll("button"));
  const carouselOuter = document.getElementById("product-carousel-desktop");

  // guard clause
  if (!track || typeof openLightbox !== "function") {
    console.error(
      "DesktopCarousel: one or more required DOM elements not found",
    );
    return;
  }

  /**
   * Updates the visible slide based on the current image index
   * @returns {void}
   */
  const updateCarousel = () => {
    slideBtns.forEach((btn, index) => {
      btn.classList.toggle("hidden", index !== state.currentImageIndex);
    });
  };

  /**
   * Updates the active thumbnail overlay
   */
  const updateThumbnails = () => {
    thumbnailOverlays.forEach((overlay) => {
      overlay.classList.remove("thumbnail-active");
    });

    thumbnailOverlays[state.currentImageIndex].classList.add(
      "thumbnail-active",
    );
  };

  /**
   * Navigates to a specific slide by index
   * @param {number} index - The index of the slide to navigate to
   * @returns {void}
   */
  const goToSlide = (index) => {
    state.currentImageIndex = index;
    updateCarousel();
    updateThumbnails();
  };

  // Event Listeners--------------------->

  thumbnailBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => goToSlide(index));
  });

  slideBtns.forEach((btn) => {
    btn.addEventListener("focus", () => {
      carouselOuter.classList.add("ring-3", "ring-green-focus");
    });
    btn.addEventListener("blur", () => {
      carouselOuter.classList.remove("ring-3", "ring-green-focus");
    });
  });

  slideBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const imageIndex = parseInt(btn.dataset.imageIndex, 10) - 1;
      goToSlide(imageIndex);
      openLightbox();
    });
  });

  // initialize
  updateCarousel();
  updateThumbnails();
};

export { initMobileCarousel, initDesktopCarousel };
