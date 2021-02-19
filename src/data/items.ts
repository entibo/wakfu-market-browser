import _items from "../../static/items.json"

export interface ItemInfo {
  id: number
  gfxId: number
  level: number
  rarity: number
  type: number
}

export const itemInfo: Map<number, ItemInfo> = Object.entries(_items).reduce(
  (m, [id, item]) => (m.set(parseInt(id), { id: parseInt(id), ...item }), m),
  new Map(),
)
;(window as any).allItems = itemInfo

/* export function getItemInfo(itemID: number) {
  return items.get(itemID)
}
 */
