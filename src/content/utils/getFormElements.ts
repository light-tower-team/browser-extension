import { query } from "./query";

export type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLSpanElement;

export const getFromElements = (document: Document, limit = 50): Array<FormElement> => {
  const foundElements = query<FormElement>(
    document,
    "input" +
      ':not([type="hidden"])' +
      ':not([type="submit"])' +
      ':not([type="reset"])' +
      ':not([type="button"])' +
      ':not([type="image"])' +
      ':not([type="file"])' +
      ":not([data-bwignore]), " +
      "select, " +
      " textarea," +
      "span[data-bwautofill] "
  );

  if (!limit || foundElements.length <= limit) {
    return foundElements;
  }

  const passedElements: Array<Element> = [];
  const unimportantElements: Array<Element> = [];

  for (const foundElement of foundElements) {
    if (passedElements.length >= limit) {
      break;
    }

    const type =
      "type" in foundElement && typeof foundElement.type === "string" ? foundElement.type.toLowerCase() : null;

    if (type === "checkbox" || type === "radio") {
      unimportantElements.push(foundElement);
    } else {
      passedElements.push(foundElement);
    }
  }

  const unimportantElementCanBeAddedCount = limit - passedElements.length;

  if (unimportantElementCanBeAddedCount > 0) {
    passedElements.push(...unimportantElements.slice(0, unimportantElementCanBeAddedCount));
  }

  return foundElements;
};
