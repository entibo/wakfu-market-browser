import axios from "axios"
import fs from "fs/promises"
import path from "path"

//https://wakfu.cdn.ankama.com/gamedata/{version}/{type}.json
const endpoints = {
  actions: "contains the descriptions of effect types (HP loss, AP boost, etc.)",
  collectibleResources: "contains the harvest actions",
  equipmentItemTypes:
    "contains the definitions of types of equipment and their associated positions",
  harvestLoots: "contains the items obtained through harvesting",
  itemProperties: "contains the properties that can be applied to items",
  items:
    "contains the data on items, their effects, names, descriptions, etc. To be cross-referenced with the data from actions, equipmentItemTypes and itemProperties.",
  jobsItems: "contains the data on items harvested, crafted or used as ingredient",
  recipeCategories: "contains the jobs",
  recipeIngredients: "contains the ingredients of recipes",
  recipeResults: "contains the items produced by recipes",
  recipes: "contains the recipes",
  resourceTypes: "contains the types of resources",
  resources: "contains the resources",
  states: "contains the translation of the states used by the equipment",
}
const getEndpoint = (type: keyof typeof endpoints, version: string) =>
  `https://wakfu.cdn.ankama.com/gamedata/${version}/${type}.json`

const simplifyItemData = (item: any) => ({
  id: item.definition.item.id,
  level: item.definition.item.level,
  itemTypeId: item.definition.item.baseParameters.itemTypeId,
  rarity: item.definition.item.baseParameters.rarity,
})

async function generateFiles(items: any[]) {
  const simplifiedItems = items.map(simplifyItemData)
  await fs.writeFile(
    path.resolve(process.cwd(), "tmp/items-base.json"),
    JSON.stringify(simplifiedItems, null, 2),
  )

  for (const locale of ["fr", "en", "es", "pt"]) {
    const data = items.reduce(
      (acc, item) => (
        (acc[item.definition.item.id] = {
          title: item.title?.[locale] ?? "",
          description: item.description?.[locale] ?? "",
        }),
        acc
      ),
      {},
    )
    await fs.writeFile(
      path.resolve(process.cwd(), `tmp/items-lang-${locale}.json`),
      JSON.stringify(data, null, 2),
    )
  }
}

async function start() {
  const itemsJsonPath = path.resolve(process.cwd(), "tmp/items.json")
  let items: any[]
  try {
    items = JSON.parse((await fs.readFile(itemsJsonPath)).toString())
  } catch (e) {
    const version = await axios
      .get("https://wakfu.cdn.ankama.com/gamedata/config.json")
      .then(({ data }) => data.version as string)
    items = await axios.get(getEndpoint("items", version)).then(({ data }) => data)
    await fs.writeFile(itemsJsonPath, JSON.stringify(items, null, 2))
  }

  const resourcesJsonPath = path.resolve(process.cwd(), "tmp/resources.json")
  let resources: any[]
  try {
    resources = JSON.parse((await fs.readFile(resourcesJsonPath)).toString())
  } catch (e) {
    const version = await axios
      .get("https://wakfu.cdn.ankama.com/gamedata/config.json")
      .then(({ data }) => data.version as string)
    resources = await axios.get(getEndpoint("resources", version)).then(({ data }) => data)
    await fs.writeFile(resourcesJsonPath, JSON.stringify(resources, null, 2))
  }

  await generateFiles(items)
}
start()
