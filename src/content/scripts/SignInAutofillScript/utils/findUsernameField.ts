import { Field, PageDetails } from "../../../PageDetailsCollector/types";

export type FindUsernameFieldOptions = {
  canBeReadOnly?: boolean;
  canBeHidden?: boolean;
  withoutForm?: boolean;
};

export function findUsernameField(
  pageDetails: PageDetails,
  passwordField: Field,
  options: FindUsernameFieldOptions = {}
): Field | null {
  const { canBeReadOnly = false, canBeHidden = false, withoutForm = false } = options;

  for (const field of Object.values(pageDetails.fields)) {
    if (field.index >= passwordField.index) {
      break;
    }

    if (
      !field.attrs.disabled &&
      (canBeReadOnly || !field.attrs.readonly) &&
      (withoutForm || field.formUid === passwordField.formUid) &&
      (canBeHidden || field.isViewable) &&
      (field.attrs.type === "text" || field.attrs.type === "email" || field.attrs.type === "tel")
    ) {
      return field;

      // TODO: ...
      // if (this.findMatchingFieldIndex(f, AutoFillConstants.UsernameFieldNames) > -1) {
      //   // We found an exact match. No need to keep looking.
      //   break;
      // }
    }
  }

  return null;
}
