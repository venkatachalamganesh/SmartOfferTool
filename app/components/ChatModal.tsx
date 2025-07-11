"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, CheckCircle, XCircle, TestTube, Brain, AlertCircle, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  onExtractData: (data: any) => void
}

interface Message {
  id: string
  type: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  data?: any
}

interface ExtractionStatus {
  openai: "checking" | "ready" | "error" | "unavailable"
  regex: "ready" | "processing" | "complete"
  canvas: "ready" | "generating" | "complete" | "error"
}

export default function ChatModal({ isOpen, onClose, onExtractData }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractionMethod, setExtractionMethod] = useState<"openai" | "regex">("openai")
  const [status, setStatus] = useState<ExtractionStatus>({
    openai: "checking",
    regex: "ready",
    canvas: "ready",
  })
  const [isClosing, setIsClosing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Updated test prompts
  const testPrompts = [
    {
      id: "kenmore",
      title: "Kenmore 15% Back",
      prompt:
        "Kenmore appliance offer buy Kenmore appliance between July 15th and July 22nd and get 15% back in points available for the next 30 days. Generate a catchy headline, body line as well as an image. Offer conditions is for member segment_house_owner and Member Tier as VIP Gold. offer applicable only on Washer and Dryers",
    },
    {
      id: "kenmore-dollar",
      title: "Kenmore $50 Back",
      prompt:
        "Kenmore appliance offer buy Kenmore appliance between July 15th and July 22nd and get $50 back in points available for the next 30 days. Generate a catchy headline, body line as well as an image. Offer conditions is for member segment_house_owner and Member Tier as VIP Gold. offer applicable only on Washer and Dryers",
    },
    {
      id: "electronics",
      title: "Electronics Points Only",
      prompt:
        "Summer electronics sale - earn 200 points per dollar spent from August 1st to August 31st. Points expire after 60 days. Available for premium members only. Includes smartphones, laptops, and tablets.",
    },
    {
      id: "fashion",
      title: "Fashion Cashback",
      prompt:
        "Fashion week special - 25% cashback on designer clothing from September 1st to September 15th. Minimum purchase $150. Available for segment_fashion_lovers and VIP Platinum members. Includes dresses, shoes, and accessories.",
    },
  ]

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Check OpenAI status on mount
  useEffect(() => {
    if (isOpen) {
      checkOpenAIStatus()
      addSystemMessage("🤖 AI Offer Assistant Ready! Choose a test prompt or describe your offer.")
    }
  }, [isOpen])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMessages([])
      setInputText("")
      setIsProcessing(false)
      setIsClosing(false)
    }
  }, [isOpen])

  const addMessage = (type: Message["type"], content: string, data?: any) => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      data,
    }
    setMessages((prev) => [...prev, message])
  }

  const addSystemMessage = (content: string) => {
    addMessage("system", content)
  }

  const checkOpenAIStatus = async () => {
    try {
      setStatus((prev) => ({ ...prev, openai: "checking" }))

      const response = await fetch("/api/openai-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "test connection" }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setStatus((prev) => ({ ...prev, openai: "ready" }))
          setExtractionMethod("openai")
          addSystemMessage("✅ OpenAI + Smart Canvas Ready!")
        } else {
          throw new Error("OpenAI test failed")
        }
      } else {
        throw new Error("OpenAI not available")
      }
    } catch (error) {
      console.error("OpenAI check failed:", error)
      setStatus((prev) => ({ ...prev, openai: "error" }))
      setExtractionMethod("regex")
      addSystemMessage("⚠️ Using Regex + Smart Canvas (Reliable)")
    }
  }

  const extractWithOpenAI = async (text: string) => {
    try {
      console.log("🤖 === OPENAI EXTRACTION ===")
      console.log("🤖 Input:", text.substring(0, 100) + "...")

      const response = await fetch("/api/openai-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      const result = await response.json()
      console.log("🤖 OpenAI result:", result)

      if (!result.success) {
        throw new Error(result.error || "OpenAI extraction failed")
      }

      return result.data
    } catch (error) {
      console.error("🤖 OpenAI extraction error:", error)
      throw error
    }
  }

  const extractWithRegex = async (text: string) => {
    console.log("🔍 === REGEX EXTRACTION ===")
    console.log("🔍 Input:", text.substring(0, 100) + "...")

    // Import the server action
    const { extractOfferWithRegex } = await import("../actions/extract-offer-local")
    const result = await extractOfferWithRegex(text)

    if (!result.success) {
      throw new Error(result.error || "Regex extraction failed")
    }

    return result.data
  }

  const generateImage = async (offerData: any) => {
    try {
      setStatus((prev) => ({ ...prev, canvas: "generating" }))

      // Create a simple canvas-based image
      const canvas = document.createElement("canvas")
      canvas.width = 120
      canvas.height = 120
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Background
        const gradient = ctx.createLinearGradient(0, 0, 120, 120)
        if (offerData.offerName?.toLowerCase().includes("kenmore")) {
          gradient.addColorStop(0, "#3b82f6")
          gradient.addColorStop(1, "#1e40af")
        } else if (offerData.offerName?.toLowerCase().includes("levi")) {
          gradient.addColorStop(0, "#dc2626")
          gradient.addColorStop(1, "#991b1b")
        } else if (offerData.offerName?.toLowerCase().includes("electronics")) {
          gradient.addColorStop(0, "#7c3aed")
          gradient.addColorStop(1, "#5b21b6")
        } else if (offerData.offerName?.toLowerCase().includes("fashion")) {
          gradient.addColorStop(0, "#ec4899")
          gradient.addColorStop(1, "#be185d")
        } else {
          gradient.addColorStop(0, "#059669")
          gradient.addColorStop(1, "#047857")
        }

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 120, 120)

        // Text
        ctx.fillStyle = "white"
        ctx.font = "bold 14px Arial"
        ctx.textAlign = "center"

        const brandName = offerData.offerName || "Special"
        ctx.fillText(brandName.substring(0, 10), 60, 30)

        ctx.font = "bold 18px Arial"
        let displayText = "DEAL"
        let bottomText = ""

        if (offerData.earnType === "percentage") {
          displayText = `${offerData.earnAmount}%`
          bottomText = "OFF"
        } else if (offerData.earnType === "points") {
          if (offerData.earnDisplayText?.includes("$")) {
            displayText = offerData.earnDisplayText.split(" ")[0] // Just the $50 part
            bottomText = "BACK"
          } else if (
            offerData.earnDisplayText?.includes("% back") ||
            offerData.earnDisplayText?.includes("% cashback")
          ) {
            const percentage = offerData.earnDisplayText.match(/(\d+)%/)
            displayText = percentage ? `${percentage[1]}%` : "POINTS"
            bottomText = "BACK"
          } else if (offerData.earnDisplayText?.includes("points per dollar")) {
            displayText = offerData.earnAmount
            bottomText = "PTS"
          } else {
            displayText = "POINTS"
            bottomText = "BACK"
          }
        } else if (offerData.earnAmount) {
          displayText = offerData.earnAmount
          bottomText = "DEAL"
        }

        ctx.fillText(displayText, 60, 60)

        ctx.font = "12px Arial"
        ctx.fillText(bottomText, 60, 80)

        setStatus((prev) => ({ ...prev, canvas: "complete" }))
        return canvas.toDataURL()
      }

      setStatus((prev) => ({ ...prev, canvas: "error" }))
      return ""
    } catch (error) {
      console.error("Image generation error:", error)
      setStatus((prev) => ({ ...prev, canvas: "error" }))
      return ""
    }
  }

  const processMessage = async (text: string) => {
    setIsProcessing(true)
    addMessage("user", text)

    try {
      let extractedData

      // Try extraction method
      if (extractionMethod === "openai" && status.openai === "ready") {
        addSystemMessage("🤖 Using OpenAI for intelligent extraction...")
        try {
          extractedData = await extractWithOpenAI(text)
          addSystemMessage("✅ OpenAI extraction successful!")
        } catch (error) {
          addSystemMessage("⚠️ OpenAI failed, falling back to regex...")
          extractedData = await extractWithRegex(text)
          addSystemMessage("✅ Regex extraction complete!")
        }
      } else {
        addSystemMessage("🔍 Using regex pattern matching...")
        extractedData = await extractWithRegex(text)
        addSystemMessage("✅ Regex extraction complete!")
      }

      // Generate image
      addSystemMessage("🎨 Generating brand-specific image...")
      const imageUrl = await generateImage(extractedData)
      if (imageUrl) {
        extractedData.offerImage = imageUrl
        addSystemMessage("✅ Image generated successfully!")
      }

      // Show results with detailed breakdown
      const resultMessage = `📊 **Extraction Complete!**

✅ **Offer Name:** ${extractedData.offerName || "Not found"}
✅ **Headline:** ${extractedData.offerHeadline || "Generated"}
✅ **Bodyline:** ${extractedData.offerBodyline || "Generated"}
✅ **Reward Type:** ${extractedData.earnType}
✅ **Earn Amount:** ${extractedData.earnAmount}
✅ **Display Text:** ${extractedData.earnDisplayText || "Not found"}
✅ **Rules:** ${Object.keys(extractedData.offerRules || {}).length} conditions extracted
✅ **Image:** ${imageUrl ? "Generated" : "Not generated"}

🎯 **Form will be populated and modal will close in 3 seconds...**`

      addMessage("assistant", resultMessage, extractedData)

      // Send data to parent
      onExtractData(extractedData)

      toast({
        title: "Extraction Complete!",
        description: "Offer data has been extracted and populated in the form.",
      })

      // Auto-close after showing results
      addSystemMessage("🔄 Closing assistant and showing populated form...")
      setIsClosing(true)

      setTimeout(() => {
        onClose()
      }, 3000)
    } catch (error) {
      console.error("Processing error:", error)
      addSystemMessage(`❌ Error: ${error.message}`)

      toast({
        title: "Extraction Failed",
        description: error.message || "An error occurred during extraction.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSend = () => {
    if (!inputText.trim() || isProcessing) return
    processMessage(inputText.trim())
    setInputText("")
  }

  const handleTestPrompt = (prompt: string) => {
    setInputText(prompt)
  }

  const getStatusIcon = (statusType: keyof ExtractionStatus) => {
    const currentStatus = status[statusType]
    switch (currentStatus) {
      case "checking":
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      case "ready":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
      case "unavailable":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "processing":
      case "generating":
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      case "complete":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-4xl max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-600" />
              AI Offer Assistant
              {isClosing && (
                <Badge className="ml-2 bg-green-500 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Closing...
                </Badge>
              )}
            </div>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
          {/* Left Panel - Chat */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Status Bar */}
            <Card className="mb-4">
              <CardContent className="p-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="flex items-center space-x-1">
                      {getStatusIcon("openai")}
                      <span className="hidden sm:inline">OpenAI</span>
                      <span className="sm:hidden">AI</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon("regex")}
                      <span>Regex</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon("canvas")}
                      <span className="hidden sm:inline">Smart Canvas</span>
                      <span className="sm:hidden">Canvas</span>
                    </div>
                  </div>
                  <Badge variant={extractionMethod === "openai" ? "default" : "secondary"} className="text-xs">
                    {extractionMethod === "openai" ? "AI Mode" : "Regex Mode"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Messages */}
            <ScrollArea className="flex-1 border rounded-lg p-2 sm:p-4 mb-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : message.type === "system"
                            ? "bg-gray-100 text-gray-700 text-sm"
                            : "bg-gray-50 text-gray-900"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm sm:text-base">{message.content}</div>
                      {message.type !== "system" && (
                        <div className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</div>
                      )}
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-3 flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Processing...</span>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="flex space-x-2">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Describe your offer or paste offer text here..."
                className="flex-1 min-h-[60px] max-h-[120px] text-sm sm:text-base"
                disabled={isProcessing || isClosing}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
              <Button
                onClick={handleSend}
                disabled={!inputText.trim() || isProcessing || isClosing}
                className="bg-blue-600 hover:bg-blue-700 px-3 sm:px-4"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Panel - Test Prompts */}
          <div className="w-full lg:w-80 flex flex-col">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Prompts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  {testPrompts.map((test) => (
                    <Card key={test.id} className="border border-gray-200">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{test.title}</h4>
                          <Button
                            onClick={() => handleTestPrompt(test.prompt)}
                            size="sm"
                            variant="outline"
                            className="text-xs px-2 py-1"
                            disabled={isProcessing || isClosing}
                          >
                            Use
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-3">{test.prompt.substring(0, 100)}...</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { ChatModal }
