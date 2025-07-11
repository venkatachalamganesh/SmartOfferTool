import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ success: false, error: "Invalid input text" }, { status: 400 })
    }

    console.log("🤖 === OPENAI EXTRACTION API ===")
    console.log("🤖 Input text:", text.substring(0, 100) + "...")

    const prompt = `Extract offer details from the following text and return ONLY a valid JSON object. Pay careful attention to different types of rewards:

REWARD TYPES & CALCULATIONS:
1. Percentage discount: "20% off" → earnType: "percentage", earnAmount: "20", earnDisplayText: "20% off"
2. Percentage cashback: "25% cashback" → earnType: "points", earnAmount: "250", earnDisplayText: "25% cashback"  
3. Points back percentage: "15% back in points" → earnType: "points", earnAmount: "150", earnDisplayText: "15% back in points"
4. Points per dollar: "200 points per dollar" → earnType: "points", earnAmount: "200", earnDisplayText: "200 points per dollar"
5. Fixed dollar amount: "$50 back in points" → earnType: "points", earnAmount: "50000", earnDisplayText: "$50 back in points"

CRITICAL CALCULATION RULES:
- For percentage discounts: use percentage as-is (20% off → earnAmount: "20")
- For percentage cashback: multiply by 10 (25% cashback → earnAmount: "250", earnType: "points")
- For percentage back in points: multiply by 10 (15% back → earnAmount: "150", earnType: "points")
- For points per dollar: use the number as-is (200 points → earnAmount: "200", earnType: "points")
- For fixed dollar amounts in points: multiply by 1000 ($50 → earnAmount: "50000", earnType: "points")

MIXED OFFERS:
If text contains BOTH discount AND points/cashback, ONLY extract the points/cashback reward (ignore instant discounts):
- "20% off + 200 points per dollar" → earnType: "points", earnAmount: "200", earnDisplayText: "200 points per dollar"
- "15% off + 10% cashback" → earnType: "points", earnAmount: "100", earnDisplayText: "10% cashback"

IMPORTANT: Cashback is treated as points rewards, not instant discounts.

Return JSON with these exact fields:
{
  "offerName": "brand or product name from text",
  "offerHeadline": "catchy marketing headline (generate if not present)",
  "offerBodyline": "engaging description (generate if not present)", 
  "earnAmount": "calculated numeric value based on rules above",
  "earnType": "percentage or points (cashback becomes points)",
  "earnDisplayText": "exactly how reward should be displayed to user",
  "offerStartDate": "YYYY-MM-DD format if dates mentioned",
  "offerEndDate": "YYYY-MM-DD format if dates mentioned", 
  "simplePointExpiry": "expiry description if mentioned",
  "offerRules": {
    "rule_name": "rule_value for any conditions mentioned"
  }
}

EXAMPLES:
Text: "get 20% off all electronics"
→ earnType: "percentage", earnAmount: "20", earnDisplayText: "20% off"

Text: "25% cashback on designer clothing"
→ earnType: "points", earnAmount: "250", earnDisplayText: "25% cashback"

Text: "get 15% back in points" 
→ earnType: "points", earnAmount: "150", earnDisplayText: "15% back in points"

Text: "earn 200 points per dollar"
→ earnType: "points", earnAmount: "200", earnDisplayText: "200 points per dollar"

Text: "get $50 back in points"
→ earnType: "points", earnAmount: "50000", earnDisplayText: "$50 back in points"

Text: "20% off + earn 200 points per dollar"
→ earnType: "points", earnAmount: "200", earnDisplayText: "200 points per dollar"

Text to extract from:
${text}

Return ONLY the JSON object, no other text or formatting.`

    const result = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 1000,
      temperature: 0.1,
    })

    console.log("🤖 OpenAI raw response:", result.text)

    // Clean the response
    let jsonText = result.text.trim()

    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\s*/, "").replace(/```\s*$/, "")
    jsonText = jsonText.replace(/```\s*/, "")

    // Try to parse JSON
    let extractedData
    try {
      extractedData = JSON.parse(jsonText)
    } catch (parseError) {
      console.error("🤖 JSON parse error:", parseError)
      console.error("🤖 Raw text:", jsonText)

      // Try to extract JSON from the text
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          extractedData = JSON.parse(jsonMatch[0])
        } catch (secondParseError) {
          throw new Error("Could not parse OpenAI response as JSON")
        }
      } else {
        throw new Error("No JSON found in OpenAI response")
      }
    }

    // Validate and clean the extracted data
    const cleanedData = {
      offerName: extractedData.offerName || "",
      offerHeadline: extractedData.offerHeadline || "",
      offerBodyline: extractedData.offerBodyline || "",
      earnAmount: extractedData.earnAmount || "",
      earnType: extractedData.earnType || "",
      earnDisplayText: extractedData.earnDisplayText || "",
      offerStartDate: extractedData.offerStartDate || "",
      offerEndDate: extractedData.offerEndDate || "",
      simplePointExpiry: extractedData.simplePointExpiry || "",
      offerRules: extractedData.offerRules || {},
    }

    console.log("🤖 ✅ Cleaned extracted data:", cleanedData)

    return NextResponse.json({
      success: true,
      data: cleanedData,
    })
  } catch (error) {
    console.error("🤖 ❌ OpenAI extraction error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || "OpenAI extraction failed",
      },
      { status: 500 },
    )
  }
}
