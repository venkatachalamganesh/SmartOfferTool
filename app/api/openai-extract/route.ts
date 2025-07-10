import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ success: false, error: "No text provided" }, { status: 400 })
    }

    console.log("🤖 === OPENAI API ROUTE ===")
    console.log("🤖 Input text:", text.substring(0, 200) + "...")

    const prompt = `Extract offer details from this text and return ONLY a valid JSON object with these exact fields:

{
  "offerName": "Brand/Product name from the text",
  "offerHeadline": "Create a catchy marketing headline (max 60 chars)",
  "offerBodyline": "Create compelling body text (max 120 chars)", 
  "earnAmount": "Just the number (e.g., 15, 10, 25)",
  "earnType": "percentage, fixed, or points",
  "earnDisplayText": "User-friendly display (e.g., 15% off, $10 back)",
  "offerStartDate": "YYYY-MM-DD format or empty string",
  "offerEndDate": "YYYY-MM-DD format or empty string", 
  "simplePointExpiry": "Human readable (e.g., 30 days, 60 days)",
  "offerRules": {
    "Member Segment": "extracted segment (e.g., segment_house_owner)",
    "Member Tier": "extracted tier (e.g., VIP Gold)",
    "Eligible Products": "products mentioned",
    "Additional Rules": "any other conditions"
  }
}

Text to extract from: "${text}"

Return ONLY the JSON object, no markdown, no explanations, no code blocks.`

    const result = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.3,
      maxTokens: 1000,
    })

    console.log("🤖 OpenAI raw response:", result.text)

    // Clean the response - remove any markdown code blocks
    let cleanedResponse = result.text.trim()

    // Remove markdown code blocks if present
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.replace(/```json\s*/, "").replace(/\s*```$/, "")
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/```\s*/, "").replace(/\s*```$/, "")
    }

    console.log("🤖 Cleaned response:", cleanedResponse)

    // Parse the JSON
    let extractedData
    try {
      extractedData = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error("🤖 JSON parse error:", parseError)
      console.error("🤖 Failed to parse:", cleanedResponse)
      throw new Error("Invalid JSON response from OpenAI")
    }

    console.log("🤖 ✅ Successfully extracted data:", extractedData)

    return NextResponse.json({
      success: true,
      data: extractedData,
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
