import { fromCollection } from "../../../shared/utils/fromCollection";
import { Field, PageDetails } from "../../PageDetailsCollector/types";
import { AutofillScriptBuilder } from "../AutofillScriptBuilder";
import type { AutofillScript, IAutofillScriptGenerator } from "../types";
import { findUsernameField } from "./utils";
import { findPasswordFields } from "./utils/findPasswordFields";

export type SignInData = {
  username: string;
  password: string;
};

export class SignInAutofillScriptGenerator implements IAutofillScriptGenerator<SignInData> {
  public generateScript(pageDetails: PageDetails, data: SignInData): AutofillScript {
    const fillScriptBuilder = new AutofillScriptBuilder();

    const usernames: Field[] = [];
    const passwords: Field[] = [];

    let passwordFields = findPasswordFields(pageDetails);

    // not able to find any viewable password fields. maybe there are some "hidden" ones?
    if (!passwordFields.length) {
      passwordFields = findPasswordFields(pageDetails, {
        canBeHidden: true,
        canBeReadOnly: true,
      });
    }

    for (const formUid in pageDetails.forms) {
      passwordFields.forEach(passwordField => {
        if (passwordField.formUid && passwordField.formUid !== formUid) {
          return;
        }

        passwords.push(passwordField);

        let username = findUsernameField(pageDetails, passwordField);

        if (!username) {
          // not able to find any viewable username fields. maybe there are some "hidden" ones?
          username = findUsernameField(pageDetails, passwordField, {
            canBeHidden: true,
            canBeReadOnly: true,
          });
        }

        if (username) {
          usernames.push(username);
        }
      });
    }

    // The page does not have any forms with password fields. Use the first password field on the page and the
    // input field just before it as the username.
    if (passwordFields.length && !passwords.length) {
      const firstPasswordField = passwordFields[0];
      passwords.push(firstPasswordField);

      if (firstPasswordField.index > 0) {
        let username = findUsernameField(pageDetails, firstPasswordField);

        if (!username) {
          // not able to find any viewable username fields. maybe there are some "hidden" ones?
          username = findUsernameField(pageDetails, firstPasswordField, {
            canBeHidden: true,
            canBeReadOnly: true,
          });
        }

        if (username) {
          usernames.push(username);
        }
      }
    }

    // No password fields on this page. Let's try to just fuzzy fill the username.
    if (!passwordFields.length) {
      fromCollection(pageDetails.fields).forEach(field => {
        if (
          field.isViewable &&
          (field.attrs.type === "text" || field.attrs.type === "email" || field.attrs.type === "tel")
        ) {
          usernames.push(field);
        }
      });
    }

    const filledFields: Record<Field["uid"], Field> = {};

    usernames.forEach(field => {
      if (field.uid in filledFields) {
        return;
      }

      filledFields[field.uid] = field;
      fillScriptBuilder.fillByUid(field, data.username);
    });

    passwords.forEach(field => {
      if (field.uid in filledFields) {
        return;
      }

      filledFields[field.uid] = field;
      fillScriptBuilder.fillByUid(field, data.password);
    });

    let lastField: Field | null = null;
    let lastPasswordField: Field | null = null;

    for (const uid in filledFields) {
      if (uid in filledFields && filledFields[uid].isViewable) {
        lastField = filledFields[uid];

        if (filledFields[uid].attrs.type === "password") {
          lastPasswordField = filledFields[uid];
        }
      }
    }

    // Prioritize password field over others.
    if (lastPasswordField) {
      fillScriptBuilder.focusByUid(lastPasswordField);
    } else if (lastField) {
      fillScriptBuilder.focusByUid(lastField);
    }

    return fillScriptBuilder.build();
  }
}
