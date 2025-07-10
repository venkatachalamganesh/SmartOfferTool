import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("🖼️ === OPENAI DALL-E IMAGE GENERATION ===")

  try {
    const { prompt, offerName, earnAmount, earnType } = await request.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 })
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.log("🖼️ ❌ No OpenAI API key found")
      return NextResponse.json(
        {
          success: false,
          error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
        },
        { status: 500 },
      )
    }

    console.log("🖼️ Using OpenAI DALL-E for image generation...")
    console.log("🖼️ Prompt:", prompt)

    // Enhanced prompt for better offer images
    const enhancedPrompt = `Create a professional promotional offer image for "${offerName}". 
    ${prompt}
    
    Style: Clean, modern, professional marketing design
    Layout: Product/brand focus with clear text space
    Colors: Brand-appropriate colors
    Quality: High-resolution, commercial-ready
    Text: Minimal text, focus on visual appeal
    ${earnAmount && earnType ? `Include visual elements suggesting ${earnAmount}% ${earnType} reward` : ""}
    
    Make it suitable for e-commerce promotional use.`

    // Note: This is a conceptual example - actual DALL-E integration would require
    // the OpenAI images API, not the AI SDK
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.log("🖼️ DALL-E API error:", errorData)
      throw new Error(`DALL-E API failed: ${response.status} - ${errorData.error?.message || "Unknown error"}`)
    }

    const data = await response.json()
    console.log("🖼️ ✅ DALL-E image generated successfully")

    return NextResponse.json({
      success: true,
      imageUrl: data.data[0].url,
      revisedPrompt: data.data[0].revised_prompt,
      cost: "~$0.04", // DALL-E 3 standard pricing
    })
  } catch (error) {
    console.error("🖼️ === DALL-E IMAGE GENERATION ERROR ===")
    console.error("🖼️ Error:", error.message)

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        note: "DALL-E image generation requires additional OpenAI API costs (~$0.04 per image)",
      },
      { status: 500 },
    )
  }
}
