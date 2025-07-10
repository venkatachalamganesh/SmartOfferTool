"use server"

export async function testRulesExtraction() {
  const testInput =
    "Kenmore appliance offer buy Kenmore appliance between July 15th and July 22nd and get 15% back in points available for the next 30 days. Generate a catchy headline, body line as well as an image. Offer conditions is for member segment as segment__house_owner and Member Tier as VIP Gold. offer applicable only on Washer and Dryers"

  console.log("🧪 === TESTING RULES EXTRACTION ===")
  console.log("🧪 Test input:", testInput)

  // Test individual patterns
  console.log("🧪 Testing Member Tier pattern...")
  const tierTest = testInput.match(/Member Tier as ([^.]+)/i)
  console.log("🧪 Tier match:", tierTest)

  console.log("🧪 Testing segment pattern...")
  const segmentTest = testInput.match(/segment as ([^.\s]+)/i)
  console.log("🧪 Segment match:", segmentTest)

  console.log("🧪 Testing product pattern...")
  const productTest = testInput.match(/only on ([^.]+)/i)
  console.log("🧪 Product match:", productTest)

  // Test direct string searches
  console.log("🧪 Direct string tests:")
  console.log("🧪 Contains 'Member Tier as':", testInput.includes("Member Tier as"))
  console.log("🧪 Contains 'segment as':", testInput.includes("segment as"))
  console.log("🧪 Contains 'only on':", testInput.includes("only on"))
  console.log("🧪 Contains 'VIP Gold':", testInput.includes("VIP Gold"))
  console.log("🧪 Contains 'segment__house_owner':", testInput.includes("segment__house_owner"))
  console.log("🧪 Contains 'Washer and Dryers':", testInput.includes("Washer and Dryers"))

  // Now run the actual extraction
  const { extractOfferWithRegex } = await import("./extract-offer-local")
  const result = await extractOfferWithRegex(testInput)

  console.log("🧪 === TEST RESULTS ===")
  console.log("🧪 Success:", result.success)
  console.log("🧪 Rules found:", Object.keys(result.data.offerRules || {}).length)
  console.log("🧪 Rules:", result.data.offerRules)

  return {
    success: true,
    testInput,
    extractionResult: result,
    rulesCount: Object.keys(result.data.offerRules || {}).length,
  }
}
