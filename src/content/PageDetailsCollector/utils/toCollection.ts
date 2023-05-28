export function toCollection<
  TItem,
  TKey extends keyof TItem,
  TKeyType extends string | number | symbol = TItem[TKey] extends string | number | symbol ? TItem[TKey] : string
>(list: Array<TItem>, getKey: (item: TItem) => TKeyType): Partial<Record<TKeyType, TItem>> {
  return list.reduce<Partial<Record<TKeyType, TItem>>>((collection, item) => {
    const key = getKey(item);

    collection[key] = item;

    return collection;
  }, {});
}
