import items from "../../static/items.json"

export function getItemInfo(itemId: number) {
  if (itemId in items) {
    return items[(itemId as unknown) as keyof typeof items]
    /* let {gfxId,level,rarity,type} = items[(itemId as unknown) as keyof typeof items]
      return {
      iconUrl: `https://vertylo.github.io/wakassets/items/${gfxId}.png`,
    } */
  }
}
