"use client"

import { useState, useEffect } from "react"
import { X, Zap, AlertCircle, CheckCircle, Brain, Cpu, Palette, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { extractOfferWithRegex } from "../actions/extract-offer-local"
import { generateEnhancedThumbnail } from "../utils/canvas-image-generator"

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  onExtractData: (data: any) => void
}

function extractImageDetails(data: any, inputText: string) {
  console.log("🎨 === EXTRACTING IMAGE DETAILS ===")

  let extractedBrand = ""
  if (data.offerName) {
    extractedBrand = data.offerName.split(" ")[0]
  }

  let extractedProducts: string[] = []
  if (data.offerRules && typeof data.offerRules === "object") {
    const eligibleProducts = data.offerRules["Eligible Products"]
    if (eligibleProducts) {
      extractedProducts = eligibleProducts.split(" and ").map((p: string) => p.trim())
    }
  }

  if (extractedProducts.length === 0) {
    const productMatches = inputText.match(/(?:on|for)\s+([^.]+?)(?:\s+and\s+get|\s+between|\.|$)/i)
    if (productMatches) {
      extractedProducts = [productMatches[1].trim()]
    }
  }

  let extractedCategory = ""
  const allText = (inputText + " " + (data.offerName || "")).toLowerCase()

  if (
    allText.includes("appliance") ||
    extractedProducts.some((p) => p.toLowerCase().includes("washer") || p.toLowerCase().includes("dryer"))
  ) {
    extractedCategory = "appliances"
  } else if (allText.includes("clothing") || allText.includes("jeans") || allText.includes("denim")) {
    extractedCategory = "clothing"
  } else if (allText.includes("shoes") || allText.includes("sneakers")) {
    extractedCategory = "footwear"
  } else if (allText.includes("electronics") || allText.includes("tech")) {
    extractedCategory = "electronics"
  }

  console.log("🎨 Extracted brand:", extractedBrand)
  console.log("🎨 Extracted products:", extractedProducts)
  console.log("🎨 Extracted category:", extractedCategory)

  return {
    extractedBrand,
    extractedProducts,
    extractedCategory,
    extractedRules: data.offerRules || {},
  }
}

async function extractWithOpenAI(text: string) {
  const startTime = Date.now()

  try {
    console.log("🤖 === OPENAI EXTRACTION STARTING ===")

    const response = await fetch("/api/openai-extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(30000),
    })

    console.log("🤖 OpenAI API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || "OpenAI extraction failed")
    }

    const processingTime = Date.now() - startTime

    console.log("🤖 ✅ OpenAI extraction successful!")
    console.log("🤖 Processing time:", processingTime + "ms")
    console.log("🤖 Extracted data:", data.data)

    return {
      success: true,
      method: "openai",
      processingTime,
      data: data.data,
    }
  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error("🤖 ❌ OPENAI EXTRACTION FAILED:", error)

    return {
      success: false,
      method: "openai-failed",
      processingTime,
      error: error.message,
    }
  }
}

