/**
 * @fileoverview Lightbox module - handles open/close behavior, image navigatiob and focus managment for the product image lightbox
 */

import { state } from "./state.js";
import { createFocusTrap } from "./focusTrap.js";

/**
 * Initializes the lightbox functionality
 * @returns {void}
 */
const initLightbox = () => {
  const lightbox = document.getElementById("lightbox");
  const track = document.getElementById("carousel-track-lightbox");
  const prevBtn = document.getElementById("lightbox-carousel-prev");
  const nextBtn = document.getElementById("lightbox-carousel-next");
  const closeBtn = document.getElementById("closeLightboxBtn");
  const slideBtns = Array.from(
    document.querySelectorAll("#carousel-track-desktop button"),
  );
  const slides = Array.from(track.querySelectorAll(".carousel-slide"));
  const thumbnailBtns = Array.from(
    document.querySelectorAll('[id^="lightbox-thumbnail-"]'),
  );
  const thumbnailOverlays = thumbnailBtns.map((btn) =>
    btn.querySelector(".thumbnail-btn-overlay"),
  );

  const totalSlides = slides.length;

  const focusTrap = createFocusTrap(lightbox);

  /**
   * Updates the visible slide based on the current image index
   * @returns {void}
   */
  const updateCarousel = () => {
    slides.forEach((slide, index) => {
      slide.classList.toggle("hidden", index !== state.currentImageIndex);
    });

    prevBtn.disabled = state.currentImageIndex === 0;
    nextBtn.disabled = state.currentImageIndex === totalSlides - 1;
  };

  /**
   * Updates the active thumbnail overlay
   * @returns {void}
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

  const openLightbox = () => {
    lightbox.classList.remove("hidden");
    lightbox.classList.add("flex");
    lightbox.setAttribute("aria-hidden", "false");
    updateCarousel();
    updateThumbnails();
    focusTrap.activate();
    closeBtn.focus();
  };

  /**
   * Closes the lightbox and returns focus to the active desktop slide button.
   * @returns {void}
   */
  const closeLightbox = () => {
    lightbox.classList.remove("flex");
    lightbox.classList.add("hidden");
    lightbox.setAttribute("aria-hidden", "true");
    focusTrap.deactivate();
    slideBtns[state.currentImageIndex].focus();
  };

  /**
   * Closes the lightbox when clicking on the overlay (outside the content)
   * @param {MouseEvent} e
   * @returns {void}
   */
  const handleOverlayclick = (e) => {
    if (e.target === lightbox) closeLightbox();
  };

  /**
   * Closes the lightbox when Escape key is pressed
   * @param {KeyboardEvent} e
   * @returns {void}
   */
  const handleKeydown = (e) => {
    if (e.key === "Escape") closeLightbox();
  };

  // Event Listeners--------------------->

  prevBtn.addEventListener("click", () =>
    goToSlide(state.currentImageIndex - 1),
  );
  nextBtn.addEventListener("click", () =>
    goToSlide(state.currentImageIndex + 1),
  );
  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", handleOverlayclick);
  document.addEventListener("keydown", handleKeydown);

  thumbnailBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => goToSlide(index));
  });

  return { openLightbox };
};

export { initLightbox };
