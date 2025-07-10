"use server"

// Simple test to debug Ollama connection
export async function testOllamaDirectly() {
  console.log("🔧 Direct Ollama test starting...")

  try {
    // Test 1: Basic connection
    console.log("Test 1: Basic connection to localhost:11434")
    const response1 = await fetch("http://localhost:11434/api/tags", {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    })

    console.log("Response 1 status:", response1.status)

    if (response1.ok) {
      const data1 = await response1.json()
      console.log("✅ Basic connection works!")
      console.log("Models found:", data1.models?.length || 0)

      // Test 2: Simple generation
      console.log("Test 2: Simple generation test")
      const response2 = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.1:8b",
          prompt: 'Say hello in JSON format: {"message": "your response"}',
          stream: false,
          options: { num_predict: 50 },
        }),
        signal: AbortSignal.timeout(10000),
      })

      console.log("Response 2 status:", response2.status)

      if (response2.ok) {
        const data2 = await response2.json()
        console.log("✅ Generation works!")
        console.log("Response:", data2.response)

        return {
          success: true,
          message: "Both connection and generation work!",
          models: data1.models,
          testResponse: data2.response,
        }
      } else {
        const errorText = await response2.text()
        return {
          success: false,
          message: "Connection works but generation failed",
          error: errorText,
        }
      }
    } else {
      const errorText = await response1.text()
      return {
        success: false,
        message: "Basic connection failed",
        error: errorText,
      }
    }
  } catch (error) {
    console.error("Direct test failed:", error)
    return {
      success: false,
      message: "Test failed with exception",
      error: error.message,
    }
  }
}
