import { isElementVisible } from "./isElementVisible";

/**
 * Determine if the element is "viewable" on the screen.
 * "Viewable" is defined as being visible in the DOM and being within the confines of the viewport.
 * @param {Element} element
 * @returns {boolean} Returns `true` if the element is viewable and `false` otherwise
 */
export const isElementViewable = <TElement extends Element = Element>(element: TElement): boolean => {
  const document = element.ownerDocument.documentElement;

  // getBoundingClientRect is relative to the viewport
  const rect = element.getBoundingClientRect();
  // scrollWidth is the width of the document including any overflow
  const documentScrollWidth = document.scrollWidth;
  // scrollHeight is the height of the document including any overflow
  const documentScrollHeight = document.scrollHeight;
  // How far from the left of the viewport is the element, minus the left border width?
  const leftOffset = rect.left - document.clientLeft;
  // How far from the top of the viewport is the element, minus the top border width?
  const topOffset = rect.top - document.clientTop;

  // TODO: < 10? what does it mean?
  if (
    !isElementVisible(element) ||
    !("offsetParent" in element) ||
    !element.offsetParent ||
    element.clientWidth < 10 ||
    element.clientHeight < 10
  ) {
    return false;
  }

  const rects = element.getClientRects();

  if (!rects.length) {
    return false;
  }

  // If any of the rects have a left side that is further right than the document width or a right side that is
  // further left than the origin (i.e. is negative), we consider the element to be not viewable
  for (const rect of rects) {
    if (rect.left > documentScrollWidth || rect.right < 0) {
      return false;
    }
  }

  // If the element is further left than the document width, or further down than the document height, we know that it's not viewable
  if (leftOffset < 0 || leftOffset > documentScrollWidth || topOffset < 0 || topOffset > documentScrollHeight) {
    return false;
  }

  // Our next check is going to get the center point of the element, and then use elementFromPoint to see if the element
  // is actually returned from that point. If it is, we know that it's viewable. If it isn't, we know that it's not viewable.
  // If the right side of the bounding rectangle is outside the viewport, the x coordinate of the center point is the window width (minus offset) divided by 2.
  // If the right side of the bounding rectangle is inside the viewport, the x coordinate of the center point is the width of the bounding rectangle divided by 2.
  // If the bottom of the bounding rectangle is outside the viewport, the y coordinate of the center point is the window height (minus offset) divided by 2.
  // If the bottom side of the bounding rectangle is inside the viewport, the y coordinate of the center point is the height of the bounding rectangle divided by
  // We then use elementFromPoint to find the element at that point.
  let pointElement: ParentNode | null = element.ownerDocument.elementFromPoint(
    leftOffset + (rect.right > window.innerWidth ? (window.innerWidth - leftOffset) / 2 : rect.width / 2),
    topOffset + (rect.bottom > window.innerHeight ? (window.innerHeight - topOffset) / 2 : rect.height / 2)
  );

  while (pointElement && pointElement !== element && pointElement !== document) {
    // If the element we found is a label, and the element we're checking has labels
    if (
      "tagName" in pointElement &&
      typeof pointElement.tagName === "string" &&
      pointElement.tagName.toLowerCase() === "label" &&
      "labels" in element &&
      Array.isArray(element.labels) &&
      element.labels.length > 0
    ) {
      // Return true if the element we found is one of the labels for the element we're checking.
      // This means that the element we're looking for is considered viewable
      return element.labels.indexOf(pointElement) !== -1;
    }
    // Walk up the DOM tree to check the parent element
    pointElement = pointElement.parentNode;
  }

  // If the for loop exited because we found the element we're looking for, return true, as it's viewable
  // If the element that we found isn't the element we're looking for, it means the element we're looking for is not viewable
  return pointElement === element;
};
