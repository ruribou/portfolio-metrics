import app from "./instance.ts"
;(async function () {
  await app({sandbox: process.env.SANDBOX as any})
})()
