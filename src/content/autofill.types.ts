export type Nullable<TType = unknown> = TType | null;

export type AutofillFormAttrs = {
  id: Nullable<string>;
  name: Nullable<string>;
  action: Nullable<string>;
  method: Nullable<string>;
};

export type AutofillForm = {
  uid: string;
  attrs: AutofillFormAttrs;
};

export type AutofillFieldAttrs = {
  id: Nullable<string>;
  name: Nullable<string>;
  title: Nullable<string>;
  className: Nullable<string>;
  tabIndex: Nullable<string>;
  tagName: Nullable<string>;
  rel: Nullable<string>;
  type: Nullable<string>;
  value: Nullable<string>;
  placeholder: Nullable<string>;
  autocomplete: Nullable<string>;
  checked: boolean;
  disabled: boolean;
  readonly: boolean;
  maxLength: number;
};

export type AutofillField = {
  uid: string;
  index: number;
  formUid: Nullable<string>;
  attrs: AutofillFieldAttrs;
  isVisible: boolean;
  isViewable: boolean;
};

export type AutofillFormCollection = Record<AutofillForm["uid"], AutofillForm>;
export type AutofillFieldCollection = Record<AutofillField["uid"], AutofillField>;

export type Timestamp = number;

export type AutofillPageDetails = {
  uid: string;
  title: string;
  url: string;
  documentURL: string;
  forms: AutofillFormCollection;
  fields: AutofillFieldCollection;
  collectedAt: Timestamp;
};

export enum ActionOperatorEnum {
  CLICK = "click",
  FILL = "fill",
  FOCUS = "focus",
  DELAY = "delay",
}

export type AutofillScriptAction = {
  targetUid: string;
  op: ActionOperatorEnum;
  value?: string;
};

export type AutofillScript = {
  actions: Array<AutofillScriptAction>;
};
