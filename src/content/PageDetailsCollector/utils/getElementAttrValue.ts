import { isAttrName } from "./isAttrName";

/**
 * For a given element `el`, returns the value of the attribute `attrName`.
 * @param {Element} el
 * @param {string} attrName
 * @returns {string | null} The value of the attribute
 */
export function getElementAttrValue<TElement extends Element = Element>(
  el: TElement,
  attrName: keyof TElement | string
): string | null;
export function getElementAttrValue<TElement extends Element = Element, TValue = string | null>(
  el: TElement,
  attrName: keyof TElement | string,
  parse?: (value: string | null) => TValue
): TValue;
export function getElementAttrValue<TElement extends Element = Element, TValue = string | null>(
  el: TElement,
  attrName: keyof TElement | string,
  parse?: (value: string | null) => TValue
): TValue | string | null {
  let attrValue: string | null = null;

  if (isAttrName(el, attrName)) {
    const attrVal = el[attrName];

    if (typeof attrVal === "string" && attrVal.length > 0) {
      attrValue = attrVal;
    }
  } else {
    attrValue = typeof attrName === "string" ? el.getAttribute(attrName) : null;
  }

  attrValue = attrValue && attrValue.length > 0 ? attrValue : null;

  return parse ? parse(attrValue) : attrValue;
}
