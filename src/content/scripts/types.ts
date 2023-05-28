import { PageDetails } from "../PageDetailsCollector/types";

export enum ActionOperatorEnum {
  CLICK = "click",
  FOCUS = "focus",
  INPUT = "input",
  DELAY = "delay",
}

export type ClickScriptAction = {
  fieldUid: string;
  op: ActionOperatorEnum.CLICK;
};

export type FocusScriptAction = {
  fieldUid: string;
  op: ActionOperatorEnum.FOCUS;
};

export type InputScriptAction = {
  fieldUid: string;
  op: ActionOperatorEnum.INPUT;
  value: string;
};

export type AutofillScriptAction = ClickScriptAction | FocusScriptAction | InputScriptAction;

export type AutofillScript = {
  actions: Array<AutofillScriptAction>;
};

export interface IAutofillScriptGenerator<TData> {
  generateScript(pageDetails: PageDetails, data: TData): AutofillScript;
}
