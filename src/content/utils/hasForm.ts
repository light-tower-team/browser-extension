type FormElement<TElement extends Element = Element> = { form: HTMLFormElement } & TElement;

export const hasForm = <TElement extends Element = Element>(el: TElement): el is FormElement<TElement> => {
  return "form" in el;
};
