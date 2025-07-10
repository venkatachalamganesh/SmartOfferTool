"use server"

interface OfferData {
  offerName: string
  offerHeadline: string
  offerBodyline: string
  offerStartDate: string
  offerEndDate: string
  offerRules: Record<string, string>
  earnType: string
  earnAmount: string
  earnDisplayText: string
  simplePointExpiry: string
  offerDescription: string
}

export async function extractOfferWithRegex(
  text: string,
): Promise<{ success: boolean; data?: OfferData; error?: string }> {
  console.log("⚡ === REGEX EXTRACTION STARTING ===")
  console.log("⚡ Input text:", text.substring(0, 200) + "...")

  try {
    // Extract offer name (brand/product)
    let offerName = ""
    const brandMatches = text.match(/\b(Kenmore|Levi'?s?|levis?|Nike|Apple|Samsung|LG|Sony)\b/i)
    if (brandMatches) {
      offerName = brandMatches[1]
      if (text.toLowerCase().includes("appliance")) {
        offerName += " Appliances"
      } else if (text.toLowerCase().includes("jeans")) {
        offerName += " Jeans"
      }
    }

    // Generate headlines based on content
    let offerHeadline = ""
    let offerBodyline = ""

    if (text.toLowerCase().includes("kenmore") || text.toLowerCase().includes("appliance")) {
      offerHeadline = "Appliance Deals & Rewards!"
      offerBodyline = "Save on Kenmore appliances and earn rewards!"
    } else if (text.toLowerCase().includes("levi") || text.toLowerCase().includes("jeans")) {
      offerHeadline = "Premium Denim Savings!"
      offerBodyline = "Get premium Levi's jeans and earn points!"
    } else if (text.toLowerCase().includes("tech") || text.toLowerCase().includes("electronics")) {
      offerHeadline = "Tech Rewards & Cashback!"
      offerBodyline = "Upgrade your tech and earn rewards today!"
    } else {
      offerHeadline = "Special Offer & Rewards!"
      offerBodyline = "Shop now and earn amazing rewards!"
    }

    // Extract dates
    let offerStartDate = ""
    let offerEndDate = ""

    // Pattern: "between July 15th and July 22nd"
    const betweenMatch = text.match(/between\s+(\w+\s+\d+(?:st|nd|rd|th)?)\s+and\s+(\w+\s+\d+(?:st|nd|rd|th)?)/i)
    if (betweenMatch) {
      offerStartDate = convertToISODate(betweenMatch[1])
      offerEndDate = convertToISODate(betweenMatch[2])
    } else {
      // Pattern: "from July 15th" or "starting July 15th"
      const startMatch = text.match(/(?:from|starting)\s+(\w+\s+\d+(?:st|nd|rd|th)?)/i)
      if (startMatch) {
        offerStartDate = convertToISODate(startMatch[1])
      }
    }

    // Extract earn information
    let earnAmount = ""
    let earnType = ""
    let earnDisplayText = ""

    // Pattern: "15% back in points"
    const percentageMatch = text.match(/(\d+(?:\.\d+)?)\s*%\s*back\s+in\s+points/i)
    if (percentageMatch) {
      const percentage = Number.parseFloat(percentageMatch[1])
      earnAmount = (percentage * 10).toString() // 15% → 150 points per dollar
      earnType = "points"
      earnDisplayText = `${percentage}% back in points`
    }

    // Pattern: "$50 in points"
    const dollarMatch = text.match(/\$(\d+(?:\.\d+)?)\s+in\s+points/i)
    if (dollarMatch) {
      const dollars = Number.parseFloat(dollarMatch[1])
      earnAmount = (dollars * 1000).toString() // $50 → 50000 points
      earnType = "points"
      earnDisplayText = `$${dollars} in points`
    }

    // Pattern: "15% cashback"
    const cashbackMatch = text.match(/(\d+(?:\.\d+)?)\s*%\s*cashback/i)
    if (cashbackMatch) {
      const percentage = Number.parseFloat(cashbackMatch[1])
      earnAmount = percentage.toString()
      earnType = "cashback"
      earnDisplayText = `${percentage}% cashback`
    }

    // Extract point expiry
    let simplePointExpiry = ""
    const expiryMatch = text.match(/available for (?:the )?next (\d+) days/i)
    if (expiryMatch) {
      simplePointExpiry = `Points expire ${expiryMatch[1]} days after earning date`
    }

    // Extract rules
    const offerRules: Record<string, string> = {}

    // Member Tier
    const tierMatch = text.match(/Member Tier as ([^.]+)/i)
    if (tierMatch) {
      offerRules["Membership Level Required"] = tierMatch[1].trim()
    }

    // Customer Segment - segment_house_owner
    if (text.includes("segment_house_owner")) {
      offerRules["Customer Segment"] = "segment_house_owner"
    }

    // Customer Segment - segment_Age_XX_XX
    const ageSegmentMatch = text.match(/segment_(Age_\d+_\d+)/i)
    if (ageSegmentMatch) {
      offerRules["Customer Segment"] = `segment_${ageSegmentMatch[1]}`
    }

    // Eligible Products
    const productMatch = text.match(/(?:applicable )?only on ([^.]+)/i)
    if (productMatch) {
      offerRules["Eligible Products"] = productMatch[1].trim()
    }

    const extractedData: OfferData = {
      offerName,
      offerHeadline,
      offerBodyline,
      offerStartDate,
      offerEndDate,
      offerRules,
      earnType,
      earnAmount,
      earnDisplayText,
      simplePointExpiry,
      offerDescription: text.trim(),
    }

    console.log("⚡ ✅ Regex extraction successful")
    console.log("⚡ Extracted data:", extractedData)
    console.log("⚡ Rules count:", Object.keys(extractedData.offerRules).length)

    return {
      success: true,
      data: extractedData,
    }
  } catch (error) {
    console.error("⚡ ❌ Regex extraction error:", error)
    return {
      success: false,
      error: `Regex extraction failed: ${error.message}`,
    }
  }
}

function convertToISODate(dateStr: string): string {
  try {
    // Remove ordinal suffixes (st, nd, rd, th)
    const cleanDate = dateStr.replace(/(\d+)(?:st|nd|rd|th)/, "$1")

    // Parse the date and assume current year if not specified
    const date = new Date(`${cleanDate} 2025`)

    if (isNaN(date.getTime())) {
      return ""
    }

    return date.toISOString().split("T")[0] // Return YYYY-MM-DD format
  } catch (error) {
    console.error("Date conversion error:", error)
    return ""
  }
}
