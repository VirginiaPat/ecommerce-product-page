/**
 * @fileoverview Hamburger menu module - handles open/close behavior,
 * focus managment, and focus trap for the mobile/tablet navigation menu.
 */

import { createFocusTrap } from "./focusTrap.js";

/**
 * Initializes the hamburger menu functionality
 * @returns {void}
 */
const initHamburgerMenu = () => {
  const openMenuBtn = document.getElementById("openMenuButton");
  const closeMenuBtn = document.getElementById("closeMenuBtn");
  const hamMenu = document.getElementById("hamMenu");
  const hamMenuDialog = document.getElementById("ham-menu-dialog");
  const overlay = document.getElementById("overlay");
  const mainMenu = document.getElementById("main-menu");
  const navLinks = document.querySelectorAll(".nav-link-hamburger");

  const focusTrap = createFocusTrap(hamMenuDialog);

  const header = document.querySelector("header");
  const main = document.querySelector("main");
  const footer = document.querySelector("footer");

  // guard clause
  if (
    !openMenuBtn ||
    !closeMenuBtn ||
    !hamMenu ||
    !hamMenuDialog ||
    !overlay ||
    !mainMenu ||
    !header ||
    !main ||
    !footer
  ) {
    console.error("HamburgerMenu: one or more required DOM elements not found");
    return;
  }

  /**
   * Opens the hamburger menu
   * @returns {void}
   */
  const openMenu = () => {
    hamMenu.classList.remove("hidden");
    hamMenu.classList.add("flex");
    hamMenu.setAttribute("aria-hidden", "false");
    openMenuBtn.setAttribute("aria-expanded", "true");
    header.inert = true;
    main.inert = true;
    footer.inert = true;
    focusTrap.activate();
    closeMenuBtn.focus();
  };

  /**
   * Closes hamburger menu and returns focus to the open button
   * @returns {void}
   */
  const closeMenu = () => {
    hamMenu.classList.remove("flex");
    hamMenu.classList.add("hidden");
    hamMenu.setAttribute("aria-hidden", "true");
    openMenuBtn.setAttribute("aria-expanded", "false");
    header.inert = false;
    main.inert = false;
    footer.inert = false;
    focusTrap.deactivate();
    openMenuBtn.focus();
  };

  /**
   * Closes hamburger menu when Escape key is pressed.
   * @param {KeyboardEvent} e
   * @returns {void}
   */
  const handleKeydown = (e) => {
    if (e.key === "Escape") closeMenu();
  };

  // Event Listeners--------------------->

  openMenuBtn.addEventListener("click", openMenu);
  closeMenuBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);
  document.addEventListener("keydown", handleKeydown);
  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
};

export { initHamburgerMenu };
