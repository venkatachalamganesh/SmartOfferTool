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

    const prompt = `Extract offer details from the following text and return ONLY a valid JSON object with these exact fields:

{
  "offerName": "brand or product name",
  "offerHeadline": "catchy marketing headline (generate if not present)",
  "offerBodyline": "engaging description (generate if not present)", 
  "earnAmount": "numeric value only",
  "earnType": "points, cashback, percentage, or fixed",
  "earnDisplayText": "how reward is displayed to user",
  "offerStartDate": "YYYY-MM-DD format",
  "offerEndDate": "YYYY-MM-DD format", 
  "simplePointExpiry": "expiry description",
  "offerRules": {
    "rule_name": "rule_value"
  }
}

Text to extract from:
${text}

Return ONLY the JSON object, no other text or formatting.`

    const result = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 1000,
      temperature: 0.3,
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
