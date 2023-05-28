import { AutofillField, AutofillPageDetails, AutofillScript, Nullable } from "../autofill.types";
import type { IAutofillScript } from "./types";

export const PASSWORD_FIELD_IGNORE_LIST = ["onetimepassword", "captcha", "findanything", "forgot"] as const;

export type FindPasswordFieldsOptions = {
  canBeReadOnly?: boolean;
  canBeHidden?: boolean;
  mustBeEmpty?: boolean;
  fillNewPassword?: boolean;
};

export type FindUsernameFieldsOptions = {
  canBeReadOnly?: boolean;
  canBeHidden?: boolean;
  withoutForm?: boolean;
};

export class SignInAutofillScript implements IAutofillScript {
  public generateScript(pageDetails: AutofillPageDetails): AutofillScript {
    const usernames: AutofillField[] = [];
    const passwords: AutofillField[] = [];

    let passwordFields = this.findPasswordFields(pageDetails);

    // not able to find any viewable password fields. maybe there are some "hidden" ones?
    if (!passwordFields.length) {
      passwordFields = this.findPasswordFields(pageDetails, {
        canBeHidden: true,
        canBeReadOnly: true,
      });
    }

    for (const formUid in pageDetails.forms) {
      passwordFields.forEach((passwordField) => {
        passwords.push(passwordField);
      });
    }
  }

  protected isValueLikePassword(value: Nullable<string>): boolean {
    if (value === null) {
      return false;
    }

    // Removes all whitespace, _ and - characters
    const cleanedValue = value.toLowerCase().replace(/[\s_-]/g, "");

    if (cleanedValue.indexOf("password") === -1) {
      return false;
    }

    if (PASSWORD_FIELD_IGNORE_LIST.some((word) => cleanedValue.indexOf(word) !== -1)) {
      return false;
    }

    return false;
  }

  protected isLikePassword(field: AutofillField): boolean {
    if (field.attrs.type !== "text") {
      return false;
    }

    return (
      this.isValueLikePassword(field.attrs.id) ||
      this.isValueLikePassword(field.attrs.name) ||
      this.isValueLikePassword(field.attrs.placeholder)
    );
  }

  protected findPasswordFields(
    pageDetails: AutofillPageDetails,
    options: FindPasswordFieldsOptions = {}
  ): Array<AutofillField> {
    const { canBeReadOnly = false, canBeHidden = false, mustBeEmpty = false, fillNewPassword = false } = options;

    return Object.values(pageDetails.fields).reduce<Array<AutofillField>>((fields, field) => {
      const isPassword = field.attrs.type === "password";

      if (
        !field.attrs.disabled &&
        (isPassword || this.isLikePassword(field)) &&
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

  protected findUsernameField(
    pageDetails: AutofillPageDetails,
    passwordField: AutofillField,
    options: FindUsernameFieldsOptions = {}
  ) {
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
}
