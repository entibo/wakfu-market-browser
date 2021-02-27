import * as Comlink from "comlink"
import { encyclopediaItemList, ItemInfo, itemInfoMap } from "@/data/items"
import * as marketData from "@/store/marketData"

export interface ItemQuery {
  locale: string
  name: string
  categories: number[]
  rarities: number[]
  level: readonly [number, number]
  sortBy: {
    value: string | null
    descending: boolean
  }
}
export interface SortBy {
  value: null | string
  descending: boolean
}
export const defaultSortBy: () => SortBy = () => ({
  value: null,
  descending: false
})

import latinize from "latinize"
export function normalize(str: string) {
  str = str.toLowerCase()
  str = latinize(str)
  str = str.replace(/[-°/]/g, " ")
  str = str.replace(/[()"'!?’‘.,«»:]/g, "")
  str = str.replace(/ {2}/g, " ")
  return str
}

const localeItemNamesNormalizedMap: Record<string, Record<number, string>> = {}
async function loadItemNamesNormalized(locale: string) {
  let itemNames = (await import(`@/../static/itemNames-${locale}.json`)).default
  for (let key of Object.keys(itemNames)) {
    itemNames[key] = normalize(itemNames[key])
  }
  return itemNames
}

async function queryEncyclopedia(query: ItemQuery) {
  let itemNames =
    localeItemNamesNormalizedMap[query.locale] ??
    (localeItemNamesNormalizedMap[query.locale] = await loadItemNamesNormalized(query.locale))
  let nameNormalized = normalize(query.name)
  let idSearch: number | null = query.name.match(/^\d+$/) && parseInt(query.name)

  let items = encyclopediaItemList.filter((item) => {
    if (query.categories.length && !query.categories.includes(item.type)) return false
    if (query.rarities.length && !query.rarities.includes(item.rarity)) return false
    if (item.type !== 582 && item.type !== 611)
      if (item.level < query.level[0] || item.level > query.level[1]) return false
    if (idSearch !== null) {
      if (idSearch !== item.id) return false
    } else if (nameNormalized !== "") {
      if (!itemNames[item.id].includes(nameNormalized)) return false
    }
    return true
  })

  const sortFn: null | ((a: ItemInfo, b: ItemInfo) => number) =
    query.sortBy.value === "name"
      ? (a, b) => itemNames[a.id].toLowerCase().localeCompare(itemNames[b.id].toLowerCase())
      : query.sortBy.value === "type"
      ? (a, b) => a.type - b.type
      : query.sortBy.value === "rarity"
      ? (a, b) => a.rarity - b.rarity
      : query.sortBy.value === "level"
      ? (a, b) => a.level - b.level
      : null
  if (sortFn !== null)
    items.sort(query.sortBy.descending ? (a: ItemInfo, b: ItemInfo) => sortFn(b, a) : sortFn)

  return items.map((item) => item.id)
}

const toBeExposed = {
  queryEncyclopedia,
}

export type ExposedType = typeof toBeExposed
Comlink.expose(toBeExposed)
