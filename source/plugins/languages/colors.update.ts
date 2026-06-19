// @ts-nocheck -- TODO(ts): remove and type this plugin (staged migration)
//Regenerate colors.json from the bundled linguist-js language database.
//Usage: node source/plugins/languages/colors.update.ts
import yaml from "js-yaml"
import fs from "fs/promises"
import paths from "path"

async function main() {
  const src = paths.join(import.meta.dirname, "../../../node_modules/linguist-js/ext/languages.yml")
  const data = yaml.load(`${await fs.readFile(src)}`)
  const colors = {}
  for (const [name, info] of Object.entries(data)) {
    if (info?.color) colors[name.toLocaleLowerCase()] = info.color
  }
  await fs.writeFile(paths.join(import.meta.dirname, "colors.json"), `${JSON.stringify(colors, null, 2)}\n`)
  console.log(`wrote ${Object.keys(colors).length} language colors`)
}

main()
