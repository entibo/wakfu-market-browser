import _items from "../../static/items.json"

export interface ItemInfo {
  id: number
  gfxId: number
  level: number
  rarity: number
  type: number
}

export const encyclopediaItemList: ItemInfo[] = Object.entries(_items).map(([key, info]) => ({
  id: parseInt(key),
  ...info,
}))

export const itemInfoMap = new Map(encyclopediaItemList.map((itemInfo) => [itemInfo.id, itemInfo]))
;(window as any).itemInfoMap = itemInfoMap

/* export function getItemInfo(itemID: number) {
  return items.get(itemID)
}
 */
