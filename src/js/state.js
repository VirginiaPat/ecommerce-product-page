/**
 *@fileoverview Shared application state across modules
 */

/**
 * @type {{mobileCarouselIndex:number,currentImageIndex:number, quantity:number, cartItems:Array}}
 */
const state = {
  mobileCarouselIndex: 0,
  currentImageIndex: 0,
  quantity: 0,
  cartItems: [],
};

export { state };
