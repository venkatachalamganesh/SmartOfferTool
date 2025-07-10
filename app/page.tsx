"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Calendar, Gift, Users, Target, FileText, Sparkles, Code2 } from "lucide-react"
import ChatModal from "./components/ChatModal"
import JsonDisplay from "./components/JsonDisplay"
import Logo from "./components/Logo"

export default function SmartOfferFramework() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showJson, setShowJson] = useState(true) // Always show JSON display
  const [formData, setFormData] = useState({
    offerName: "",
    offerHeadline: "",
    offerBodyline: "",
    offerStartDate: "",
    offerEndDate: "",
    earnAmount: "",
    earnType: "",
    earnDisplayText: "",
    simplePointExpiry: "",
    offerDescription: "",
    offerRules: {} as Record<string, string>,
    offerImage: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleExtractedData = (data: any) => {
    console.log("📝 === FORM DATA UPDATE ===")
    console.log("📝 Received data:", data)

    setFormData({
      offerName: data.offerName || "",
      offerHeadline: data.offerHeadline || "",
      offerBodyline: data.offerBodyline || "",
      offerStartDate: data.offerStartDate || "",
      offerEndDate: data.offerEndDate || "",
      earnAmount: data.earnAmount || "",
      earnType: data.earnType || "",
      earnDisplayText: data.earnDisplayText || "",
      simplePointExpiry: data.simplePointExpiry || "",
      offerDescription: data.offerDescription || "",
      offerRules: data.offerRules || {},
      offerImage: data.offerImage || "",
    })

    console.log("📝 Form updated with extracted data")
  }

  const handleClearForm = () => {
    setFormData({
      offerName: "",
      offerHeadline: "",
      offerBodyline: "",
      offerStartDate: "",
      offerEndDate: "",
      earnAmount: "",
      earnType: "",
      earnDisplayText: "",
      simplePointExpiry: "",
      offerDescription: "",
      offerRules: {},
      offerImage: "",
    })
  }

  const generateJsonData = () => {
    const jsonData = {
      offerName: formData.offerName,
      offerHeadline: formData.offerHeadline,
      offerBodyline: formData.offerBodyline,
      offerStartDate: formData.offerStartDate,
      offerEndDate: formData.offerEndDate,
      earnAmount: formData.earnAmount,
      earnType: formData.earnType,
      earnDisplayText: formData.earnDisplayText,
      simplePointExpiry: formData.simplePointExpiry,
      offerDescription: formData.offerDescription,
      offerRules: formData.offerRules,
      offerImage: formData.offerImage,
    }

    // Remove empty fields
    Object.keys(jsonData).forEach((key) => {
      if (jsonData[key] === "" || jsonData[key] === null || jsonData[key] === undefined) {
        delete jsonData[key]
      }
      // Remove empty objects
      if (typeof jsonData[key] === "object" && Object.keys(jsonData[key] || {}).length === 0) {
        delete jsonData[key]
      }
    })

    return jsonData
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Logo />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Offer Framework</h1>
                <p className="text-sm text-gray-600">AI-Powered Offer Creation & Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Enhanced
              </Badge>
              <Badge variant="outline">v2.0</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* AI Assistant Card */}
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <Zap className="w-5 h-5 mr-2" />
                  AI Offer Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Let AI extract offer details from your description and generate compelling marketing copy with
                  brand-specific images.
                </p>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Open AI Assistant
                  </Button>
                  <Button
                    onClick={handleClearForm}
                    variant="outline"
                    className="border-blue-200 text-blue-600 bg-transparent"
                  >
                    Clear Form
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Offer Details Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-purple-600" />
                  Offer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="offerName">Offer Name</Label>
                    <Input
                      id="offerName"
                      value={formData.offerName}
                      onChange={(e) => handleInputChange("offerName", e.target.value)}
                      placeholder="e.g., Kenmore Appliances"
                    />
                  </div>
                  <div>
                    <Label htmlFor="earnDisplayText">Earn Display Text</Label>
                    <Input
                      id="earnDisplayText"
                      value={formData.earnDisplayText}
                      onChange={(e) => handleInputChange("earnDisplayText", e.target.value)}
                      placeholder="e.g., 15% back in points"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="offerHeadline">Offer Headline</Label>
                  <Input
                    id="offerHeadline"
                    value={formData.offerHeadline}
                    onChange={(e) => handleInputChange("offerHeadline", e.target.value)}
                    placeholder="Catchy headline (AI generated)"
                  />
                </div>

                <div>
                  <Label htmlFor="offerBodyline">Offer Bodyline</Label>
                  <Input
                    id="offerBodyline"
                    value={formData.offerBodyline}
                    onChange={(e) => handleInputChange("offerBodyline", e.target.value)}
                    placeholder="Engaging description (AI generated)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="earnAmount">Earn Amount</Label>
                    <Input
                      id="earnAmount"
                      value={formData.earnAmount}
                      onChange={(e) => handleInputChange("earnAmount", e.target.value)}
                      placeholder="e.g., 150"
                    />
                  </div>
                  <div>
                    <Label htmlFor="earnType">Earn Type</Label>
                    <Input
                      id="earnType"
                      value={formData.earnType}
                      onChange={(e) => handleInputChange("earnType", e.target.value)}
                      placeholder="points/cashback"
                    />
                  </div>
                  <div>
                    <Label htmlFor="simplePointExpiry">Point Expiry</Label>
                    <Input
                      id="simplePointExpiry"
                      value={formData.simplePointExpiry}
                      onChange={(e) => handleInputChange("simplePointExpiry", e.target.value)}
                      placeholder="Expiry details"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date Range */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-600" />
                  Date Range
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Rules & Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-orange-600" />
                  Rules & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.keys(formData.offerRules).length > 0 ? (
                    Object.entries(formData.offerRules).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-700">{key}:</span>
                          <span className="ml-2 text-gray-600">{value}</span>
                        </div>
                        <Badge variant="secondary">{key.includes("Segment") ? "Segment" : "Rule"}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No rules extracted yet. Use AI Assistant to extract.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Offer Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.offerDescription}
                  onChange={(e) => handleInputChange("offerDescription", e.target.value)}
                  placeholder="Detailed offer description..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview & JSON */}
          <div className="space-y-6">
            {/* Offer Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  Offer Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg">
                  <div className="flex items-start space-x-4">
                    {formData.offerImage && (
                      <div className="flex-shrink-0">
                        <img
                          src={formData.offerImage || "/placeholder.svg"}
                          alt="Offer thumbnail"
                          className="w-24 h-24 rounded-lg object-cover border-2 border-white shadow-md"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {formData.offerHeadline || "Offer Headline"}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {formData.offerBodyline || "Offer description will appear here"}
                      </p>
                      <div className="flex items-center space-x-4">
                        <Badge className="bg-green-500 text-white">
                          {formData.earnDisplayText || "Reward details"}
                        </Badge>
                        {formData.offerName && <Badge variant="outline">{formData.offerName}</Badge>}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate JSON Button */}
            <Card className="border-purple-200">
              <CardHeader className="bg-purple-50">
                <CardTitle className="flex items-center text-purple-700">
                  <Code2 className="w-5 h-5 mr-2" />
                  JSON Output
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Generate structured JSON data from your offer details for API integration and data export.
                </p>
                <Button
                  onClick={() => setShowJson(!showJson)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Code2 className="w-4 h-4 mr-2" />
                  {showJson ? "Hide JSON" : "Generate JSON"}
                </Button>
              </CardContent>
            </Card>

            {/* JSON Display */}
            {showJson && <JsonDisplay data={generateJsonData()} title="Generated Offer JSON" />}
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onExtractData={handleExtractedData} />
    </div>
  )
}
