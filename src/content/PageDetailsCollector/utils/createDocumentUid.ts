import { v4 as uuidv4 } from "uuid";

export function createDocumentUid(): string {
  return uuidv4();
}
