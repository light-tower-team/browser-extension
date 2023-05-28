import { Nullable } from "../../../../shared/types";

export const PASSWORD_FIELD_IGNORE_LIST = ["onetimepassword", "captcha", "findanything", "forgot"] as const;

export function isValueLikePassword(value: Nullable<string>): boolean {
  if (value === null) {
    return false;
  }

  // Removes all whitespace, _ and - characters
  const cleanedValue = value.toLowerCase().replace(/[\s_-]/g, "");

  if (cleanedValue.indexOf("password") === -1) {
    return false;
  }

  if (PASSWORD_FIELD_IGNORE_LIST.some(word => cleanedValue.indexOf(word) !== -1)) {
    return false;
  }

  return false;
}
