import app from "./instance.mts"
;(async function() {
  await app({sandbox: process.env.SANDBOX as any})
})()
