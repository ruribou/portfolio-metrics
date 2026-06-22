//Imports
import {spawn, spawnSync} from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import {fileURLToPath} from "node:url"
import yaml from "js-yaml"
import {afterAll, beforeAll, describe, expect, test} from "vitest"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

//GitHub action
const action = yaml.load(fs.readFileSync(path.join(__dirname, "../action.yml"), "utf8"))
action.defaults = Object.fromEntries(Object.entries(action.inputs).map(([key, {default: value}]) => [key, value]))
action.input = vars => Object.fromEntries([...Object.entries(action.defaults), ...Object.entries(vars)].map(([key, value]) => [`INPUT_${key.toLocaleUpperCase()}`, value]))
action.run = async vars =>
  await new Promise((solve, reject) => {
    let [stdout, stderr] = ["", ""]
    const env = {...process.env, ...action.input(vars), GITHUB_REPOSITORY: "lowlighter/metrics"}
    const child = spawn("node", ["--import", "tsx", "source/app/action/index.ts"], {env})
    child.stdout.on("data", data => stdout += data)
    child.stderr.on("data", data => stderr += data)
    child.on("close", code => {
      if (code === 0)
        return solve(true)
      console.log(stdout, stderr)
      reject(stdout)
    })
  })

//Setup
beforeAll(async () => {
  //Clean community template
  await fs.promises.rm(path.join(__dirname, "../source/templates/@classic"), {recursive: true, force: true})
})
//Teardown
afterAll(async () => {
  //Clean community template
  await fs.promises.rm(path.join(__dirname, "../source/templates/@classic"), {recursive: true, force: true})
})

//Load metadata (generated in an isolated subprocess so the heavy plugin import
//graph is evaluated once under tsx, independently of the test runner)
const metadata = JSON.parse(`${
  spawnSync("node", ["--import", "tsx",
    "--input-type",
    "module",
    "--eval",
    'import metadata from "./source/app/metrics/metadata.ts";console.log(JSON.stringify(await metadata({log:false})))',
  ]).stdout
}`)

//Build tests index
const tests = []
for (const type of ["plugins", "templates"]) {
  for (const name in metadata[type]) {
    const cases = yaml
      .load(fs.readFileSync(path.join(__dirname, "../tests/cases", `${name}.${type.replace(/s$/, "")}.yml`), "utf8"))
      ?.map(({name: test, with: inputs, modes = [], timeout}) => {
        const skip = new Set(Object.entries(metadata.templates).filter(([_, {readme: {compatibility}}]) => !compatibility[name]).map(([template]) => template))
        if (!(metadata[type][name].supports?.includes("repository")))
          skip.add("repository")
        return [test, inputs, {skip: [...skip], modes, timeout}]
      }) ?? []
    tests.push(...cases)
  }
}

//Tests run
describe("GitHub Action", () =>
  describe.each([
    ["classic", {}],
    ["terminal", {}],
    ["repository", {repo: "metrics"}],
  ])("Template : %s", (template, query) => {
    for (const [name, input, {skip = [], modes = [], timeout} = {}] of tests) {
      if ((skip.includes(template)) || ((modes.length) && (!modes.includes("action"))))
        test.skip(name, () => null)
      else
        test(name, async () => expect(await action.run({template, base: "", query: JSON.stringify(query), plugins_errors_fatal: true, dryrun: true, use_mocked_data: true, verify: true, retries: 1, ...input})).toBe(true), timeout)
    }
  }))
