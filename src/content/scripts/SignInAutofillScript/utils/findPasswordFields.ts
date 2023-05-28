import { Field, PageDetails } from "../../../PageDetailsCollector/types";
import { isLikePassword } from "./isLikePassword";

export type FindPasswordFieldsOptions = {
  canBeReadOnly?: boolean;
  canBeHidden?: boolean;
  mustBeEmpty?: boolean;
  fillNewPassword?: boolean;
};

export function findPasswordFields(pageDetails: PageDetails, options: FindPasswordFieldsOptions = {}): Array<Field> {
  const { canBeReadOnly = false, canBeHidden = false, mustBeEmpty = false, fillNewPassword = false } = options;

  return Object.values(pageDetails.fields).reduce<Array<Field>>((fields, field) => {
    const isPassword = field.attrs.type === "password";

    if (
      !field.attrs.disabled &&
      (isPassword || isLikePassword(field)) &&
      (canBeReadOnly || !field.attrs.readonly) &&
      (canBeHidden || field.isViewable) &&
      (!mustBeEmpty || field.attrs.value === null || field.attrs.value.trim() === "") &&
      (fillNewPassword || field.attrs.autocomplete !== "new-password")
    ) {
      fields.push(field);
    }

    return fields;
  }, []);
}
