import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

// Enhanced schema with better segment handling
const offerExtractionSchema = z.object({
  offerName: z.string().max(30).optional().describe("Short offer name, max 30 characters"),
  offerHeadline: z.string().max(30).describe("REQUIRED: Creative catchy headline, max 30 characters"),
  offerBodyline: z.string().max(75).describe("REQUIRED: Engaging description, max 75 characters"),
  offerStartDate: z.string().optional().describe("Start date in YYYY-MM-DD format if mentioned"),
  offerEndDate: z.string().optional().describe("End date in YYYY-MM-DD format if mentioned"),
  earnAmount: z
    .string()
    .optional()
    .describe(
      "Numeric value - for percentage: points per dollar (e.g., '150' for 15%), for flat: total points (e.g., '50000' for $50)",
    ),
  earnType: z.enum(["percentage", "points", "cashback"]).optional().describe("Type of reward"),
  earnDisplayText: z
    .string()
    .optional()
    .describe("Original display text (e.g., '15% back in points' or '$50 in points')"),
  simplePointExpiry: z.string().optional().describe("Point expiry in 'Points expire X days after earning date' format"),
  rules: z
    .record(z.string(), z.string())
    .optional()
    .describe("Extract ALL rules and conditions with intelligent labels"),
})

export async function POST(request: NextRequest) {
  console.log("🤖 === OPENAI EXTRACTION API CALLED ===")

  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ success: false, error: "Text is required" }, { status: 400 })
    }

    console.log("🤖 Input text length:", text.length)
    console.log("🤖 Input preview:", text.substring(0, 300) + "...")

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.log("🤖 ❌ No OpenAI API key found")
      return NextResponse.json(
        {
          success: false,
          error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
        },
        { status: 500 },
      )
    }

    console.log("🤖 Using OpenAI GPT-4o for extraction...")

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: offerExtractionSchema,
      temperature: 0.3,
      prompt: `You are an expert offer data extraction and marketing copy generation system. Extract offer details from the following text and create compelling marketing copy.

CRITICAL REQUIREMENTS:
1. ONLY extract information that is explicitly mentioned in the text
2. Do NOT invent or assume dates, amounts, or other details
3. If end date is not mentioned, leave offerEndDate empty/undefined
4. If start date is not mentioned, leave offerStartDate empty/undefined
5. Extract ALL rules and conditions that are mentioned
6. ALWAYS generate creative headline and bodyline based on the offer content

POINTS CONVERSION LOGIC - VERY IMPORTANT:
- Conversion rate: $1 = 1000 points
- For PERCENTAGE rewards (e.g., "15% back in points"):
  * earnAmount: Calculate points per dollar (15% × 10 = "150")
  * earnType: "points"
  * earnDisplayText: Keep original format ("15% back in points")
- For FLAT DOLLAR rewards (e.g., "$50 in points"):
  * earnAmount: Convert to total points ($50 × 1000 = "50000")
  * earnType: "points" 
  * earnDisplayText: Keep original format ("$50 in points")
- For CASHBACK (e.g., "15% cashback"):
  * earnAmount: Keep percentage value ("15")
  * earnType: "cashback"
  * earnDisplayText: "15% cashback"

EXPIRY CONVERSION:
- "available for X days" → "Points expire X days after earning date"
- "next 30 days" → "Points expire 30 days after earning date"

CREATIVE COPY GENERATION:
- offerHeadline: Create a catchy, exciting headline (max 30 chars) that captures the essence of the offer
- offerBodyline: Write an engaging description (max 75 chars) that highlights the key benefit

HEADLINE EXAMPLES:
- "Appliance Deals & Rewards!" (for Kenmore appliances)
- "Premium Denim Savings!" (for Levi's jeans)  
- "Tech Rewards & Cashback!" (for electronics)
- "Home Upgrade Specials!" (for home goods)

BODYLINE EXAMPLES:
- "Save on Kenmore appliances and earn rewards!"
- "Get premium Levi's jeans and earn points!"
- "Upgrade your tech and earn rewards today!"

EXTRACTION GUIDELINES:
- Extract offer name from brand/product mentions (max 30 chars)
- Convert dates to YYYY-MM-DD format ONLY if mentioned (assume 2025 if year not specified)
- Apply points conversion logic correctly based on reward type

RULES EXTRACTION - CRITICAL FOR SEGMENTS:
Extract ALL conditions, restrictions, and requirements mentioned in the text.
Use intelligent labels like:
- "Membership Level Required" for tier info (e.g., "VIP Gold")
- "Customer Segment" for segment info (e.g., "segment_house_owner", "segment_Age_20_30")
- "Eligible Products" for product restrictions (e.g., "Washer and Dryers")
- "Geographic Restriction" for location limits
- "Minimum Purchase Required" for spending requirements
- "Age Requirement" for age restrictions
- "Store Requirement" for retailer restrictions

SPECIFIC SEGMENT PATTERNS TO LOOK FOR - VERY IMPORTANT:
- "Member Tier as [VALUE]" → "Membership Level Required": "[VALUE]"
- "member segment_house_owner" → "Customer Segment": "segment_house_owner"
- "member segment_Age_20_30" → "Customer Segment": "segment_Age_20_30"
- "member segment as [VALUE]" → "Customer Segment": "[VALUE]"
- "segment__house_owner" → "Customer Segment": "segment__house_owner"
- "applicable only on [VALUE]" → "Eligible Products": "[VALUE]"
- "only on [VALUE]" → "Eligible Products": "[VALUE]"

SEGMENT EXTRACTION EXAMPLES:
- "member segment_house_owner" → "Customer Segment": "segment_house_owner"
- "member segment_Age_20_30" → "Customer Segment": "segment_Age_20_30"
- "member segment as segment__house_owner" → "Customer Segment": "segment__house_owner"

DATE EXTRACTION EXAMPLES:
- "from July 15th" → offerStartDate: "2025-07-15", offerEndDate: undefined
- "starting July 15th" → offerStartDate: "2025-07-15", offerEndDate: undefined  
- "between July 15th and July 22nd" → offerStartDate: "2025-07-15", offerEndDate: "2025-07-22"

POINTS CONVERSION EXAMPLES:
- "15% back in points" → earnAmount: "150", earnType: "points", earnDisplayText: "15% back in points"
- "10% back in points" → earnAmount: "100", earnType: "points", earnDisplayText: "10% back in points"
- "$50 in points" → earnAmount: "50000", earnType: "points", earnDisplayText: "$50 in points"
- "10% cashback" → earnAmount: "10", earnType: "cashback", earnDisplayText: "10% cashback"

TEXT TO ANALYZE:
${text}

Remember: 
- Extract ALL conditions mentioned, especially segment patterns
- Generate creative, engaging headlines and bodylines
- Apply correct points conversion logic
- Only extract dates that are explicitly mentioned
- Keep original display format for rewards
- Pay special attention to segment_XXXXX patterns`,
    })

    console.log("🤖 ✅ OpenAI extraction successful")
    console.log("🤖 Raw result object:", result.object)
    console.log("🤖 Generated headline:", result.object.offerHeadline)
    console.log("🤖 Generated bodyline:", result.object.offerBodyline)
    console.log("🤖 Earn amount (converted):", result.object.earnAmount)
    console.log("🤖 Earn display text:", result.object.earnDisplayText)
    console.log("🤖 Rules from OpenAI:", result.object.rules)
    console.log("🤖 Rules count:", Object.keys(result.object.rules || {}).length)
    console.log("🤖 Start date:", result.object.offerStartDate)
    console.log("🤖 End date:", result.object.offerEndDate)

    // Ensure rules is properly handled
    const finalRules = result.object.rules || {}

    // Enhanced manual fallback extraction for segment patterns if OpenAI missed them
    if (Object.keys(finalRules).length < 2) {
      console.log("🤖 ⚠️ OpenAI may have missed some rules, attempting enhanced manual extraction...")

      // Pattern 1: Member Tier as VIP Gold
      if (text.includes("Member Tier as")) {
        const tierMatch = text.match(/Member Tier as ([^.]+)/i)
        if (tierMatch && !finalRules["Membership Level Required"]) {
          finalRules["Membership Level Required"] = tierMatch[1].trim()
          console.log("🤖 Manual: Found Member Tier:", tierMatch[1].trim())
        }
      }

      // Pattern 2: Enhanced segment detection
      if (!finalRules["Customer Segment"]) {
        // Test for segment_house_owner
        if (text.includes("segment_house_owner")) {
          finalRules["Customer Segment"] = "segment_house_owner"
          console.log("🤖 Manual: Found segment_house_owner")
        }
        // Test for segment_Age_XX_XX
        else if (text.includes("segment_Age_")) {
          const ageMatch = text.match(/segment_(Age_\d+_\d+)/i)
          if (ageMatch) {
            finalRules["Customer Segment"] = `segment_${ageMatch[1]}`
            console.log("🤖 Manual: Found age segment:", `segment_${ageMatch[1]}`)
          }
        }
        // Test for segment as format
        else if (text.includes("member segment as")) {
          const segmentMatch = text.match(/member segment as ([^.\s]+)/i)
          if (segmentMatch) {
            finalRules["Customer Segment"] = segmentMatch[1].trim()
            console.log("🤖 Manual: Found segment with 'as':", segmentMatch[1].trim())
          }
        }
      }

      // Pattern 3: applicable only on / only on
      if (text.includes("applicable only on") || text.includes("only on")) {
        const productMatch = text.match(/(?:applicable )?only on ([^.]+)/i)
        if (productMatch && !finalRules["Eligible Products"]) {
          finalRules["Eligible Products"] = productMatch[1].trim()
          console.log("🤖 Manual: Found products:", productMatch[1].trim())
        }
      }

      console.log("🤖 Enhanced manual fallback rules:", finalRules)
    }

    // Manual points conversion fallback if OpenAI didn't handle it correctly
    let finalEarnAmount = result.object.earnAmount
    let finalEarnType = result.object.earnType
    let finalEarnDisplayText = result.object.earnDisplayText

    if (!finalEarnAmount || !finalEarnDisplayText) {
      console.log("🤖 ⚠️ Manual points conversion fallback...")

      // Check for percentage pattern
      const percentageMatch = text.match(/(\d+(?:\.\d+)?)\s*%\s*back\s+in\s+points/i)
      if (percentageMatch) {
        const percentage = Number.parseFloat(percentageMatch[1])
        finalEarnAmount = (percentage * 10).toString() // 15% → 150 points per dollar
        finalEarnType = "points"
        finalEarnDisplayText = `${percentage}% back in points`
        console.log("🤖 Manual: Converted", percentage + "% →", finalEarnAmount, "points per dollar")
      }

      // Check for flat dollar pattern
      const dollarMatch = text.match(/\$(\d+(?:\.\d+)?)\s+in\s+points/i)
      if (dollarMatch) {
        const dollars = Number.parseFloat(dollarMatch[1])
        finalEarnAmount = (dollars * 1000).toString() // $50 → 50000 points
        finalEarnType = "points"
        finalEarnDisplayText = `$${dollars} in points`
        console.log("🤖 Manual: Converted $" + dollars + " →", finalEarnAmount, "total points")
      }

      // Check for cashback pattern
      const cashbackMatch = text.match(/(\d+(?:\.\d+)?)\s*%\s*cashback/i)
      if (cashbackMatch) {
        const percentage = Number.parseFloat(cashbackMatch[1])
        finalEarnAmount = percentage.toString()
        finalEarnType = "cashback"
        finalEarnDisplayText = `${percentage}% cashback`
        console.log("🤖 Manual: Found cashback:", finalEarnDisplayText)
      }
    }

    const finalData = {
      ...result.object,
      offerDescription: text.trim(),
      offerRules: finalRules,
      earnAmount: finalEarnAmount,
      earnType: finalEarnType,
      earnDisplayText: finalEarnDisplayText,
    }

    // Clean up undefined/null values but keep empty strings for optional fields
    Object.keys(finalData).forEach((key) => {
      if (finalData[key] === undefined || finalData[key] === null) {
        delete finalData[key]
      }
    })

    console.log("🤖 Final data being returned:", finalData)
    console.log("🤖 Final rules being returned:", finalData.offerRules)
    console.log("🤖 Final rules count:", Object.keys(finalData.offerRules || {}).length)
    console.log("🤖 Final customer segment:", finalData.offerRules?.["Customer Segment"])
    console.log("🤖 Final earn amount:", finalData.earnAmount)
    console.log("🤖 Final earn display:", finalData.earnDisplayText)

    return NextResponse.json({
      success: true,
      data: finalData,
    })
  } catch (error) {
    console.error("🤖 === OPENAI EXTRACTION ERROR ===")
    console.error("🤖 Error name:", error.name)
    console.error("🤖 Error message:", error.message)
    console.error("🤖 Full error:", error)

    // Handle specific OpenAI errors
    let errorMessage = error.message
    let suggestions = [
      "1. Ensure OPENAI_API_KEY is set in your environment variables",
      "2. Check your OpenAI account has sufficient credits",
      "3. Verify the API key has the correct permissions",
      "4. Try again in a few moments if rate limited",
    ]

    if (error.message?.includes("API key")) {
      errorMessage = "Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable."
    } else if (error.message?.includes("quota")) {
      errorMessage = "OpenAI API quota exceeded. Please check your OpenAI account."
    } else if (error.message?.includes("rate limit")) {
      errorMessage = "OpenAI API rate limit exceeded. Please try again in a moment."
    } else if (error.message?.includes("No object generated") || error.message?.includes("response did not match")) {
      errorMessage = "OpenAI response format error. The AI response didn't match expected format."
      suggestions = [
        "1. The input text might be too complex or ambiguous",
        "2. Try simplifying your offer description",
        "3. Ensure all key information is clearly stated",
        "4. Will fallback to regex extraction automatically",
      ]
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        debug: {
          originalError: error.message,
          errorType: error.name,
          suggestions,
        },
      },
      { status: 500 },
    )
  }
}
