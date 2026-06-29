/**
 * @fileoverview Reusable focus trap utility for modal dialogs.
 */

/**
 * @type {string} CSS selector string targeting all focusable elements
 */
const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Creates a focus trap inside a given container element
 * If containerEl is null or undefined, returns a no-op object with empty activate and deactivate functions to prevent runtime errors.
 * @param {HTMLElement} containerEl - The container element to trap focus within
 * @returns {{ activate:()=>void, deactivate:()=>void }}
 */

const createFocusTrap = (containerEl) => {
  if (!containerEl) {
    console.error("FocusTrap: containerEl is required");
    return { activate: () => {}, deactivate: () => {} };
  }

  /**
   * Returns all focusable elements inside the container.
   * Called on each keydown to account for dynamic DOM changes
   * @returns {HTMLElement[]}
   */
  const getFocusableElements = () =>
    Array.from(containerEl.querySelectorAll(FOCUSABLE_SELECTORS));

  /**
   * Handles Tab and Shift+Tab keydown events to keep focus within the container
   * @param {KeyboardEvent} e
   */
  const handleKeydown = (e) => {
    if (e.key !== "Tab") return;

    const focusableEls = getFocusableElements();

    if (focusableEls.length === 0) return;

    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      }
    } else {
      if (document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  };

  /**
     *Activates the focus trap by adding the keydown event listener
     @returns {void}
     */
  const activate = () => {
    containerEl.addEventListener("keydown", handleKeydown);
  };

  /**
   * Deactivates the focus trap by removing the keydown event listener
   */
  const deactivate = () => {
    containerEl.removeEventListener("keydown", handleKeydown);
  };

  return { activate, deactivate };
};

export { createFocusTrap };
