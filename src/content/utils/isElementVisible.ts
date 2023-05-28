/**
 * Determine if the element is visible.
 * Visible is define as not having `display: none` or `visibility: hidden`.
 * @param {Element} element
 * @returns {boolean} Returns `true` if the element is visible and `false` otherwise
 */
export const isElementVisible = <TElement extends Element = Element>(element: TElement): boolean => {
  let currentElement: ParentNode | null = element;
  let currentElementStyle: CSSStyleDeclaration;

  while (currentElement && currentElement !== document) {
    currentElementStyle = window.getComputedStyle(element);

    if (currentElementStyle.display === "none" || currentElementStyle.visibility === "hidden") {
      return false;
    }

    currentElement = currentElement.parentNode;
  }

  return true;
};
