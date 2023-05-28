import { FieldBuffer } from "../PageDetailsCollector/types";
import { ActionOperatorEnum, AutofillScript } from "../scripts/types";

export class AutofillScriptExecuteEngine {
  public constructor(private readonly fieldsBuffer: FieldBuffer) {}

  public execute(fillScript: AutofillScript): void {
    for (const action of fillScript.actions) {
      setTimeout(() => {
        switch (action.op) {
          case ActionOperatorEnum.CLICK: {
            const [_, element] = this.fieldsBuffer[action.fieldUid] ?? [];

            if (element && "click" in element && typeof element.click === "function") {
              element.click();
            }
            break;
          }
          case ActionOperatorEnum.FOCUS: {
            const [_, element] = this.fieldsBuffer[action.fieldUid] ?? [];

            if (element && "focus" in element && typeof element.focus === "function") {
              element.focus();
            }
            break;
          }
          case ActionOperatorEnum.INPUT: {
            const [, element] = this.fieldsBuffer[action.fieldUid] ?? [];

            element.dispatchEvent(
              new Event("keydown", {
                bubbles: true,
                cancelable: false,
              })
            );

            element.dispatchEvent(
              new Event("keypress", {
                bubbles: true,
                cancelable: false,
              })
            );

            element.dispatchEvent(
              new Event("keyup", {
                bubbles: true,
                cancelable: false,
              })
            );

            if ("value" in element && typeof element.value === "string") {
              element.value = action.value;
            }

            element.dispatchEvent(
              new Event("keydown", {
                bubbles: true,
                cancelable: false,
              })
            );

            element.dispatchEvent(
              new Event("keypress", {
                bubbles: true,
                cancelable: false,
              })
            );

            element.dispatchEvent(
              new Event("keyup", {
                bubbles: true,
                cancelable: false,
              })
            );

            element.dispatchEvent(
              new Event("input", {
                bubbles: true,
                cancelable: true,
              })
            );

            element.dispatchEvent(
              new Event("change", {
                bubbles: true,
                cancelable: true,
              })
            );

            element.dispatchEvent(
              new Event("blur", {
                bubbles: true,
                cancelable: false,
              })
            );

            element.blur();

            if ("value" in element && typeof element.value === "string") {
              element.value = action.value;
            }

            break;
          }
        }
      }, 1);
    }
  }
}
