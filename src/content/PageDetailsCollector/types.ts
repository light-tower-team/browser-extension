import { Nullable } from "../../shared/types";

export type FormAttrs = {
  id: Nullable<string>;
  name: Nullable<string>;
  action: Nullable<string>;
  method: Nullable<string>;
};

export type Form = {
  uid: string;
  attrs: FormAttrs;
};

export type FieldAttrs = {
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

export type Field = {
  uid: string;
  index: number;
  formUid: Nullable<string>;
  attrs: FieldAttrs;
  isVisible: boolean;
  isViewable: boolean;
};

export type FormCollection = Record<Form["uid"], Form>;
export type FieldCollection = Record<Field["uid"], Field>;

export type Timestamp = number;

export type PageDetails = {
  uid: string;
  title: string;
  url: string;
  documentURL: string;
  forms: FormCollection;
  fields: FieldCollection;
  collectedAt: Timestamp;
};
