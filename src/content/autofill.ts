import {
  AutofillForm,
  AutofillFormCollection,
  AutofillFormField,
  AutofillFormFieldCollection,
  AutofillPageDetails,
} from "./autofill.types";
import { getElementAttrValue } from "./utils/getElementAttrValue";
import { getFromElements } from "./utils/getFormElements";
import { hasForm } from "./utils/hasForm";
import { isElementViewable } from "./utils/isElementViewable";
import { isElementVisible } from "./utils/isElementVisible";
import { query } from "./utils/query";

const DEFAULT_FORM_FIELD_MAX_LENGTH = 999;

const collectPageDetails = () => {
  const view = document.defaultView ?? window;

  // getting all exists forms
  const forms = query<HTMLFormElement>(document, "form").map((formElement, index) => {
    const uid = `__form__${index}`;
    const id = getElementAttrValue(formElement, "id");
    const name = getElementAttrValue(formElement, "name");
    const method = getElementAttrValue(formElement, "method");

    let action = getElementAttrValue(formElement, "action");
    action = action ? new URL(action, window.location.href).href : null;

    const form: AutofillForm = {
      uid,
      attrs: {
        id,
        name,
        action,
        method,
      },
    };

    formElement.uid = uid;

    return form;
  });

  // getting all exists form fields
  const formFields = getFromElements(document).map((formFieldElement, index) => {
    const uid = `__form_field_${index}`;

    const id = getElementAttrValue(formFieldElement, "id");
    const name = getElementAttrValue(formFieldElement, "name");
    const title = getElementAttrValue(formFieldElement, "title");
    const className = getElementAttrValue(formFieldElement, "class");
    const tabIndex = getElementAttrValue(formFieldElement, "tabindex");
    const tagName = getElementAttrValue(formFieldElement, "tagName")?.toLowerCase() ?? null;

    const rel = getElementAttrValue(formFieldElement, "rel");
    const type = getElementAttrValue(formFieldElement, "type");
    const value = getElementAttrValue(formFieldElement, "value");
    const checked = !!getElementAttrValue(formFieldElement, "checked");
    const autocomplete = getElementAttrValue(formFieldElement, "autocomplete");

    const maxLength =
      "maxLength" in formFieldElement &&
      typeof formFieldElement.maxLength === "number" &&
      formFieldElement.maxLength !== -1
        ? formFieldElement.maxLength
        : DEFAULT_FORM_FIELD_MAX_LENGTH;

    const isVisible = isElementVisible(formFieldElement);
    const isViewable = isElementViewable(formFieldElement);

    const formUid = hasForm(formFieldElement) ? getElementAttrValue(formFieldElement.form, "uid") : null;

    const formField: AutofillFormField = {
      uid,
      formUid,
      attrs: {
        id,
        name,
        title,
        className,
        tabIndex,
        tagName,
        maxLength,
        rel,
        type,
        value,
        checked,
        autocomplete,
      },
      isVisible,
      isViewable,
    };

    formFieldElement.uid = uid;

    return formField;
  });

  const pageDetails: AutofillPageDetails = {
    uid: "doc",
    title: document.title,
    url: view.location.href,
    documentURL: document.location.href,
    forms: forms.reduce<AutofillFormCollection>((collection, form) => {
      collection[form.uid] = form;
      return collection;
    }, {}),
    fields: formFields.reduce<AutofillFormFieldCollection>((collection, field) => {
      collection[field.uid] = field;
      return collection;
    }, {}),
    collectedAt: Date.now(),
  };

  return pageDetails;
};

collectPageDetails();
