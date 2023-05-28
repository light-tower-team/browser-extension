export function toCollection<
  TItem,
  TKey extends keyof TItem,
  TKeyType extends string | number | symbol = TItem[TKey] extends string | number | symbol ? TItem[TKey] : string
>(list: Array<TItem>, getKey: (item: TItem) => TKeyType): Record<TKeyType, TItem> {
  return list.reduce<Record<TKeyType, TItem>>((collection, item) => {
    const key = getKey(item);

    collection[key] = item;

    return collection;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  }, {} as Record<TKeyType, TItem>);
}
