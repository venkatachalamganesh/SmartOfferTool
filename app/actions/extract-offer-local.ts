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
    const brandMatches = text.match(
      /\b(Kenmore|Levi'?s?|levis?|Nike|Apple|Samsung|LG|Sony|Summer|Fashion|Electronics)\b/i,
    )
    if (brandMatches) {
      offerName = brandMatches[1]
      if (text.toLowerCase().includes("appliance")) {
        offerName += " Appliances"
      } else if (text.toLowerCase().includes("jeans")) {
        offerName += " Jeans"
      } else if (text.toLowerCase().includes("electronics")) {
        offerName += " Electronics"
      } else if (text.toLowerCase().includes("fashion")) {
        offerName += " Fashion"
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
    } else if (text.toLowerCase().includes("electronics")) {
      offerHeadline = "Electronics Sale Event!"
      offerBodyline = "Upgrade your tech with amazing discounts!"
    } else if (text.toLowerCase().includes("fashion")) {
      offerHeadline = "Fashion Week Special!"
      offerBodyline = "Designer fashion with cashback rewards!"
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
      // Pattern: "from August 1st to August 31st"
      const fromToMatch = text.match(/from\s+(\w+\s+\d+(?:st|nd|rd|th)?)\s+to\s+(\w+\s+\d+(?:st|nd|rd|th)?)/i)
      if (fromToMatch) {
        offerStartDate = convertToISODate(fromToMatch[1])
        offerEndDate = convertToISODate(fromToMatch[2])
      }
    }

    // Extract earn information with CORRECTED logic
    let earnAmount = ""
    let earnType = ""
    let earnDisplayText = ""

    console.log("⚡ === REWARD EXTRACTION (CORRECTED) ===")

    // Priority 1: Check for points per dollar (most specific)
    const pointsPerDollarMatch = text.match(/(?:earn\s+)?(\d+)\s+points?\s+per\s+dollar/i)
    if (pointsPerDollarMatch) {
      const points = Number.parseFloat(pointsPerDollarMatch[1])
      earnAmount = points.toString()
      earnType = "points"
      earnDisplayText = `${points} points per dollar`
      console.log("⚡ Found points per dollar:", earnDisplayText)
    }
    // Priority 2: Check for percentage back in points
    else {
      const percentageBackMatch = text.match(/(\d+(?:\.\d+)?)\s*%\s*back\s+in\s+points/i)
      if (percentageBackMatch) {
        const percentage = Number.parseFloat(percentageBackMatch[1])
        earnAmount = (percentage * 10).toString() // 15% → 150 points per dollar
        earnType = "points"
        earnDisplayText = `${percentage}% back in points`
        console.log("⚡ Found percentage back in points:", earnDisplayText)
      }
      // Priority 3: Check for fixed dollar amounts back in points
      else {
        const dollarBackMatch = text.match(/\$(\d+(?:\.\d+)?)\s+(?:back\s+in\s+points|in\s+points)/i)
        if (dollarBackMatch) {
          const dollars = Number.parseFloat(dollarBackMatch[1])
          earnAmount = (dollars * 1000).toString() // $50 → 50000 points
          earnType = "points"
          earnDisplayText = `$${dollars} back in points`
          console.log("⚡ Found dollar amount back in points:", earnDisplayText)
        }
        // Priority 4: Check for percentage cashback (CORRECTED - treat as points)
        else {
          const cashbackMatch = text.match(/(\d+(?:\.\d+)?)\s*%\s*cashback/i)
          if (cashbackMatch) {
            const percentage = Number.parseFloat(cashbackMatch[1])
            earnAmount = (percentage * 10).toString() // 25% cashback → 250 points per dollar
            earnType = "points"
            earnDisplayText = `${percentage}% cashback`
            console.log("⚡ Found cashback (treated as points):", earnDisplayText)
          }
          // Priority 5: Check for percentage discounts (lowest priority, only if no points/cashback)
          else {
            const percentageOffMatch = text.match(/(\d+(?:\.\d+)?)\s*%\s*off/i)
            if (percentageOffMatch) {
              // Check if there are also points/cashback mentioned - if so, ignore the discount
              const hasPointsOrCashback = text.match(
                /(points?\s+per\s+dollar|%\s*(?:back|cashback)|\$\d+\s+(?:back|in\s+points))/i,
              )

              if (!hasPointsOrCashback) {
                const percentage = Number.parseFloat(percentageOffMatch[1])
                earnAmount = percentage.toString()
                earnType = "percentage"
                earnDisplayText = `${percentage}% off`
                console.log("⚡ Found percentage discount (no points/cashback present):", earnDisplayText)
              } else {
                console.log("⚡ Ignoring percentage discount due to points/cashback present")
                // Re-extract the points/cashback that we might have missed
                const pointsMatch = text.match(/(\d+)\s+points?\s+per\s+dollar/i)
                const cashbackMatch2 = text.match(/(\d+(?:\.\d+)?)\s*%\s*(?:back|cashback)/i)

                if (pointsMatch) {
                  const points = Number.parseFloat(pointsMatch[1])
                  earnAmount = points.toString()
                  earnType = "points"
                  earnDisplayText = `${points} points per dollar`
                } else if (cashbackMatch2) {
                  const percentage = Number.parseFloat(cashbackMatch2[1])
                  earnAmount = (percentage * 10).toString()
                  earnType = "points"
                  earnDisplayText = `${percentage}% cashback`
                }
              }
            }
          }
        }
      }
    }

    // Extract point expiry
    let simplePointExpiry = ""
    const expiryMatch = text.match(/(?:available for (?:the )?next|expire[sd]? after) (\d+) days/i)
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

    // Premium members
    if (text.toLowerCase().includes("premium members only")) {
      offerRules["Membership Level Required"] = "Premium"
    }

    // VIP mentions
    if (text.toLowerCase().includes("vip")) {
      const vipMatch = text.match(/VIP\s+(\w+)/i)
      if (vipMatch) {
        offerRules["Membership Level Required"] = `VIP ${vipMatch[1]}`
      } else {
        offerRules["Membership Level Required"] = "VIP"
      }
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

    // Customer Segment - segment_fashion_lovers
    if (text.includes("segment_fashion_lovers")) {
      offerRules["Customer Segment"] = "segment_fashion_lovers"
    }

    // Eligible Products
    const productMatch = text.match(/(?:applicable )?only on ([^.]+)/i)
    if (productMatch) {
      offerRules["Eligible Products"] = productMatch[1].trim()
    }

    // Includes products
    const includesMatch = text.match(/includes\s+([^.]+)/i)
    if (includesMatch) {
      offerRules["Included Categories"] = includesMatch[1].trim()
    }

    // Minimum purchase
    const minPurchaseMatch = text.match(/minimum\s+purchase\s+\$(\d+)/i)
    if (minPurchaseMatch) {
      offerRules["Minimum Purchase"] = `$${minPurchaseMatch[1]}`
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
