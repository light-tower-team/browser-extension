import { toCollection } from "../../shared/utils/toCollection";
import type { Field, Form, PageDetails } from "./types";
import {
  createDocumentUid,
  createFieldUid,
  createFormUid,
  findFields,
  getElementAttrValue,
  hasForm,
  isElementViewable,
  isElementVisible,
  query,
} from "./utils";

const DEFAULT_FIELD_MAX_LENGTH = 999;

export class PageDetailsCollector {
  public collect(document: Document): PageDetails {
    const view = document.defaultView ?? window;

    const forms = this.findForms(document);

    const fields = this.findFields(document);

    const pageDetails: PageDetails = {
      uid: createDocumentUid(),
      title: document.title,
      url: view.location.href,
      documentURL: document.location.href,
      forms: toCollection<Form, "uid">(forms, form => form.uid),
      fields: toCollection<Field, "uid">(fields, field => field.uid),
      collectedAt: Date.now(),
    };

    return pageDetails;
  }

  /**
   * Getting all exists the page forms
   * @param {Document} document
   * @returns {Form[]}
   */
  protected findForms(document: Document): Form[] {
    return query<HTMLFormElement>(document, "form").map(formElement => {
      const uid = createFormUid();
      const id = getElementAttrValue(formElement, "id");
      const name = getElementAttrValue(formElement, "name");
      const method = getElementAttrValue(formElement, "method");

      let action = getElementAttrValue(formElement, "action");
      action = action ? new URL(action, window.location.href).href : null;

      const form: Form = {
        uid,
        attrs: {
          id,
          name,
          action,
          method,
        },
      };

      Object.defineProperty(formElement, "uid", { get: () => uid });

      return form;
    });
  }

  /**
   * Getting all exists the page fields
   * @param {Document} document
   * @returns {Field[]}
   */
  protected findFields(document: Document): Field[] {
    return findFields(document).map((fieldElement, index) => {
      const uid = createFieldUid();

      const id = getElementAttrValue(fieldElement, "id");
      const name = getElementAttrValue(fieldElement, "name");
      const title = getElementAttrValue(fieldElement, "title");
      const className = getElementAttrValue(fieldElement, "class");
      const tabIndex = getElementAttrValue(fieldElement, "tabindex");
      const tagName = getElementAttrValue(fieldElement, "tagName", val => val?.toLowerCase() ?? null);

      const rel = getElementAttrValue(fieldElement, "rel");
      const type = getElementAttrValue(fieldElement, "type");
      const value = getElementAttrValue(fieldElement, "value");
      const placeholder = getElementAttrValue(fieldElement, "placeholder");
      const checked = getElementAttrValue(fieldElement, "checked", Boolean);
      const disabled = getElementAttrValue(fieldElement, "disabled", Boolean);
      const readonly = getElementAttrValue(fieldElement, "readonly", Boolean);
      const autocomplete = getElementAttrValue(fieldElement, "autocomplete", val => val ?? "off");

      const maxLength =
        "maxLength" in fieldElement && typeof fieldElement.maxLength === "number" && fieldElement.maxLength !== -1
          ? fieldElement.maxLength
          : DEFAULT_FIELD_MAX_LENGTH;

      const isVisible = isElementVisible(fieldElement);
      const isViewable = isElementViewable(fieldElement);

      const formUid = hasForm(fieldElement) ? getElementAttrValue(fieldElement.form, "uid") : null;

      const field: Field = {
        uid,
        index,
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
          disabled,
          readonly,
          placeholder,
        },
        isVisible,
        isViewable,
      };

      Object.defineProperty(fieldElement, "uid", { get: () => uid });

      return field;
    });
  }
}
