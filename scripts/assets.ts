import axios from "axios"
import fs from "fs/promises"
import path from "path"

const JSON_PATH = path.resolve(process.cwd(), "static")
const ASSETS_PATH = path.resolve(process.cwd(), "src/assets")

async function getCategoryIcons() {
  const categoryNames = JSON.parse(
    (await fs.readFile(path.join(JSON_PATH, "categoryNames-fr.json"))).toString(),
  )
  //for (const category of Object.keys(categoryNames)) {
  for (let category = -10; category < 1000; category++) {
    const fileName = path.join(ASSETS_PATH, "item-category", category + ".png")
    try {
      await fs.stat(fileName)
      console.log("File already exists, skipping:", fileName)
      continue
    } catch (e) {
      console.log(`Fetching category ${category}.png`)
    }
    try {
      const data = await axios
        .get(`https://static.ankama.com/wakfu/portal/game/category/${category}.png`, {
          responseType: "arraybuffer",
        })
        .then((resp) => resp.data)
      await fs.writeFile(fileName, data)
    } catch (e) {
      console.error(`Failed to retrieve category ${category}.png`)
    }
  }
}

async function start() {
  await getCategoryIcons()
}
start()
