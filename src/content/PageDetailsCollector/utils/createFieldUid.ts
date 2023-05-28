import { v4 as uuidv4 } from "uuid";

export function createFieldUid(): string {
  return uuidv4();
}
