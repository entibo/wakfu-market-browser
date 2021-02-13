import axios from "axios"
import fs from "fs/promises"
import path from "path"

const JSON_PATH = path.resolve(process.cwd(), "static")

const endpoints = [
  "actions",
  "collectibleResources",
  "equipmentItemTypes",
  "harvestLoots",
  "itemProperties",
  "items",
  "jobsItems",
  "recipeCategories",
  "recipeIngredients",
  "recipeResults",
  "recipes",
  "resourceTypes",
  "resources",
  "states",
] as const
type Endpoint = typeof endpoints[number]

/**
 * https://wakfu.cdn.ankama.com/gamedata/{version}/{type}.json
 */
const getEndpoint = (type: Endpoint, version: string) =>
  `https://wakfu.cdn.ankama.com/gamedata/${version}/${type}.json`

function normalizeApiItems(list: any[]) {
  const items: any = {}
  for (const item of list) {
    const id = item.definition.item.id
    const gfxId = item.definition.item.graphicParameters.gfxId
    const level = item.definition.item.level
    const itemTypeId = item.definition.item.baseParameters.itemTypeId
    const rarity = item.definition.item.baseParameters.rarity
    items[id] = {
      gfxId,
      level,
      type: itemTypeId,
      rarity,
    }
  }
  return items
}

async function start() {
  const version = await axios
    .get("https://wakfu.cdn.ankama.com/gamedata/config.json")
    .then(({ data }) => data.version as string)
  const apiItems = await axios.get(getEndpoint("items", version)).then(({ data }) => data)

  const normalizedApiItems = normalizeApiItems(apiItems)
  const encyclopediaItems = await axios
    .get("https://entibo.github.io/wakfu-encyclopedia-scraper/json/items.json")
    .then(({ data }) => data)
  const items = Object.assign(normalizedApiItems, encyclopediaItems)
  await fs.writeFile(path.join(JSON_PATH, "items.json"), JSON.stringify(items, null, 2))

  for (const locale of ["fr", "en", "es", "pt"]) {
    const apiItemNames = apiItems.reduce(
      (acc: any, item: any) => ((acc[item.definition.item.id] = item.title?.[locale] ?? ""), acc),
      {},
    )
    const encyclopediaItemNames = await axios
      .get(`https://entibo.github.io/wakfu-encyclopedia-scraper/json/itemNames-${locale}.json`)
      .then(({ data }) => data)
    const itemNames = Object.assign(apiItemNames, encyclopediaItemNames)
    await fs.writeFile(
      path.join(JSON_PATH, `itemNames-${locale}.json`),
      JSON.stringify(itemNames, null, 2),
    )
  }
}
start()
