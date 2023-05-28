import { isAttrName } from "./isAttrName";

/**
 * For a given element `el`, returns the value of the attribute `attrName`.
 * @param {Element} el
 * @param {string} attrName
 * @returns {string | null} The value of the attribute
 */
export const getElementAttrValue = <TElement extends Element = Element>(
  el: TElement,
  attrName: keyof TElement | string
): string | null => {
  if (isAttrName(el, attrName)) {
    const attrValue = el[attrName];

    if (typeof attrValue === "string" && attrValue.length > 0) {
      return attrValue;
    }
  }

  const attrValue = typeof attrName === "string" ? el.getAttribute(attrName) : null;

  return attrValue && attrValue.length > 0 ? attrValue : null;
};
