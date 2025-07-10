"use server"

export async function testSegmentExtraction() {
  console.log("🧪 === TESTING SEGMENT EXTRACTION WITH BOTH OFFERS ===")

  const testOffers = [
    {
      name: "Kenmore Offer",
      text: "Kenmore appliance offer buy Kenmore appliance between July 15th and July 22nd and get 15% back in points available for the next 30 days. Generate a catchy headline, body line as well as an image. Offer conditions is for member segment_house_owner and Member Tier as VIP Gold. offer applicable only on Washer and Dryers",
    },
    {
      name: "Levi's Offer",
      text: "levis offer buy levis jeans between July 15th and July 22nd and get 10% back in points available for the next 30 days. Generate a catchy headline, body line as well as an image. Offer conditions is for member segment_Age_20_30 and Member Tier as VIP Gold",
    },
  ]

  const results = []

  for (const offer of testOffers) {
    console.log(`\n🧪 === TESTING: ${offer.name} ===`)
    console.log("🧪 Input:", offer.text)

    // Test individual patterns
    console.log("\n🧪 Pattern Tests:")

    // Test 1: segment_house_owner pattern
    const segmentPattern1 = /member\s+segment_([a-zA-Z_0-9]+)/i
    const match1 = offer.text.match(segmentPattern1)
    console.log("🧪 Pattern 1 (segment_X):", match1)

    // Test 2: segment as pattern
    const segmentPattern2 = /member\s+segment\s+as\s+([a-zA-Z_0-9]+)/i
    const match2 = offer.text.match(segmentPattern2)
    console.log("🧪 Pattern 2 (segment as X):", match2)

    // Test 3: Member Tier pattern
    const tierPattern = /Member\s+Tier\s+as\s+([^.]+)/i
    const match3 = offer.text.match(tierPattern)
    console.log("🧪 Pattern 3 (Member Tier):", match3)

    // Test 4: Product pattern
    const productPattern = /(?:applicable\s+)?only\s+on\s+([^.]+)/i
    const match4 = offer.text.match(productPattern)
    console.log("🧪 Pattern 4 (Products):", match4)

    // Test direct string searches
    console.log("\n🧪 Direct String Tests:")
    console.log("🧪 Contains 'segment_house_owner':", offer.text.includes("segment_house_owner"))
    console.log("🧪 Contains 'segment_Age_20_30':", offer.text.includes("segment_Age_20_30"))
    console.log("🧪 Contains 'Member Tier as VIP Gold':", offer.text.includes("Member Tier as VIP Gold"))

    // Now test actual extraction
    const { extractOfferWithRegex } = await import("./extract-offer-local")
    const extractionResult = await extractOfferWithRegex(offer.text)

    console.log("\n🧪 Extraction Results:")
    console.log("🧪 Success:", extractionResult.success)
    console.log("🧪 Rules found:", Object.keys(extractionResult.data.offerRules || {}).length)
    console.log("🧪 Rules object:", extractionResult.data.offerRules)

    results.push({
      offerName: offer.name,
      input: offer.text,
      patternMatches: {
        segment1: match1,
        segment2: match2,
        tier: match3,
        products: match4,
      },
      extractionResult: extractionResult.data.offerRules,
      rulesCount: Object.keys(extractionResult.data.offerRules || {}).length,
    })
  }

  return {
    success: true,
    results,
    summary: `Tested ${testOffers.length} offers`,
  }
}
