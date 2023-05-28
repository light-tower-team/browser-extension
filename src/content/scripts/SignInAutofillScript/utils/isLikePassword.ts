import { Field } from "../../../PageDetailsCollector/types";
import { isValueLikePassword } from "./isValueLikePassword";

export function isLikePassword(field: Field): boolean {
  if (field.attrs.type !== "text") {
    return false;
  }

  return (
    isValueLikePassword(field.attrs.id) ||
    isValueLikePassword(field.attrs.name) ||
    isValueLikePassword(field.attrs.placeholder)
  );
}
