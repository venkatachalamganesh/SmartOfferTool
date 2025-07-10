"use server"

// Simple test function to verify regex extraction works
export async function testRegexExtraction() {
  const testOffer = `Levis jeans offer between July 15th and July 22nd. 
Earn 10% cashback on all purchases. 
Member Tier as VIP GOLD. 
Points available for the next 30 days.`

  const extractedData: any = {}
  extractedData.offerDescription = testOffer.trim()

  // Test offer name extraction
  const offerNameMatch = testOffer.match(/(\w+(?:\s+\w+)*)\s+(?:offer|sale|deal|promotion)/i)
  if (offerNameMatch) {
    extractedData.offerName = offerNameMatch[1].trim().substring(0, 30)
  }

  // Test percentage extraction
  const percentageMatch = testOffer.match(/(\d+(?:\.\d+)?)\s*%\s*(?:cashback|back|off)/i)
  if (percentageMatch) {
    extractedData.earnAmount = percentageMatch[1]
    extractedData.earnType = "cashback"
  }

  // Test date extraction
  const dateMatch = testOffer.match(
    /between\s+(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?\s+and\s+(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?/i,
  )
  if (dateMatch) {
    const monthMap: { [key: string]: string } = { july: "07", jul: "07" }
    const startMonth = monthMap[dateMatch[1].toLowerCase()]
    const endMonth = monthMap[dateMatch[3].toLowerCase()]

    if (startMonth && endMonth) {
      extractedData.offerStartDate = `2025-${startMonth}-${dateMatch[2].padStart(2, "0")}`
      extractedData.offerEndDate = `2025-${endMonth}-${dateMatch[4].padStart(2, "0")}`
    }
  }

  // Test rules extraction
  const rules: { [key: string]: string } = {}
  const tierMatch = testOffer.match(/member\s+tier\s+(?:as|=|:)?\s*(vip\s+gold|premium|gold|silver)/i)
  if (tierMatch) {
    rules["Member Tier"] = tierMatch[1].toUpperCase()
  }

  const expiryMatch = testOffer.match(/available\s+for\s+(?:the\s+)?next\s+(\d+)\s+days?/i)
  if (expiryMatch) {
    extractedData.simplePointExpiry = `Transaction date + ${expiryMatch[1]} days`
  }

  extractedData.offerRules = rules
  extractedData.offerHeadline = "Denim Deal!"
  extractedData.offerBodyline = "Get premium denim and earn rewards!"

  return {
    success: true,
    data: extractedData,
    testInput: testOffer,
  }
}
