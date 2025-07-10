"use server"

import { extractOfferWithRegex } from "./extract-offer-local"

export async function directTest() {
  const exactInput =
    "Kenmore appliance offer buy Kenmore appliance between July 15th and July 22nd and get 15% back in points available for the next 30 days. Generate a catchy headline, body line as well as an image. Offer conditions is for member segment as segment__house_owner and Member Tier as VIP Gold. offer applicable only on Washer and Dryers"

  console.log("🧪 === DIRECT TEST WITH EXACT INPUT ===")
  console.log("🧪 Input:", exactInput)

  const result = await extractOfferWithRegex(exactInput)

  console.log("🧪 === RESULTS ===")
  console.log("🧪 Success:", result.success)
  console.log("🧪 Rules object:", result.data.offerRules)
  console.log("🧪 Rules count:", Object.keys(result.data.offerRules || {}).length)
  console.log("🧪 Full data:", result.data)

  return result
}
