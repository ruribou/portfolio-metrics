// @ts-nocheck -- TODO(ts): remove and type this plugin (staged migration)
//Setup
export default async function ({q, data, imports, account}, {enabled = false, extras = false} = {}) {
  //Plugin execution
  try {
    //Check if plugin is enabled and requirements are met
    if (!q.fortune || !imports.metadata.plugins.fortune.enabled(enabled, {extras})) return null

    //Load inputs
    imports.metadata.plugins.fortune.inputs({data, account, q})

    //Fortunes list
    const fortunes = [
      {chance: 0.06, color: "#F51C6A", text: "Reply hazy"},
      {chance: 0.03, color: "#FD4D32", text: "Excellent Luck"},
      {chance: 0.16, color: "#E7890C", text: "Good Luck"},
      {chance: 0.24, color: "#BAC200", text: "Average Luck"},
      {chance: 0.16, color: "#7FEC11", text: "Bad Luck"},
      {chance: 0.06, color: "#43FD3B", text: "Good news will come to you by mail"},
      {chance: 0.06, color: "#16F174", text: "（　´_ゝ`）ﾌｰﾝ "},
      {chance: 0.06, color: "#00CBB0", text: "ｷﾀ━━━━━━(ﾟ∀ﾟ)━━━━━━ !!!!"},
      {chance: 0.06, color: "#0893E1", text: "You will meet a dark handsome stranger"},
      {chance: 0.06, color: "#2A56FB", text: "Better not tell you now"},
      {chance: 0.06, color: "#6023F8", text: "Outlook good"},
      {chance: 0.04, color: "#9D05DA", text: "Very Bad Luck"},
      {chance: 0.01, color: "#D302A7", text: "Godly Luck"},
    ]

    //Result
    let [fortune] = fortunes
    const x = Math.random()
    for (let i = 0, r = 0; i < fortunes.length; i++) {
      if (x <= r) {
        fortune = fortunes[i]
        break
      }
      r += fortunes[i].chance
    }
    return {...fortune}
  } catch (error) {
    //Handle errors
    throw imports.format.error(error)
  }
}
