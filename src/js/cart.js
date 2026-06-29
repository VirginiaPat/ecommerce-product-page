/**
 *@fileoverview Cart module - handles quantity picker, add to cart and cart popup behavior
 */
import { state } from "./state.js";
import { createFocusTrap } from "./focusTrap.js";

/**
 * Initializes the cart functionality
 * @returns {void}
 */

const initCart = () => {
  const increaseBtn = document.getElementById("increase-btn");
  const decreaseBtn = document.getElementById("decrease-btn");
  const quantityDisplay = document.getElementById("quantity-display");
  const addToCartBtn = document.querySelector(".add-to-cart");
  const openCartBtn = document.getElementById("openShoppingCart");
  const cartDialog = document.getElementById("shopping-cart");
  const cartBadge = document.getElementById("quantity-cart-badge");
  const emptyCartContainer = document.getElementById("empty-cart-container");
  const fullCartContainer = document.getElementById("full-cart-container");
  const cartQuantityDisplay = document.getElementById("cart-quantity");
  const totalPriceDisplay = document.getElementById("total-price");
  const deleteBtn = document.getElementById("delete-button");
  const checkoutBtn = document.getElementById("checkout-button");

  // guard clause
  if (
    !increaseBtn ||
    !decreaseBtn ||
    !quantityDisplay ||
    !addToCartBtn ||
    !openCartBtn ||
    !cartDialog ||
    !cartBadge ||
    !emptyCartContainer ||
    !fullCartContainer ||
    !cartQuantityDisplay ||
    !totalPriceDisplay ||
    !deleteBtn ||
    !checkoutBtn
  ) {
    console.error("Cart: one or more required DOM elements not found");
    return;
  }

  const PRODUCT_PRICE = 125.0;

  /**
   * Updates the quantity display in the picker
   * @returns {void}
   */
  const updateQuantityDisplay = () => {
    quantityDisplay.textContent = state.quantity;
    decreaseBtn.disabled = state.quantity === 0;
  };

  /**
   * Updates the cart badge on the cart icon
   * @returns {void}
   */
  const updateCartBadge = () => {
    const hasItems = state.cartItems.length > 0;
    const quantity = hasItems ? state.cartItems[0].quantity : 0;

    cartBadge.classList.toggle("hidden", !hasItems);
    cartBadge.classList.toggle("flex", hasItems);
    cartBadge.textContent = quantity;
  };

  /**
   * Opens the cart popup
   * @returns {void}
   */
  const openCart = () => {
    cartDialog.classList.remove("hidden");
    cartDialog.setAttribute("aria-hidden", "false");
    openCartBtn.setAttribute("aria-expanded", "true");
  };

  /**
   * Closes the cart popup
   * @returns {void}
   */
  const closeCart = () => {
    cartDialog.classList.add("hidden");
    cartDialog.setAttribute("aria-hidden", "true");
    openCartBtn.setAttribute("aria-expanded", "false");

    openCartBtn.focus();
  };

  /**
   * Updates the cart popup contents based on the current cart state
   * @returns {void}
   */
  const updateCartDisplay = () => {
    const hasItems = state.cartItems.length > 0;

    emptyCartContainer.classList.toggle("hidden", hasItems);
    emptyCartContainer.classList.toggle("flex", !hasItems);
    fullCartContainer.classList.toggle("hidden", !hasItems);
    fullCartContainer.classList.toggle("flex", hasItems);

    if (hasItems) {
      const quantity = state.cartItems[0].quantity;
      const total = (quantity * PRODUCT_PRICE).toFixed(2);
      cartQuantityDisplay.textContent = quantity;
      totalPriceDisplay.textContent = `$${total}`;
    }
  };

  /**
   *Handles clicking outside the cart to close it.
   * @param {MouseEvent} e
   * @returns {void}
   */
  const handleOutsideClick = (e) => {
    if (cartDialog.getAttribute("aria-hidden") === "true") return;
    if (cartDialog.contains(e.target)) return;
    if (openCartBtn.contains(e.target)) return;
    closeCart();
  };

  /**
   * Handles keydown event for closing the cart with Escape
   * @param {KeyboardEvent} e
   */
  const handleKeydown = (e) => {
    if (e.key === "Escape") {
      closeCart();
    }
  };

  // Event Listeners--------------------->

  increaseBtn.addEventListener("click", () => {
    state.quantity++;
    updateQuantityDisplay();
  });

  decreaseBtn.addEventListener("click", () => {
    if (state.quantity > 0) {
      state.quantity--;
      updateQuantityDisplay();
    }
  });

  addToCartBtn.addEventListener("click", () => {
    if (state.quantity === 0) return;

    state.cartItems = [{ quantity: state.quantity }];
    updateCartBadge();
    state.quantity = 0;
    updateQuantityDisplay();
    updateCartDisplay();
    openCartBtn.focus();
  });

  openCartBtn.addEventListener("click", () => {
    const isOpen = cartDialog.getAttribute("aria-hidden") === "false";

    if (isOpen) {
      closeCart();
    } else {
      openCart();
      updateQuantityDisplay();
      updateCartDisplay();
      const firstFocusable = cartDialog.querySelector(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (firstFocusable) firstFocusable.focus();
    }
  });

  deleteBtn.addEventListener("click", () => {
    state.cartItems = [];
    updateCartDisplay();
    updateCartBadge();
  });

  checkoutBtn.addEventListener("click", () => {
    state.cartItems = [];
    updateCartDisplay();
    updateCartBadge();
    closeCart();
  });

  document.addEventListener("mousedown", handleOutsideClick);
  document.addEventListener("keydown", handleKeydown);

  //initialize
  updateQuantityDisplay();
  updateCartDisplay();
};

export { initCart };
