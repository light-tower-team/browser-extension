export function isAttrName<TElement extends Element = Element>(
  el: TElement,
  attrName: unknown
): attrName is keyof TElement {
  return typeof attrName === "string" && attrName in el;
}
