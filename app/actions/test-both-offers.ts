"use server"

import { extractOfferWithRegex } from "./extract-offer-local"

export async function testBothOffers() {
  console.log("🧪 === TESTING BOTH OFFERS FOR SEGMENT EXTRACTION ===")

  const offers = [
    {
      name: "Kenmore Appliance Offer",
      text: "Kenmore appliance offer buy Kenmore appliance between July 15th and July 22nd and get 15% back in points available for the next 30 days. Generate a catchy headline, body line as well as an image. Offer conditions is for member segment_house_owner and Member Tier as VIP Gold. offer applicable only on Washer and Dryers",
      expectedSegment: "segment_house_owner",
      expectedTier: "VIP Gold",
      expectedProducts: "Washer and Dryers",
    },
    {
      name: "Levi's Jeans Offer",
      text: "levis offer buy levis jeans between July 15th and July 22nd and get 10% back in points available for the next 30 days. Generate a catchy headline, body line as well as an image. Offer conditions is for member segment_Age_20_30 and Member Tier as VIP Gold",
      expectedSegment: "segment_Age_20_30",
      expectedTier: "VIP Gold",
      expectedProducts: null,
    },
  ]

  const results = []

  for (const offer of offers) {
    console.log(`\n🧪 === TESTING: ${offer.name} ===`)

    const result = await extractOfferWithRegex(offer.text)

    const extractedSegment = result.data.offerRules?.["Customer Segment"]
    const extractedTier = result.data.offerRules?.["Membership Level Required"]
    const extractedProducts = result.data.offerRules?.["Eligible Products"]

    const segmentMatch = extractedSegment === offer.expectedSegment
    const tierMatch = extractedTier === offer.expectedTier
    const productsMatch = extractedProducts === offer.expectedProducts

    console.log("🧪 Expected segment:", offer.expectedSegment)
    console.log("🧪 Extracted segment:", extractedSegment)
    console.log("🧪 Segment match:", segmentMatch ? "✅" : "❌")

    console.log("🧪 Expected tier:", offer.expectedTier)
    console.log("🧪 Extracted tier:", extractedTier)
    console.log("🧪 Tier match:", tierMatch ? "✅" : "❌")

    console.log("🧪 Expected products:", offer.expectedProducts)
    console.log("🧪 Extracted products:", extractedProducts)
    console.log("🧪 Products match:", productsMatch ? "✅" : "❌")

    results.push({
      offerName: offer.name,
      success: result.success,
      segmentMatch,
      tierMatch,
      productsMatch,
      allMatch: segmentMatch && tierMatch && productsMatch,
      extractedRules: result.data.offerRules,
      expectedRules: {
        "Customer Segment": offer.expectedSegment,
        "Membership Level Required": offer.expectedTier,
        "Eligible Products": offer.expectedProducts,
      },
    })
  }

  const allPassed = results.every((r) => r.allMatch)

  console.log("\n🧪 === FINAL TEST RESULTS ===")
  console.log("🧪 All tests passed:", allPassed ? "✅" : "❌")

  return {
    success: true,
    allPassed,
    results,
    summary: `Tested ${offers.length} offers - ${results.filter((r) => r.allMatch).length} passed`,
  }
}
