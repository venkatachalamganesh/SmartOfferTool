"use client"

import type React from "react"

import { useState } from "react"
import { Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import ChatModal from "./components/ChatModal"
import JsonDisplay from "./components/JsonDisplay"
import Logo from "./components/Logo"

interface OfferData {
  offerName: string
  offerDescription: string
  offerHeadline: string
  offerBodyline: string
  offerImage: string
  offerStartDate: string
  offerEndDate: string
  offerRules: any
  earnType: string
  earnAmount: string
  earnDisplayText: string
  simplePointExpiry: string
}

export default function SmartOfferFramework() {
  const [offerData, setOfferData] = useState<OfferData>({
    offerName: "",
    offerDescription: "",
    offerHeadline: "",
    offerBodyline: "",
    offerImage: "",
    offerStartDate: "",
    offerEndDate: "",
    offerRules: "",
    earnType: "",
    earnAmount: "",
    earnDisplayText: "",
    simplePointExpiry: "",
  })
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [showJson, setShowJson] = useState(false)

  const handleInputChange = (field: keyof OfferData, value: string) => {
    setOfferData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setOfferData((prev) => ({
          ...prev,
          offerImage: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const populateFromText = (extractedData: Partial<OfferData>) => {
    console.log("🎯 === populateFromText CALLED ===")
    console.log("🎯 Received data:", extractedData)
    console.log("🎯 Rules in received data:", extractedData.offerRules)
    console.log("🎯 Earn amount (converted):", extractedData.earnAmount)
    console.log("🎯 Earn display text:", extractedData.earnDisplayText)

    // COMPLETE REPLACEMENT - don't merge with previous state
    const newOfferData: OfferData = {
      offerName: extractedData.offerName || "",
      offerDescription: extractedData.offerDescription || "",
      offerHeadline: extractedData.offerHeadline || "",
      offerBodyline: extractedData.offerBodyline || "",
      offerImage: extractedData.offerImage || "",
      offerStartDate: extractedData.offerStartDate || "",
      offerEndDate: extractedData.offerEndDate || "",
      offerRules: extractedData.offerRules || {},
      earnType: extractedData.earnType || "",
      earnAmount: extractedData.earnAmount || "",
      earnDisplayText: extractedData.earnDisplayText || "",
      simplePointExpiry: extractedData.simplePointExpiry || "",
    }

    console.log("🎯 Setting new offer data:", newOfferData)
    setOfferData(newOfferData)
  }

  const generateJson = () => {
    const jsonData = {
      offer: {
        name: offerData.offerName,
        description: offerData.offerDescription,
        headline: offerData.offerHeadline,
        bodyline: offerData.offerBodyline,
        image: offerData.offerImage ? "base64_image_data" : null,
        startDate: offerData.offerStartDate,
        endDate: offerData.offerEndDate || null,
        rules:
          typeof offerData.offerRules === "object" && offerData.offerRules !== null
            ? offerData.offerRules
            : offerData.offerRules
              ? { General: offerData.offerRules }
              : {},
        rewards: {
          earnType: offerData.earnType,
          earnAmount: Number.parseFloat(offerData.earnAmount) || 0,
          earnDisplayText: offerData.earnDisplayText,
          simplePointExpiry: offerData.simplePointExpiry,
        },
        createdAt: new Date().toISOString(),
        status: "draft",
      },
    }
    return JSON.stringify(jsonData, null, 2)
  }

  const handleClearForm = () => {
    console.log("🧹 Clearing form...")
    setOfferData({
      offerName: "",
      offerDescription: "",
      offerHeadline: "",
      offerBodyline: "",
      offerImage: "",
      offerStartDate: "",
      offerEndDate: "",
      offerRules: "",
      earnType: "",
      earnAmount: "",
      earnDisplayText: "",
      simplePointExpiry: "",
    })
    setShowJson(false)
  }

  // Helper function to format earn display
  const getEarnDisplayText = () => {
    if (offerData.earnDisplayText) {
      return offerData.earnDisplayText
    }

    if (offerData.earnType && offerData.earnAmount) {
      if (offerData.earnType === "percentage") {
        return `${offerData.earnAmount}% back`
      } else if (offerData.earnType === "cashback") {
        return `${offerData.earnAmount}% cashback`
      } else if (offerData.earnType === "points") {
        const amount = Number.parseFloat(offerData.earnAmount)
        if (amount >= 1000) {
          return `$${(amount / 1000).toFixed(0)} in points`
        } else {
          return `${(amount / 10).toFixed(1)}% back in points`
        }
      }
    }
    return ""
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo />
          <p className="text-gray-600 mt-4 text-lg">Create compelling offers with AI-powered assistance</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="bg-blue-600 text-white">
              <CardTitle className="flex items-center justify-between">
                <span>Offer Details</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsChatOpen(true)}
                    className="bg-white text-blue-600 hover:bg-blue-50"
                    size="sm"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    AI Assistant
                  </Button>
                  <Button
                    onClick={handleClearForm}
                    variant="outline"
                    className="border-white text-white hover:bg-blue-700 bg-transparent"
                    size="sm"
                  >
                    Clear Form
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Offer Name */}
              <div>
                <Label htmlFor="offerName" className="text-gray-700 font-medium">
                  Offer Name <span className="text-blue-600">*</span>
                </Label>
                <Input
                  id="offerName"
                  value={offerData.offerName}
                  onChange={(e) => handleInputChange("offerName", e.target.value)}
                  maxLength={30}
                  className="mt-1 border-blue-200 focus:border-blue-500"
                  placeholder="Enter offer name (max 30 characters)"
                />
                <div className="text-sm text-gray-500 mt-1">{offerData.offerName.length}/30 characters</div>
              </div>

              {/* Offer Headline */}
              <div>
                <Label htmlFor="offerHeadline" className="text-gray-700 font-medium">
                  Offer Headline <span className="text-blue-600">*</span>
                  <span className="text-xs text-green-600 ml-2">🤖 AI Generated</span>
                </Label>
                <Input
                  id="offerHeadline"
                  value={offerData.offerHeadline}
                  onChange={(e) => handleInputChange("offerHeadline", e.target.value)}
                  maxLength={30}
                  className="mt-1 border-blue-200 focus:border-blue-500"
                  placeholder="Catchy headline (max 30 characters)"
                />
                <div className="text-sm text-gray-500 mt-1">{offerData.offerHeadline.length}/30 characters</div>
              </div>

              {/* Offer Bodyline */}
              <div>
                <Label htmlFor="offerBodyline" className="text-gray-700 font-medium">
                  Offer Bodyline
                  <span className="text-xs text-green-600 ml-2">🤖 AI Generated</span>
                </Label>
                <Input
                  id="offerBodyline"
                  value={offerData.offerBodyline}
                  onChange={(e) => handleInputChange("offerBodyline", e.target.value)}
                  maxLength={75}
                  className="mt-1 border-blue-200 focus:border-blue-500"
                  placeholder="Brief description (max 75 characters)"
                />
                <div className="text-sm text-gray-500 mt-1">{offerData.offerBodyline.length}/75 characters</div>
              </div>

              {/* Offer Description */}
              <div>
                <Label htmlFor="offerDescription" className="text-gray-700 font-medium">
                  Offer Description
                </Label>
                <Textarea
                  id="offerDescription"
                  value={offerData.offerDescription}
                  onChange={(e) => handleInputChange("offerDescription", e.target.value)}
                  maxLength={1000}
                  rows={4}
                  className="mt-1 border-blue-200 focus:border-blue-500"
                  placeholder="Detailed offer description (max 1000 characters)"
                />
                <div className="text-sm text-gray-500 mt-1">{offerData.offerDescription.length}/1000 characters</div>
              </div>

              {/* Offer Image */}
              <div>
                <Label htmlFor="offerImage" className="text-gray-700 font-medium">
                  Offer Image (120x120px)
                  <span className="text-xs text-purple-600 ml-2">🎨 Canvas Generated</span>
                  <span className="text-xs text-blue-600 ml-2">💡 OpenAI Option Available</span>
                </Label>
                <div className="mt-1 flex items-center space-x-4">
                  <Input
                    id="offerImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="border-blue-200 focus:border-blue-500"
                  />
                  {offerData.offerImage && (
                    <img
                      src={offerData.offerImage || "/placeholder.svg"}
                      alt="Offer preview"
                      className="w-20 h-20 object-cover rounded border-2 border-blue-200"
                    />
                  )}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  💡 <strong>OpenAI DALL-E Option:</strong> We could generate images using OpenAI's DALL-E, but Canvas
                  gives us precise control over branding, text, and offer details at no extra cost.
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="text-gray-700 font-medium">
                    Start Date <span className="text-blue-600">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={offerData.offerStartDate}
                    onChange={(e) => handleInputChange("offerStartDate", e.target.value)}
                    className="mt-1 border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-gray-700 font-medium">
                    End Date <span className="text-gray-500">(Optional)</span>
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={offerData.offerEndDate}
                    onChange={(e) => handleInputChange("offerEndDate", e.target.value)}
                    className="mt-1 border-blue-200 focus:border-blue-500"
                  />
                  {!offerData.offerEndDate && (
                    <div className="text-xs text-gray-500 mt-1">Leave empty for open-ended offers</div>
                  )}
                </div>
              </div>

              {/* Rewards Section */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-3">Reward Details</h4>

                {/* Display Text (AI Generated) */}
                {offerData.earnDisplayText && (
                  <div className="mb-4">
                    <Label className="text-gray-700 font-medium">
                      Reward Display Text
                      <span className="text-xs text-green-600 ml-2">🤖 AI Generated</span>
                    </Label>
                    <div className="mt-1 p-2 bg-white border border-blue-200 rounded text-blue-800 font-medium">
                      {offerData.earnDisplayText}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="earnType" className="text-gray-700 font-medium">
                      Earn Type
                    </Label>
                    <select
                      id="earnType"
                      value={offerData.earnType}
                      onChange={(e) => handleInputChange("earnType", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-blue-200 rounded-md focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select type</option>
                      <option value="percentage">Percentage</option>
                      <option value="points">Points</option>
                      <option value="cashback">Cashback</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="earnAmount" className="text-gray-700 font-medium">
                      Earn Amount (Converted)
                      <span className="text-xs text-blue-600 ml-2">🔢 Points Logic</span>
                    </Label>
                    <Input
                      id="earnAmount"
                      type="number"
                      step="0.1"
                      value={offerData.earnAmount}
                      onChange={(e) => handleInputChange("earnAmount", e.target.value)}
                      className="mt-1 border-blue-200 focus:border-blue-500"
                      placeholder="e.g., 150 (for 15% → 150 pts/$1)"
                    />
                    <div className="text-xs text-blue-600 mt-1">
                      {offerData.earnType === "points" && offerData.earnAmount && (
                        <>
                          {Number.parseFloat(offerData.earnAmount) >= 1000
                            ? `${(Number.parseFloat(offerData.earnAmount) / 1000).toFixed(0)} dollars worth of points`
                            : `${(Number.parseFloat(offerData.earnAmount) / 10).toFixed(1)}% back (${offerData.earnAmount} pts per $1)`}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Simple Point Expiry */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-3">Points Validity</h4>
                <div>
                  <Label htmlFor="simplePointExpiry" className="text-gray-700 font-medium">
                    Simple Point Expiry
                    <span className="text-xs text-green-600 ml-2">🤖 AI Converted</span>
                  </Label>
                  <Input
                    id="simplePointExpiry"
                    value={offerData.simplePointExpiry}
                    onChange={(e) => handleInputChange("simplePointExpiry", e.target.value)}
                    className="mt-1 border-blue-200 focus:border-blue-500"
                    placeholder="e.g., Points expire 30 days after earning date"
                  />
                  <div className="text-xs text-blue-600 mt-1 font-medium">
                    Converted from "available for X days" format
                  </div>
                </div>
              </div>

              {/* Offer Rules */}
              <div>
                <Label htmlFor="offerRules" className="text-gray-700 font-medium">
                  Offer Rules & Conditions
                  <span className="text-xs text-green-600 ml-2">🤖 AI Extracted</span>
                </Label>
                <Textarea
                  id="offerRules"
                  value={
                    typeof offerData.offerRules === "object"
                      ? JSON.stringify(offerData.offerRules, null, 2)
                      : offerData.offerRules
                  }
                  onChange={(e) => handleInputChange("offerRules", e.target.value)}
                  rows={4}
                  className="mt-1 border-blue-200 focus:border-blue-500 font-mono text-sm"
                  placeholder="Rules will be extracted and displayed as JSON"
                  readOnly
                />
              </div>

              {/* Generate JSON Button */}
              <Button
                onClick={() => setShowJson(!showJson)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {showJson ? "Hide JSON" : "Generate JSON"}
              </Button>
            </CardContent>
          </Card>

          {/* JSON Display Section */}
          <div className="space-y-6">
            {/* Preview Card */}
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-blue-100">
                <CardTitle className="text-blue-800">Offer Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex items-start space-x-4">
                    {offerData.offerImage && (
                      <img
                        src={offerData.offerImage || "/placeholder.svg"}
                        alt="Offer"
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{offerData.offerHeadline || "Offer Headline"}</h3>
                      <p className="text-gray-600 mb-2">
                        {offerData.offerBodyline || "Offer bodyline will appear here"}
                      </p>
                      <div className="text-sm text-blue-600 font-medium">{getEarnDisplayText()}</div>
                      <div className="text-xs text-gray-500 mt-2">
                        {offerData.offerStartDate && (
                          <div>
                            Start: {offerData.offerStartDate}
                            {offerData.offerEndDate && ` | End: ${offerData.offerEndDate}`}
                            {!offerData.offerEndDate && " | No end date"}
                          </div>
                        )}
                        {offerData.simplePointExpiry && (
                          <div className="text-blue-600 font-medium mt-1">{offerData.simplePointExpiry}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {typeof offerData.offerRules === "object" && Object.keys(offerData.offerRules).length > 0 && (
                    <div className="bg-gray-50 p-2 rounded">
                      <strong>Rules:</strong>
                      {Object.entries(offerData.offerRules).map(([key, value]) => (
                        <div key={key}>
                          {key}: {value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* JSON Display moved below preview */}
            {showJson && <JsonDisplay jsonData={generateJson()} onCopy={() => {}} />}
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} onExtractData={populateFromText} />
    </div>
  )
}
