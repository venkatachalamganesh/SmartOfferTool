import { type NextRequest, NextResponse } from "next/server"

// Test multiple possible Ollama endpoints
const OLLAMA_ENDPOINTS = [
  "http://localhost:11434",
  "http://127.0.0.1:11434",
  "http://0.0.0.0:11434",
  "http://host.docker.internal:11434", // For Docker environments
]

async function testOllamaEndpoint(baseUrl: string) {
  try {
    console.log(`🦙 Testing endpoint: ${baseUrl}`)

    const response = await fetch(`${baseUrl}/api/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(3000),
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`✅ ${baseUrl} is working!`)
      return { success: true, baseUrl, data }
    } else {
      console.log(`❌ ${baseUrl} returned status: ${response.status}`)
      return { success: false, error: `HTTP ${response.status}` }
    }
  } catch (error) {
    console.log(`❌ ${baseUrl} failed:`, error.message)
    return { success: false, error: error.message }
  }
}

async function findWorkingOllamaEndpoint() {
  console.log("🔍 Searching for working Ollama endpoint...")

  for (const endpoint of OLLAMA_ENDPOINTS) {
    const result = await testOllamaEndpoint(endpoint)
    if (result.success) {
      return result
    }
  }

  return {
    success: false,
    error: "No working Ollama endpoint found. Tried: " + OLLAMA_ENDPOINTS.join(", "),
  }
}

export async function POST(request: NextRequest) {
  console.log("🦙 === API ROUTE CALLED ===")

  try {
    const body = await request.json()
    const { action, ...rest } = body

    console.log("🦙 Action:", action)
    console.log("🦙 Request body keys:", Object.keys(body))

    // Basic environment info (safe to log)
    console.log("🦙 Environment info:", {
      NODE_ENV: process.env.NODE_ENV,
      platform: process.platform,
      // Remove hostname() call that might be causing issues
    })

    if (action === "test") {
      console.log("🦙 Starting connection test...")

      // Test connection with multiple endpoints
      const result = await findWorkingOllamaEndpoint()

      if (!result.success) {
        console.log("🦙 No working endpoint found:", result.error)
        return NextResponse.json({
          success: false,
          error: result.error,
          debug: {
            testedEndpoints: OLLAMA_ENDPOINTS,
            suggestion: "Make sure 'ollama serve' is running and accessible",
            platform: process.platform,
          },
        })
      }

      console.log("🦙 Found working endpoint:", result.baseUrl)
      const hasLlama = result.data.models?.some((m: any) => m.name.includes("llama3.1"))

      return NextResponse.json({
        success: true,
        models: result.data.models,
        hasLlama,
        workingEndpoint: result.baseUrl,
        message: `Connected to ${result.baseUrl} - Found ${result.data.models?.length || 0} models, Llama 3.1: ${hasLlama ? "✅" : "❌"}`,
      })
    }

    if (action === "generate") {
      console.log("🦙 Starting generation...")

      // Find working endpoint first
      const connectionResult = await findWorkingOllamaEndpoint()

      if (!connectionResult.success) {
        throw new Error(`No working Ollama endpoint: ${connectionResult.error}`)
      }

      console.log("🦙 Using endpoint:", connectionResult.baseUrl)
      console.log("🦙 Prompt length:", rest.prompt?.length || 0)

      const response = await fetch(`${connectionResult.baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.1:8b",
          prompt: rest.prompt,
          stream: false,
          options: {
            temperature: 0.1,
            num_predict: 500,
          },
        }),
        signal: AbortSignal.timeout(30000),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.log("🦙 Generation failed:", response.status, errorText)
        throw new Error(`Generation failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("🦙 Generation successful, response length:", data.response?.length || 0)

      return NextResponse.json({
        success: true,
        response: data.response,
        endpoint: connectionResult.baseUrl,
      })
    }

    console.log("🦙 Invalid action:", action)
    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("🦙 === API ROUTE ERROR ===")
    console.error("🦙 Error name:", error.name)
    console.error("🦙 Error message:", error.message)
    console.error("🦙 Error stack:", error.stack)

    // Provide helpful debugging information
    const debugInfo = {
      error: error.message,
      errorName: error.name,
      platform: process.platform,
      suggestions: [
        "1. Check if 'ollama serve' is running in terminal",
        "2. Try: curl http://localhost:11434/api/tags",
        "3. If in Docker/container, Ollama might not be accessible",
        "4. Consider using the Regex method instead",
        "5. If on Vercel preview, local Ollama won't be accessible",
      ],
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        debug: debugInfo,
      },
      { status: 500 },
    )
  }
}
