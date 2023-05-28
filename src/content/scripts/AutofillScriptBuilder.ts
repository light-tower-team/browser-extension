import { Field } from "../PageDetailsCollector/types";
import { ActionOperatorEnum, AutofillScript } from "./types";

export class AutofillScriptBuilder {
  private fillScript: AutofillScript = {
    actions: [],
  };

  public constructor() {}

  public static create(): AutofillScriptBuilder {
    return new AutofillScriptBuilder();
  }

  public clickByUid(field: Field): void {
    this.fillScript.actions.push({
      fieldUid: field.uid,
      op: ActionOperatorEnum.CLICK,
    });
  }

  public focusByUid(field: Field): void {
    this.fillScript.actions.push({
      fieldUid: field.uid,
      op: ActionOperatorEnum.FOCUS,
    });
  }

  public inputByUid(field: Field, value: string): void {
    this.fillScript.actions.push({
      fieldUid: field.uid,
      op: ActionOperatorEnum.INPUT,
      value,
    });
  }

  public fillByUid(field: Field, value: string): void {
    if (field.attrs.maxLength && value.length > field.attrs.maxLength) {
      value = value.slice(0, field.attrs.maxLength);
    }

    if (field.attrs.tagName !== "span") {
      this.clickByUid(field);
      this.focusByUid(field);
    }

    this.inputByUid(field, value);
  }

  public build(): AutofillScript {
    return this.fillScript;
  }
}
