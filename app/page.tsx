"use client"

import { useState } from "react"
import { Zap, Sparkles, FileText, Target, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Logo from "./components/Logo"
import ChatModal from "./components/ChatModal"
import JsonDisplay from "./components/JsonDisplay"

interface OfferData {
  offerName: string
  offerHeadline: string
  offerBodyline: string
  earnAmount: string
  earnType: string
  earnDisplayText: string
  offerStartDate: string
  offerEndDate: string
  simplePointExpiry: string
  offerImage: string
  offerRules: Record<string, string>
}

export default function SmartOfferFramework() {
  const [formData, setFormData] = useState<OfferData>({
    offerName: "",
    offerHeadline: "",
    offerBodyline: "",
    earnAmount: "",
    earnType: "",
    earnDisplayText: "",
    offerStartDate: "",
    offerEndDate: "",
    simplePointExpiry: "",
    offerImage: "",
    offerRules: {},
  })

  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isJsonVisible, setIsJsonVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof OfferData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleExtractData = (extractedData: any) => {
    console.log("📝 === FORM DATA UPDATE ===")
    console.log("📝 Received extracted data:", extractedData)

    setFormData((prev) => ({
      ...prev,
      ...extractedData,
    }))

    toast({
      title: "Data Extracted Successfully!",
      description: "Form has been populated with extracted offer data.",
    })
  }

  const handleTestData = (testNumber: number) => {
    setIsLoading(true)

    const testData = {
      1: {
        offerName: "Summer Electronics Sale",
        offerHeadline: "Upgrade Your Tech This Summer!",
        offerBodyline: "Get the latest gadgets at unbeatable prices. Limited time offer!",
        earnAmount: "20",
        earnType: "percentage",
        earnDisplayText: "20% off",
        offerStartDate: "2024-07-01",
        offerEndDate: "2024-07-31",
        simplePointExpiry: "30 days",
        offerImage:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzMzIiByeD0iOCIvPgo8dGV4dCB4PSI2MCIgeT0iNDAiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0iQXJpYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVsZWN0cm9uaWNzPC90ZXh0Pgo8dGV4dCB4PSI2MCIgeT0iNjAiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+MjAlPC90ZXh0Pgo8dGV4dCB4PSI2MCIgeT0iODAiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk9GRjwvdGV4dD4KPC9zdmc+",
        offerRules: {
          "Eligible Products": "Electronics and gadgets",
          "Member Segment": "tech_enthusiasts",
          "Member Tier": "Gold",
          "Minimum Purchase": "$100",
        },
      },
      2: {
        offerName: "Fashion Forward Deal",
        offerHeadline: "Style Meets Savings!",
        offerBodyline: "Refresh your wardrobe with trending fashion at amazing prices.",
        earnAmount: "15",
        earnType: "percentage",
        earnDisplayText: "15% off",
        offerStartDate: "2024-07-15",
        offerEndDate: "2024-08-15",
        simplePointExpiry: "45 days",
        offerImage:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjZTkxZTYzIiByeD0iOCIvPgo8dGV4dCB4PSI2MCIgeT0iNDAiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0iQXJpYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZhc2hpb248L3RleHQ+Cjx0ZXh0IHg9IjYwIiB5PSI2MCIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4xNSU8L3RleHQ+Cjx0ZXh0IHg9IjYwIiB5PSI4MCIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJBcmlhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+T0ZGPC90ZXh0Pgo8L3N2Zz4=",
        offerRules: {
          "Eligible Products": "Clothing and accessories",
          "Member Segment": "fashion_lovers",
          "Member Tier": "Silver",
          Seasonal: "Summer collection",
        },
      },
      3: {
        offerName: "Home & Garden Special",
        offerHeadline: "Transform Your Space!",
        offerBodyline: "Create the perfect home environment with our curated selection.",
        earnAmount: "25",
        earnType: "percentage",
        earnDisplayText: "25% off",
        offerStartDate: "2024-08-01",
        offerEndDate: "2024-08-31",
        simplePointExpiry: "60 days",
        offerImage:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMTU4MDNkIiByeD0iOCIvPgo8dGV4dCB4PSI2MCIgeT0iNDAiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0iQXJpYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkhvbWUgJiBHYXJkZW48L3RleHQ+Cjx0ZXh0IHg9IjYwIiB5PSI2MCIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4yNSU8L3RleHQ+Cjx0ZXh0IHg9IjYwIiB5PSI4MCIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJBcmlhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+T0ZGPC90ZXh0Pgo8L3N2Zz4=",
        offerRules: {
          "Eligible Products": "Home decor and garden supplies",
          "Member Segment": "homeowners",
          "Member Tier": "Platinum",
          Category: "Seasonal items",
        },
      },
      4: {
        offerName: "Fitness & Wellness Boost",
        offerHeadline: "Get Fit, Feel Great!",
        offerBodyline: "Start your wellness journey with premium fitness gear and supplements.",
        earnAmount: "30",
        earnType: "percentage",
        earnDisplayText: "30% off",
        offerStartDate: "2024-09-01",
        offerEndDate: "2024-09-30",
        simplePointExpiry: "90 days",
        offerImage:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjZjU5ZTBiIiByeD0iOCIvPgo8dGV4dCB4PSI2MCIgeT0iNDAiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0iQXJpYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZpdG5lc3M8L3RleHQ+Cjx0ZXh0IHg9IjYwIiB5PSI2MCIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4zMCU8L3RleHQ+Cjx0ZXh0IHg9IjYwIiB5PSI4MCIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJBcmlhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+T0ZGPC90ZXh0Pgo8L3N2Zz4=",
        offerRules: {
          "Eligible Products": "Fitness equipment and supplements",
          "Member Segment": "fitness_enthusiasts",
          "Member Tier": "Gold",
          "Health Category": "Wellness products",
        },
      },
    }

    setTimeout(() => {
      const selectedData = testData[testNumber as keyof typeof testData]
      if (selectedData) {
        setFormData((prev) => ({
          ...prev,
          ...selectedData,
        }))

        toast({
          title: `Test Data ${testNumber} Loaded!`,
          description: "Form has been populated with sample offer data.",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleClearForm = () => {
    setFormData({
      offerName: "",
      offerHeadline: "",
      offerBodyline: "",
      earnAmount: "",
      earnType: "",
      earnDisplayText: "",
      offerStartDate: "",
      offerEndDate: "",
      simplePointExpiry: "",
      offerImage: "",
      offerRules: {},
    })

    toast({
      title: "Form Cleared",
      description: "All form fields have been reset.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Smart Offer Framework</h1>
          <p className="text-xl text-gray-600">AI-Powered Offer Creation & Management Platform</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Assistant Card */}
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  AI-Powered Extraction
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">
                  Use our AI assistant to automatically extract offer details from natural language descriptions.
                </p>
                <Button onClick={() => setIsChatOpen(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Open AI Offer Assistant
                </Button>
              </CardContent>
            </Card>

            {/* Test Data Card */}
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-green-600 text-white">
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Quick Test Data
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">Load sample offer data to test the framework functionality.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <Button
                      key={num}
                      onClick={() => handleTestData(num)}
                      disabled={isLoading}
                      variant="outline"
                      className="border-green-200 text-green-600 hover:bg-green-50"
                    >
                      {isLoading ? "Loading..." : `Test ${num}`}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Offer Details Form */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Offer Details
                  </div>
                  <Button
                    onClick={handleClearForm}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="offerName">Offer Name</Label>
                    <Input
                      id="offerName"
                      value={formData.offerName}
                      onChange={(e) => handleInputChange("offerName", e.target.value)}
                      placeholder="Enter offer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="earnDisplayText">Earn Display Text</Label>
                    <Input
                      id="earnDisplayText"
                      value={formData.earnDisplayText}
                      onChange={(e) => handleInputChange("earnDisplayText", e.target.value)}
                      placeholder="e.g., 20% off, $10 back"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="offerHeadline">Offer Headline</Label>
                  <Input
                    id="offerHeadline"
                    value={formData.offerHeadline}
                    onChange={(e) => handleInputChange("offerHeadline", e.target.value)}
                    placeholder="Catchy headline for the offer"
                  />
                </div>

                <div>
                  <Label htmlFor="offerBodyline">Offer Bodyline</Label>
                  <Textarea
                    id="offerBodyline"
                    value={formData.offerBodyline}
                    onChange={(e) => handleInputChange("offerBodyline", e.target.value)}
                    placeholder="Detailed description of the offer"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="earnAmount">Earn Amount</Label>
                    <Input
                      id="earnAmount"
                      value={formData.earnAmount}
                      onChange={(e) => handleInputChange("earnAmount", e.target.value)}
                      placeholder="e.g., 20, 10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="earnType">Earn Type</Label>
                    <Input
                      id="earnType"
                      value={formData.earnType}
                      onChange={(e) => handleInputChange("earnType", e.target.value)}
                      placeholder="percentage, fixed, points"
                    />
                  </div>
                  <div>
                    <Label htmlFor="simplePointExpiry">Point Expiry</Label>
                    <Input
                      id="simplePointExpiry"
                      value={formData.simplePointExpiry}
                      onChange={(e) => handleInputChange("simplePointExpiry", e.target.value)}
                      placeholder="e.g., 30 days"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="offerStartDate">Start Date</Label>
                    <Input
                      id="offerStartDate"
                      type="date"
                      value={formData.offerStartDate}
                      onChange={(e) => handleInputChange("offerStartDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="offerEndDate">End Date</Label>
                    <Input
                      id="offerEndDate"
                      type="date"
                      value={formData.offerEndDate}
                      onChange={(e) => handleInputChange("offerEndDate", e.target.value)}
                    />
                  </div>
                </div>

                {/* Offer Image Preview */}
                {formData.offerImage && (
                  <div>
                    <Label>Generated Offer Image</Label>
                    <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                      <img
                        src={formData.offerImage || "/placeholder.svg"}
                        alt="Generated offer thumbnail"
                        className="w-32 h-32 object-cover rounded-lg mx-auto"
                      />
                    </div>
                  </div>
                )}

                {/* Offer Rules */}
                {Object.keys(formData.offerRules).length > 0 && (
                  <div>
                    <Label>Offer Rules</Label>
                    <div className="mt-2 space-y-2">
                      {Object.entries(formData.offerRules).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-600 min-w-0 flex-1">{key}:</span>
                          <span className="text-sm text-gray-800 flex-2">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - JSON Output */}
          <div className="space-y-6">
            <JsonDisplay data={formData} isVisible={isJsonVisible} onToggle={() => setIsJsonVisible(!isJsonVisible)} />
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} onExtractData={handleExtractData} />

      <Toaster />
    </div>
  )
}
