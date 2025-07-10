import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  console.log("🤖 === OPENAI EXTRACTION API CALLED ===")

  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ success: false, error: "Text is required" }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
        },
        { status: 500 },
      )
    }

    console.log("🤖 Using OpenAI GPT-4o for extraction...")
    console.log("🤖 Input text:", text.substring(0, 200) + "...")

    const result = await generateText({
      model: openai("gpt-4o"),
      temperature: 0.3,
      prompt: `You are an expert offer data extraction system. Extract offer details from the following text and create compelling marketing copy.

EXTRACTION RULES:
1. Extract only information explicitly mentioned in the text
2. Generate creative headlines and bodylines based on the offer content
3. Apply correct points conversion logic
4. Extract ALL rules and conditions mentioned

POINTS CONVERSION:
- For "15% back in points": earnAmount="150", earnType="points", earnDisplayText="15% back in points"
- For "$50 in points": earnAmount="50000", earnType="points", earnDisplayText="$50 in points"  
- For "15% cashback": earnAmount="15", earnType="cashback", earnDisplayText="15% cashback"

CREATIVE COPY:
- offerHeadline: Catchy headline under 30 characters
- offerBodyline: Engaging description under 75 characters

RULES EXTRACTION:
Extract conditions like:
- "Member Tier as VIP Gold" → "Membership Level Required": "VIP Gold"
- "member segment_house_owner" → "Customer Segment": "segment_house_owner"
- "applicable only on Washer and Dryers" → "Eligible Products": "Washer and Dryers"

TEXT TO ANALYZE:
${text}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "offerName": "extracted brand/product name",
  "offerHeadline": "creative catchy headline under 30 chars",
  "offerBodyline": "engaging description under 75 chars",
  "offerStartDate": "YYYY-MM-DD or empty string",
  "offerEndDate": "YYYY-MM-DD or empty string",
  "earnAmount": "numeric value as string",
  "earnType": "points, cashback, or percentage",
  "earnDisplayText": "original display text for rewards",
  "simplePointExpiry": "point expiry information",
  "rules": {
    "rule_name": "rule_value"
  }
}`,
    })

    console.log("🤖 ✅ OpenAI extraction successful")
    console.log("🤖 Raw result:", result.text)

    // Parse the JSON response
    let parsedResult
    try {
      // Clean the response to ensure it's valid JSON
      let cleanedText = result.text.trim()

      // Remove markdown code blocks if present
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.replace(/```json\n?/, "").replace(/\n?```$/, "")
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/```\n?/, "").replace(/\n?```$/, "")
      }

      parsedResult = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error("🤖 ❌ JSON parsing failed:", parseError)
      console.error("🤖 Raw text:", result.text)
      throw new Error("Failed to parse OpenAI response as JSON")
    }

    // Process the result and add manual fallbacks
    const finalRules = parsedResult.rules || {}

    // Manual fallback for common patterns OpenAI might miss
    if (text.includes("Member Tier as")) {
      const tierMatch = text.match(/Member Tier as ([^.]+)/i)
      if (tierMatch && !finalRules["Membership Level Required"]) {
        finalRules["Membership Level Required"] = tierMatch[1].trim()
        console.log("🤖 Manual: Found Member Tier:", tierMatch[1].trim())
      }
    }

    if (text.includes("segment_house_owner") && !finalRules["Customer Segment"]) {
      finalRules["Customer Segment"] = "segment_house_owner"
      console.log("🤖 Manual: Found segment_house_owner")
    }

    if (text.includes("segment_Age_")) {
      const ageMatch = text.match(/segment_(Age_\d+_\d+)/i)
      if (ageMatch && !finalRules["Customer Segment"]) {
        finalRules["Customer Segment"] = `segment_${ageMatch[1]}`
        console.log("🤖 Manual: Found age segment:", `segment_${ageMatch[1]}`)
      }
    }

    if (text.includes("applicable only on") || text.includes("only on")) {
      const productMatch = text.match(/(?:applicable )?only on ([^.]+)/i)
      if (productMatch && !finalRules["Eligible Products"]) {
        finalRules["Eligible Products"] = productMatch[1].trim()
        console.log("🤖 Manual: Found products:", productMatch[1].trim())
      }
    }

    // Manual points conversion fallback
    let finalEarnAmount = parsedResult.earnAmount
    let finalEarnType = parsedResult.earnType
    let finalEarnDisplayText = parsedResult.earnDisplayText

    if (!finalEarnAmount || !finalEarnDisplayText) {
      console.log("🤖 ⚠️ Manual points conversion fallback...")

      const percentageMatch = text.match(/(\d+(?:\.\d+)?)\s*%\s*back\s+in\s+points/i)
      if (percentageMatch) {
        const percentage = Number.parseFloat(percentageMatch[1])
        finalEarnAmount = (percentage * 10).toString()
        finalEarnType = "points"
        finalEarnDisplayText = `${percentage}% back in points`
        console.log("🤖 Manual: Converted", percentage + "% →", finalEarnAmount, "points per dollar")
      }

      const dollarMatch = text.match(/\$(\d+(?:\.\d+)?)\s+in\s+points/i)
      if (dollarMatch) {
        const dollars = Number.parseFloat(dollarMatch[1])
        finalEarnAmount = (dollars * 1000).toString()
        finalEarnType = "points"
        finalEarnDisplayText = `$${dollars} in points`
        console.log("🤖 Manual: Converted $" + dollars + " →", finalEarnAmount, "total points")
      }

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
      offerName: parsedResult.offerName || "",
      offerHeadline: parsedResult.offerHeadline || "",
      offerBodyline: parsedResult.offerBodyline || "",
      offerStartDate: parsedResult.offerStartDate || "",
      offerEndDate: parsedResult.offerEndDate || "",
      earnAmount: finalEarnAmount || "",
      earnType: finalEarnType || "",
      earnDisplayText: finalEarnDisplayText || "",
      simplePointExpiry: parsedResult.simplePointExpiry || "",
      offerDescription: text.trim(),
      offerRules: finalRules,
    }

    console.log("🤖 Final data being returned:", finalData)
    console.log("🤖 Final rules count:", Object.keys(finalData.offerRules).length)

    return NextResponse.json({
      success: true,
      data: finalData,
    })
  } catch (error) {
    console.error("🤖 ❌ OpenAI extraction error:", error)
    console.error("🤖 Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack?.split("\n").slice(0, 3),
    })

    let errorMessage = "OpenAI extraction failed"
    if (error.message?.includes("JSON")) {
      errorMessage = "OpenAI response parsing error. The AI response was not valid JSON."
    } else if (error.message?.includes("API key")) {
      errorMessage = "Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable."
    } else if (error.message?.includes("quota")) {
      errorMessage = "OpenAI API quota exceeded. Please check your OpenAI account."
    } else if (error.message?.includes("rate limit")) {
      errorMessage = "OpenAI API rate limit exceeded. Please try again in a moment."
    }

    return NextResponse.json(
      {
        success: false,
        error: `${errorMessage}: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
