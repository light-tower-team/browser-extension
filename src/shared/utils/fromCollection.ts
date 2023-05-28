export function fromCollection<
  TItem,
  TKey extends keyof TItem,
  TKeyType extends string | number | symbol = TItem[TKey] extends string | number | symbol ? TItem[TKey] : string
>(collection: Record<TKeyType, TItem>): Array<TItem> {
  return Object.values(collection);
}
