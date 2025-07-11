"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Brain, Download, FileText, Sparkles, Calendar, DollarSign, Users, Tag } from "lucide-react"
import { ChatModal } from "./components/ChatModal"
import { JsonDisplay } from "./components/JsonDisplay"
import { Logo } from "./components/Logo"
import { toast } from "@/hooks/use-toast"

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
  offerRules: Record<string, string>
  offerImage?: string
}

export default function SmartOfferFramework() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isJsonOpen, setIsJsonOpen] = useState(false)
  const [offerData, setOfferData] = useState<OfferData>({
    offerName: "",
    offerHeadline: "",
    offerBodyline: "",
    earnAmount: "",
    earnType: "percentage",
    earnDisplayText: "",
    offerStartDate: "",
    offerEndDate: "",
    simplePointExpiry: "",
    offerRules: {},
  })

  const handleExtractData = (data: OfferData) => {
    console.log("📊 Received extracted data:", data)
    setOfferData(data)
    toast({
      title: "Data Extracted Successfully!",
      description: "Form has been populated with extracted offer details.",
    })
  }

  const handleInputChange = (field: keyof OfferData, value: string) => {
    setOfferData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleRuleChange = (ruleKey: string, ruleValue: string) => {
    setOfferData((prev) => ({
      ...prev,
      offerRules: {
        ...prev.offerRules,
        [ruleKey]: ruleValue,
      },
    }))
  }

  const addNewRule = () => {
    const newRuleKey = `Rule ${Object.keys(offerData.offerRules).length + 1}`
    handleRuleChange(newRuleKey, "")
  }

  const removeRule = (ruleKey: string) => {
    setOfferData((prev) => {
      const newRules = { ...prev.offerRules }
      delete newRules[ruleKey]
      return {
        ...prev,
        offerRules: newRules,
      }
    })
  }

  const generateJsonOutput = () => {
    const jsonOutput = {
      offerName: offerData.offerName,
      offerHeadline: offerData.offerHeadline,
      offerBodyline: offerData.offerBodyline,
      earnAmount: offerData.earnAmount,
      earnType: offerData.earnType,
      earnDisplayText: offerData.earnDisplayText,
      offerStartDate: offerData.offerStartDate,
      offerEndDate: offerData.offerEndDate,
      simplePointExpiry: offerData.simplePointExpiry,
      offerRules: offerData.offerRules,
      ...(offerData.offerImage && { offerImage: offerData.offerImage }),
    }
    return jsonOutput
  }

  const downloadJson = () => {
    const jsonOutput = generateJsonOutput()
    const blob = new Blob([JSON.stringify(jsonOutput, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${offerData.offerName || "offer"}-data.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "JSON Downloaded!",
      description: "Offer data has been saved as JSON file.",
    })
  }

  // Helper function to get responsive font size for offer name
  const getOfferNameFontSize = (name: string) => {
    if (name.length > 25) return "text-xs"
    if (name.length > 20) return "text-sm"
    if (name.length > 15) return "text-base"
    return "text-lg"
  }

  // Helper function to get points per dollar label
  const getPointsPerDollarLabel = () => {
    if (offerData.earnType === "points") {
      // Show label for percentage-based points (back in points, cashback)
      if (
        offerData.earnDisplayText?.includes("% back in points") ||
        offerData.earnDisplayText?.includes("% cashback")
      ) {
        return "points per dollar"
      }
    }
    return ""
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Logo />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Smart Offer Framework
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">AI-Powered Offer Creation & Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                onClick={() => setIsChatOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs sm:text-sm px-2 sm:px-4"
                size="sm"
              >
                <Brain className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">AI Offer Assistant</span>
                <span className="sm:hidden">AI</span>
              </Button>
              <Button
                onClick={() => setIsJsonOpen(true)}
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm px-2 sm:px-4"
              >
                <FileText className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">View JSON</span>
                <span className="sm:hidden">JSON</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Tag className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-blue-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="offerName" className="text-sm">
                      Offer Name
                    </Label>
                    <Input
                      id="offerName"
                      value={offerData.offerName}
                      onChange={(e) => handleInputChange("offerName", e.target.value)}
                      placeholder="e.g., Kenmore Appliances"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="earnType" className="text-sm">
                      Earn Type
                    </Label>
                    <Select value={offerData.earnType} onValueChange={(value) => handleInputChange("earnType", value)}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="points">Points</SelectItem>
                        <SelectItem value="cashback">Cashback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="offerHeadline" className="text-sm">
                    Offer Headline
                  </Label>
                  <Input
                    id="offerHeadline"
                    value={offerData.offerHeadline}
                    onChange={(e) => handleInputChange("offerHeadline", e.target.value)}
                    placeholder="e.g., Appliance Deals & Rewards!"
                    className="text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="offerBodyline" className="text-sm">
                    Offer Description
                  </Label>
                  <Textarea
                    id="offerBodyline"
                    value={offerData.offerBodyline}
                    onChange={(e) => handleInputChange("offerBodyline", e.target.value)}
                    placeholder="e.g., Save on Kenmore appliances and earn rewards!"
                    rows={3}
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Reward Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <DollarSign className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-green-600" />
                  Reward Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="earnAmount" className="text-sm">
                      Earn Amount
                      {getPointsPerDollarLabel() && (
                        <span className="text-xs text-gray-500 ml-1">({getPointsPerDollarLabel()})</span>
                      )}
                    </Label>
                    <Input
                      id="earnAmount"
                      value={offerData.earnAmount}
                      onChange={(e) => handleInputChange("earnAmount", e.target.value)}
                      placeholder="e.g., 15"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="earnDisplayText" className="text-sm">
                      Display Text
                    </Label>
                    <Input
                      id="earnDisplayText"
                      value={offerData.earnDisplayText}
                      onChange={(e) => handleInputChange("earnDisplayText", e.target.value)}
                      placeholder="e.g., 15% back in points"
                      className="text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="simplePointExpiry" className="text-sm">
                    Point Expiry
                  </Label>
                  <Input
                    id="simplePointExpiry"
                    value={offerData.simplePointExpiry}
                    onChange={(e) => handleInputChange("simplePointExpiry", e.target.value)}
                    placeholder="e.g., Points expire 30 days after earning"
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Date Range */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Calendar className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-purple-600" />
                  Offer Period
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="offerStartDate" className="text-sm">
                      Start Date
                    </Label>
                    <Input
                      id="offerStartDate"
                      type="date"
                      value={offerData.offerStartDate}
                      onChange={(e) => handleInputChange("offerStartDate", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="offerEndDate" className="text-sm">
                      End Date
                    </Label>
                    <Input
                      id="offerEndDate"
                      type="date"
                      value={offerData.offerEndDate}
                      onChange={(e) => handleInputChange("offerEndDate", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Offer Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                  <div className="flex items-center">
                    <Users className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-orange-600" />
                    Offer Rules
                  </div>
                  <Button onClick={addNewRule} size="sm" variant="outline" className="text-xs bg-transparent">
                    Add Rule
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(offerData.offerRules).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2"
                  >
                    <Input
                      value={key}
                      onChange={(e) => {
                        const newKey = e.target.value
                        const newRules = { ...offerData.offerRules }
                        delete newRules[key]
                        newRules[newKey] = value
                        setOfferData((prev) => ({ ...prev, offerRules: newRules }))
                      }}
                      placeholder="Rule name"
                      className="flex-1 text-sm"
                    />
                    <Input
                      value={value}
                      onChange={(e) => handleRuleChange(key, e.target.value)}
                      placeholder="Rule value"
                      className="flex-1 text-sm"
                    />
                    <Button
                      onClick={() => removeRule(key)}
                      size="sm"
                      variant="destructive"
                      className="text-xs w-full sm:w-auto"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {Object.keys(offerData.offerRules).length === 0 && (
                  <p className="text-gray-500 text-center py-4 text-sm">
                    No rules added yet. Click "Add Rule" to get started.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-4 sm:space-y-6">
            {/* Offer Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-yellow-600" />
                  Offer Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {offerData.offerImage && (
                    <div className="flex justify-center">
                      <img
                        src={offerData.offerImage || "/placeholder.svg"}
                        alt="Offer"
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  <div className="text-center space-y-2">
                    <h3
                      className={`font-bold ${getOfferNameFontSize(offerData.offerHeadline || "Your Offer Headline")} leading-tight`}
                    >
                      {offerData.offerHeadline || "Your Offer Headline"}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed break-words">
                      {offerData.offerBodyline || "Your offer description will appear here"}
                    </p>
                    {offerData.earnDisplayText && (
                      <Badge className="bg-green-100 text-green-800 text-sm sm:text-base px-2 sm:px-3 py-1">
                        {offerData.earnDisplayText}
                      </Badge>
                    )}
                  </div>
                  <Separator />
                  <div className="space-y-2 text-xs sm:text-sm">
                    {offerData.offerStartDate && offerData.offerEndDate && (
                      <p>
                        <strong>Valid:</strong> {offerData.offerStartDate} to {offerData.offerEndDate}
                      </p>
                    )}
                    {offerData.simplePointExpiry && (
                      <p>
                        <strong>Expiry:</strong> {offerData.simplePointExpiry}
                      </p>
                    )}
                    {Object.keys(offerData.offerRules).length > 0 && (
                      <div>
                        <strong>Rules:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {Object.entries(offerData.offerRules).map(([key, value]) => (
                            <li key={key} className="break-words">
                              {key}: {value}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={downloadJson} className="w-full bg-transparent text-sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download JSON
                </Button>
                <Button onClick={() => setIsJsonOpen(true)} className="w-full text-sm" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  View JSON Output
                </Button>
                <Button
                  onClick={() => setIsChatOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Open AI Assistant
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modals */}
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} onExtractData={handleExtractData} />

      <JsonDisplay isOpen={isJsonOpen} onClose={() => setIsJsonOpen(false)} data={generateJsonOutput()} />
    </div>
  )
}
