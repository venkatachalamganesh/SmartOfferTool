"use server"

export async function extractOfferWithRegex(text: string) {
  console.log("⚡ === ENHANCED REGEX EXTRACTION STARTING ===")
  console.log("⚡ Input text:", text)

  const extractedData: any = {}
  extractedData.offerDescription = text.trim()

  // Extract offer name with better brand detection
  if (text.toLowerCase().includes("kenmore")) {
    extractedData.offerName = "Kenmore Appliance"
  } else if (text.toLowerCase().includes("levis") || text.toLowerCase().includes("levi's")) {
    extractedData.offerName = "Levi's Jeans"
  } else {
    // Generic extraction
    const offerNameMatch = text.match(/(\w+(?:\s+\w+)*)\s+(?:offer|sale|deal|promotion)/i)
    if (offerNameMatch) {
      extractedData.offerName = offerNameMatch[1].trim().substring(0, 30)
    }
  }

  // Extract earn amount and type
  const earnMatch = text.match(/(\d+)%\s+back/i)
  if (earnMatch) {
    extractedData.earnAmount = (Number.parseFloat(earnMatch[1]) * 10).toString() // Convert to points per dollar
    extractedData.earnType = "points"
    extractedData.earnDisplayText = `${earnMatch[1]}% back in points`
  }

  // Extract dates - handle both patterns
  const dateRangeMatch = text.match(/between\s+(\w+)\s+(\d+)[a-z]*\s+and\s+(\w+)\s+(\d+)/i)
  const startDateMatch = text.match(/starting\s+(\w+)\s+(\d+)/i)

  if (dateRangeMatch) {
    // Handle "between July 15th and July 22nd"
    const monthMap: { [key: string]: string } = { july: "07", jul: "07" }
    const startMonth = monthMap[dateRangeMatch[1].toLowerCase()]
    const endMonth = monthMap[dateRangeMatch[3].toLowerCase()]

    if (startMonth && endMonth) {
      extractedData.offerStartDate = `2025-${startMonth}-${dateRangeMatch[2].padStart(2, "0")}`
      extractedData.offerEndDate = `2025-${endMonth}-${dateRangeMatch[4].padStart(2, "0")}`
    }
  } else if (startDateMatch) {
    // Handle "starting July 15th"
    const monthMap: { [key: string]: string } = { july: "07", jul: "07" }
    const startMonth = monthMap[startDateMatch[1].toLowerCase()]

    if (startMonth) {
      extractedData.offerStartDate = `2025-${startMonth}-${startDateMatch[2].padStart(2, "0")}`
    }
  }

  // Extract expiry
  const expiryMatch = text.match(/next\s+(\d+)\s+days/i)
  if (expiryMatch) {
    extractedData.simplePointExpiry = `Points expire ${expiryMatch[1]} days after earning date`
  }

  // ENHANCED RULES EXTRACTION WITH BETTER SEGMENT DETECTION
  const rules: { [key: string]: string } = {}

  console.log("⚡ === ENHANCED RULES EXTRACTION ===")

  // Pattern 1: Member Tier as VIP Gold
  console.log("⚡ Testing for Member Tier...")
  const tierMatch = text.match(/Member\s+Tier\s+as\s+([^.]+)/i)
  if (tierMatch) {
    rules["Membership Level Required"] = tierMatch[1].trim()
    console.log("⚡ ✅ Found Member Tier:", tierMatch[1].trim())
  }

  // Pattern 2: Enhanced segment detection - multiple patterns
  console.log("⚡ Testing for member segments...")

  // Pattern 2a: member segment_XXXXX (direct underscore format)
  const segmentDirectMatch = text.match(/member\s+segment_([a-zA-Z_0-9]+)/i)
  if (segmentDirectMatch) {
    const segmentValue = `segment_${segmentDirectMatch[1]}`
    rules["Customer Segment"] = segmentValue
    console.log("⚡ ✅ Found Segment (direct):", segmentValue)
  }

  // Pattern 2b: member segment as segment_XXXXX or segment__XXXXX
  if (!rules["Customer Segment"]) {
    const segmentAsMatch = text.match(/member\s+segment\s+as\s+(segment_+[a-zA-Z_0-9]+)/i)
    if (segmentAsMatch) {
      rules["Customer Segment"] = segmentAsMatch[1]
      console.log("⚡ ✅ Found Segment (as format):", segmentAsMatch[1])
    }
  }

  // Pattern 2c: Flexible segment pattern for any format
  if (!rules["Customer Segment"]) {
    const flexibleSegmentMatch = text.match(/segment[_\s]+(Age_\d+_\d+|house_owner|[a-zA-Z_0-9]+)/i)
    if (flexibleSegmentMatch) {
      const segmentValue = flexibleSegmentMatch[1].startsWith("segment_")
        ? flexibleSegmentMatch[1]
        : `segment_${flexibleSegmentMatch[1]}`
      rules["Customer Segment"] = segmentValue
      console.log("⚡ ✅ Found Segment (flexible):", segmentValue)
    }
  }

  // Pattern 3: Product restrictions
  console.log("⚡ Testing for product restrictions...")
  const productMatch = text.match(/(?:applicable\s+)?only\s+on\s+([^.]+)/i)
  if (productMatch) {
    rules["Eligible Products"] = productMatch[1].trim()
    console.log("⚡ ✅ Found Products:", productMatch[1].trim())
  }

  // Additional specific pattern tests for debugging
  console.log("⚡ === SPECIFIC PATTERN DEBUGGING ===")

  // Test for Age segment specifically
  if (text.includes("segment_Age_")) {
    const ageSegmentMatch = text.match(/segment_(Age_\d+_\d+)/i)
    if (ageSegmentMatch && !rules["Customer Segment"]) {
      rules["Customer Segment"] = `segment_${ageSegmentMatch[1]}`
      console.log("⚡ ✅ Found Age Segment (specific):", `segment_${ageSegmentMatch[1]}`)
    }
  }

  // Test for house_owner segment specifically
  if (text.includes("segment_house_owner")) {
    if (!rules["Customer Segment"]) {
      rules["Customer Segment"] = "segment_house_owner"
      console.log("⚡ ✅ Found House Owner Segment (specific):", "segment_house_owner")
    }
  }

  extractedData.offerRules = rules

  // Generate headlines based on brand
  if (text.toLowerCase().includes("kenmore")) {
    extractedData.offerHeadline = "Appliance Deal!"
    extractedData.offerBodyline = "Save on Kenmore appliances and earn rewards!"
  } else if (text.toLowerCase().includes("levis") || text.toLowerCase().includes("levi's")) {
    extractedData.offerHeadline = "Denim Savings!"
    extractedData.offerBodyline = "Get premium Levi's jeans and earn points!"
  } else {
    extractedData.offerHeadline = "Special Offer!"
    extractedData.offerBodyline = "Save big and earn rewards!"
  }

  console.log("⚡ === FINAL RESULTS ===")
  console.log("⚡ Rules found:", Object.keys(rules).length)
  console.log("⚡ Rules object:", rules)
  console.log("⚡ Customer Segment:", rules["Customer Segment"])
  console.log("⚡ Member Tier:", rules["Membership Level Required"])
  console.log("⚡ Products:", rules["Eligible Products"])

  return {
    success: true,
    data: extractedData,
  }
}