export default function ChatModal({ isOpen, onClose, onExtractData }: ChatModalProps) {
  const [inputText, setInputText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [chatHistory, setChatHistory] = useState<Array<{ type: "user" | "assistant"; message: string }>>([])
  const [extractionMethod, setExtractionMethod] = useState<"openai" | "regex">("openai")
  const [openaiStatus, setOpenaiStatus] = useState<"checking" | "ready" | "error">("checking")
  const [statusDetails, setStatusDetails] = useState<string>("")
  const [lastExtractionMethod, setLastExtractionMethod] = useState<string>("")
  const [lastProcessingTime, setLastProcessingTime] = useState<number>(0)

  useEffect(() => {
    if (isOpen) {
      checkOpenAIStatus()
    }
  }, [isOpen])

  const checkOpenAIStatus = async () => {
    try {
      setOpenaiStatus("checking")
      setStatusDetails("Testing OpenAI API connection...")
      console.log("🔍 Testing OpenAI API availability...")

      const testResponse = await fetch("/api/openai-extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: "Test offer: 10% off shoes for API testing" }),
        signal: AbortSignal.timeout(10000),
      })

      console.log("🔍 OpenAI status check response:", testResponse.status)

      if (testResponse.ok) {
        const testData = await testResponse.json()
        console.log("🔍 OpenAI status check data:", testData)

        if (testData.success) {
          setOpenaiStatus("ready")
          setStatusDetails("OpenAI GPT-4o is ready for intelligent extraction")
          console.log("🔍 ✅ OpenAI API is working correctly")
        } else {
          setOpenaiStatus("error")
          setStatusDetails(testData.error || "OpenAI test failed")
          setExtractionMethod("regex")
          console.log("🔍 ❌ OpenAI API test failed:", testData.error)
        }
      } else {
        const errorData = await testResponse.json().catch(() => ({}))
        setOpenaiStatus("error")
        setStatusDetails(errorData.error || `HTTP ${testResponse.status}`)
        setExtractionMethod("regex")
        console.log("🔍 ❌ OpenAI API status check failed")
      }
    } catch (error) {
      console.error("🔍 ❌ OpenAI status check failed with exception:", error)
      setOpenaiStatus("error")
      setStatusDetails(`Connection error: ${error.message}`)
      setExtractionMethod("regex")
    }
  }

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!inputText.trim()) return

    setIsProcessing(true)
    setLastExtractionMethod("")
    setLastProcessingTime(0)
    setChatHistory((prev) => [...prev, { type: "user", message: inputText }])

    try {
      let result

      if (extractionMethod === "openai") {
        console.log("🤖 === USING OPENAI EXTRACTION ===")
        result = await extractWithOpenAI(inputText)

        if (!result.success) {
          console.log("🔄 === FALLING BACK TO REGEX ===")
          console.log("🔄 OpenAI error:", result.error)
          const startTime = Date.now()
          const regexResult = await extractOfferWithRegex(inputText)
          const processingTime = Date.now() - startTime
          result = {
            ...regexResult,
            method: "regex-fallback",
            processingTime,
            openaiError: result.error,
          }
          console.log("🔄 === REGEX FALLBACK COMPLETE ===")
        }
      } else {
        console.log("⚡ === USING REGEX EXTRACTION ===")
        const startTime = Date.now()
        result = await extractOfferWithRegex(inputText)
        const processingTime = Date.now() - startTime
        result.method = "regex"
        result.processingTime = processingTime
        console.log("⚡ === REGEX EXTRACTION COMPLETE ===")
      }

      setLastExtractionMethod(result.method)
      setLastProcessingTime(result.processingTime || 0)

      if (result.success && result.data) {
        console.log("🎯 === PROCESSING EXTRACTED DATA ===")
        console.log("🎯 Raw extracted data:", result.data)

        const imageDetails = extractImageDetails(result.data, inputText)

        console.log("🎨 === ENHANCED CANVAS IMAGE GENERATION ===")
        const imageStartTime = Date.now()

        const offerImage = generateEnhancedThumbnail({
          offerName: result.data.offerName || "",
          earnAmount: result.data.earnAmount || "",
          earnType: result.data.earnType || "",
          offerText: inputText,
          offerHeadline: result.data.offerHeadline || "",
          offerBodyline: result.data.offerBodyline || "",
          width: 120,
          height: 120,
          extractedBrand: imageDetails.extractedBrand,
          extractedProducts: imageDetails.extractedProducts,
          extractedCategory: imageDetails.extractedCategory,
          extractedRules: imageDetails.extractedRules,
        })

        const imageTime = Date.now() - imageStartTime
        console.log("🎨 Canvas generation time:", imageTime + "ms")

        const extractedData = {
          ...result.data,
          offerImage,
        }

        console.log("🎯 === FINAL EXTRACTED DATA ===")
        console.log("🎯 Final data being passed:", extractedData)

        const methodInfo = {
          openai: {
            emoji: "🤖🎨",
            name: "OpenAI GPT-4o + Smart Canvas",
            badge: "AI+SMART-CANVAS",
            color: "bg-green-500",
          },
          regex: {
            emoji: "⚡🎨",
            name: "Regex + Smart Canvas",
            badge: "REGEX+SMART-CANVAS",
            color: "bg-blue-500",
          },
          "regex-fallback": {
            emoji: "⚡🔄🎨",
            name: "Regex Fallback + Smart Canvas",
            badge: "FALLBACK+SMART-CANVAS",
            color: "bg-orange-500",
          },
        }

        const method = result.method || extractionMethod
        const info = methodInfo[method] || methodInfo.openai

        const rulesCount = Object.keys(extractedData.offerRules || {}).length
        const rulesText =
          rulesCount > 0
            ? Object.entries(extractedData.offerRules)
                .map(([key, value]) => `• ${key}: ${value}`)
                .join("\n")
            : "No rules found in text"

        const responseMessage = `${info.emoji} ${info.name} has extracted:

⏱️ Processing time: ${result.processingTime || 0}ms
🎨 Smart image generation: ${imageTime}ms
🔧 Method used: ${method.toUpperCase()}
📋 Rules found: ${rulesCount}
${result.openaiError ? `⚠️ OpenAI error: ${result.openaiError}` : ""}

EXTRACTED DATA:
• Offer Name: ${extractedData.offerName || "Not found"}
• Headline: ${extractedData.offerHeadline || "Not found"} ${method.includes("openai") ? "🤖" : "⚡"}
• Bodyline: ${extractedData.offerBodyline || "Not found"} ${method.includes("openai") ? "🤖" : "⚡"}
• Earn Amount: ${extractedData.earnAmount || "Not found"}
• Earn Display: ${extractedData.earnDisplayText || "Not found"}
• Earn Type: ${extractedData.earnType || "Not found"}
• Start Date: ${extractedData.offerStartDate || "Not specified"}
• End Date: ${extractedData.offerEndDate || "Not specified"}
• Point Expiry: ${extractedData.simplePointExpiry || "Not found"}

IMAGE DETAILS:
🏷️ Brand: ${imageDetails.extractedBrand || "Generic"}
📦 Products: ${imageDetails.extractedProducts.join(", ") || "General"}
🏪 Category: ${imageDetails.extractedCategory || "General"}

RULES:
${rulesText}

✅ Form populated with ${method.includes("openai") ? "AI-generated" : "regex-extracted"} copy and brand-specific image!`

        setChatHistory((prev) => [...prev, { type: "assistant", message: responseMessage }])

        console.log("🎯 === CALLING onExtractData ===")
        onExtractData(extractedData)

        setTimeout(() => {
          onClose()
        }, 4000)
      } else {
        setChatHistory((prev) => [
          ...prev,
          {
            type: "assistant",
            message: `❌ ${result.error || "Processing failed. Please try again."}`,
          },
        ])
      }
    } catch (error) {
      console.error("❌ Extraction failed with unexpected error:", error)
      setChatHistory((prev) => [
        ...prev,
        {
          type: "assistant",
          message: `❌ Unexpected error: ${error.message}`,
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClear = () => {
    setInputText("")
    setChatHistory([])
    setLastExtractionMethod("")
    setLastProcessingTime(0)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col">
        <CardHeader className="bg-blue-600 text-white flex-shrink-0">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              AI Offer Assistant
              {lastExtractionMethod && (
                <Badge
                  className={`ml-2 ${
                    lastExtractionMethod.includes("openai")
                      ? "bg-green-500"
                      : lastExtractionMethod === "regex"
                        ? "bg-blue-500"
                        : "bg-orange-500"
                  } text-white`}
                >
                  {lastExtractionMethod.includes("openai") && <Brain className="w-3 h-3 mr-1" />}
                  {!lastExtractionMethod.includes("openai") && <Cpu className="w-3 h-3 mr-1" />}
                  <Palette className="w-3 h-3 mr-1" />
                  {lastExtractionMethod.toUpperCase()}
                  {lastProcessingTime > 0 && ` (${lastProcessingTime}ms)`}
                </Badge>
              )}
            </div>
            <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-blue-700">
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-6">
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Extraction Method:</label>
            <Select value={extractionMethod} onValueChange={(value: any) => setExtractionMethod(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 mr-2 text-green-600" />
                    <Palette className="w-4 h-4 mr-2 text-purple-600" />🤖 OpenAI + Smart Canvas (RECOMMENDED)
                  </div>
                </SelectItem>
                <SelectItem value="regex">
                  <div className="flex items-center">
                    <Cpu className="w-4 h-4 mr-2 text-blue-600" />
                    <Palette className="w-4 h-4 mr-2 text-purple-600" />⚡ Regex + Smart Canvas (FALLBACK)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Alert className="border-blue-200 bg-blue-50">
              <ImageIcon className="h-4 w-4" />
              <AlertDescription>
                <strong className="text-blue-700">🎨 Image Generation:</strong>
                <br />
                <span className="text-sm text-blue-600">
                  Smart Canvas creates brand-specific images with precise control over text, colors, and themes.
                </span>
              </AlertDescription>
            </Alert>
          </div>

          <div className="mb-4 space-y-2">
            <Button
              onClick={() =>
                setInputText(
                  "Kenmore appliance offer buy Kenmore appliance between July 15th and July 22nd and get 15% back in points available for the next 30 days. Generate a catchy headline, body line as well as an image. Offer conditions is for member segment_house_owner and Member Tier as VIP Gold. offer applicable only on Washer and Dryers",
                )
              }
              variant="outline"
              className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
            >
              Test 1: Kenmore (segment_house_owner + Washer/Dryers)
            </Button>

            <Button
              onClick={() =>
                setInputText(
                  "levis offer buy levis jeans between July 15th and July 22nd and get 10% back in points available for the next 30 days. Generate a catchy headline, body line as well as an image. Offer conditions is for member segment_Age_20_30 and Member Tier as VIP Gold",
                )
              }
              variant="outline"
              className="w-full border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
            >
              Test 2: Levi's (segment_Age_20_30 + Jeans)
            </Button>
          </div>

          <div className="mb-4">
            {openaiStatus === "checking" && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                    {statusDetails}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {openaiStatus === "ready" && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong className="text-green-700">✅ OpenAI + Smart Canvas Ready!</strong>
                  <br />
                  <span className="text-sm text-green-600">{statusDetails}</span>
                  <br />
                  <span className="text-sm text-green-600">
                    🤖 AI-generated headlines/bodylines + 🎨 Brand-specific themed images
                  </span>
                </AlertDescription>
              </Alert>
            )}

            {openaiStatus === "error" && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong className="text-red-700">❌ OpenAI API Issue - Using Regex Fallback</strong>
                  <br />
                  <span className="text-sm text-red-600">{statusDetails}</span>
                  <br />
                  <div className="mt-2 space-y-1 text-sm">
                    <div>• Currently using Enhanced Regex + Smart Canvas (still very effective!)</div>
                    <div>
                      • Add your <code className="bg-red-100 px-1 rounded">OPENAI_API_KEY</code> to environment
                      variables for AI features
                    </div>
                    <div>• Check browser console for detailed error information</div>
                  </div>
                  <Button onClick={checkOpenAIStatus} size="sm" className="mt-2 bg-red-600 hover:bg-red-700 text-white">
                    Retry OpenAI Connection
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex-1 mb-4 space-y-4 overflow-y-auto max-h-60">
            {chatHistory.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <div className="flex items-center justify-center mb-4">
                  {openaiStatus === "ready" ? (
                    <>
                      <Brain className="w-12 h-12 text-green-400 mr-2" />
                      <Palette className="w-12 h-12 text-purple-400 mr-2" />
                      <span className="text-2xl">🤖🎨</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-12 h-12 text-blue-400 mr-2" />
                      <Palette className="w-12 h-12 text-purple-400 mr-2" />
                      <span className="text-2xl">⚡🎨</span>
                    </>
                  )}
                </div>
                <p className="text-lg font-medium">
                  {openaiStatus === "ready" ? "OpenAI GPT-4o + Smart Canvas" : "Enhanced Regex + Smart Canvas"}
                </p>
                <p className="text-sm mt-2">
                  {openaiStatus === "ready"
                    ? "🤖 AI-generated headlines/bodylines + 🎨 Brand-specific images"
                    : "⚡ Pattern-based extraction + 🎨 Brand-specific images"}
                </p>
              </div>
            )}

            {chatHistory.map((chat, index) => (
              <div key={index} className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg whitespace-pre-line ${
                    chat.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {chat.message}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    {extractionMethod === "openai" ? (
                      <>
                        <Brain className="w-4 h-4 text-green-600" />
                        <Palette className="w-4 h-4 text-purple-600" />
                        <span>🤖 OpenAI extracting + 🎨 Creating brand-specific image...</span>
                      </>
                    ) : (
                      <>
                        <Cpu className="w-4 h-4 text-blue-600" />
                        <Palette className="w-4 h-4 text-purple-600" />
                        <span>⚡ Regex extracting + 🎨 Creating brand-specific image...</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 space-y-4">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Describe your offer in detail... Include brand name, product details, dates, rewards, rules, member segments, etc."
              rows={4}
              className="border-blue-200 focus:border-blue-500"
            />

            <div className="flex space-x-2">
              <Button
                onClick={handleSubmit}
                disabled={!inputText.trim() || isProcessing}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {extractionMethod === "openai" ? (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    <Palette className="w-4 h-4 mr-2" />
                    {isProcessing ? "Processing..." : "Extract with AI + Smart Canvas"}
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4 mr-2" />
                    <Palette className="w-4 h-4 mr-2" />
                    {isProcessing ? "Processing..." : "Extract with Regex + Smart Canvas"}
                  </>
                )}
              </Button>

              <Button
                onClick={handleClear}
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Named export for compatibility
export { ChatModal }
