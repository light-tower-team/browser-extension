export function query<TElement extends Element = Element>(document: Document, selector: string): Array<TElement> {
  try {
    return Array.from(document.querySelectorAll<TElement>(selector));
  } catch (e) {
    console.error(e);
  }

  return [];
}
