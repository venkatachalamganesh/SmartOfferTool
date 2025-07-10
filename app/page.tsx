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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Logo />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Smart Offer Framework
                </h1>
                <p className="text-sm text-gray-600">AI-Powered Offer Creation & Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setIsChatOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Offer Assistant
              </Button>
              <Button onClick={() => setIsJsonOpen(true)} variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                View JSON
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-blue-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="offerName">Offer Name</Label>
                    <Input
                      id="offerName"
                      value={offerData.offerName}
                      onChange={(e) => handleInputChange("offerName", e.target.value)}
                      placeholder="e.g., Kenmore Appliances"
                    />
                  </div>
                  <div>
                    <Label htmlFor="earnType">Earn Type</Label>
                    <Select value={offerData.earnType} onValueChange={(value) => handleInputChange("earnType", value)}>
                      <SelectTrigger>
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
                  <Label htmlFor="offerHeadline">Offer Headline</Label>
                  <Input
                    id="offerHeadline"
                    value={offerData.offerHeadline}
                    onChange={(e) => handleInputChange("offerHeadline", e.target.value)}
                    placeholder="e.g., Appliance Deals & Rewards!"
                  />
                </div>

                <div>
                  <Label htmlFor="offerBodyline">Offer Description</Label>
                  <Textarea
                    id="offerBodyline"
                    value={offerData.offerBodyline}
                    onChange={(e) => handleInputChange("offerBodyline", e.target.value)}
                    placeholder="e.g., Save on Kenmore appliances and earn rewards!"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Reward Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Reward Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="earnAmount">Earn Amount</Label>
                    <Input
                      id="earnAmount"
                      value={offerData.earnAmount}
                      onChange={(e) => handleInputChange("earnAmount", e.target.value)}
                      placeholder="e.g., 15"
                    />
                  </div>
                  <div>
                    <Label htmlFor="earnDisplayText">Display Text</Label>
                    <Input
                      id="earnDisplayText"
                      value={offerData.earnDisplayText}
                      onChange={(e) => handleInputChange("earnDisplayText", e.target.value)}
                      placeholder="e.g., 15% back in points"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="simplePointExpiry">Point Expiry</Label>
                  <Input
                    id="simplePointExpiry"
                    value={offerData.simplePointExpiry}
                    onChange={(e) => handleInputChange("simplePointExpiry", e.target.value)}
                    placeholder="e.g., Points expire 30 days after earning"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Date Range */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                  Offer Period
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="offerStartDate">Start Date</Label>
                    <Input
                      id="offerStartDate"
                      type="date"
                      value={offerData.offerStartDate}
                      onChange={(e) => handleInputChange("offerStartDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="offerEndDate">End Date</Label>
                    <Input
                      id="offerEndDate"
                      type="date"
                      value={offerData.offerEndDate}
                      onChange={(e) => handleInputChange("offerEndDate", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Offer Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-orange-600" />
                    Offer Rules
                  </div>
                  <Button onClick={addNewRule} size="sm" variant="outline">
                    Add Rule
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(offerData.offerRules).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
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
                      className="flex-1"
                    />
                    <Input
                      value={value}
                      onChange={(e) => handleRuleChange(key, e.target.value)}
                      placeholder="Rule value"
                      className="flex-1"
                    />
                    <Button onClick={() => removeRule(key)} size="sm" variant="destructive">
                      Remove
                    </Button>
                  </div>
                ))}
                {Object.keys(offerData.offerRules).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No rules added yet. Click "Add Rule" to get started.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            {/* Offer Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-600" />
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
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  <div className="text-center space-y-2">
                    <h3 className="font-bold text-lg">{offerData.offerHeadline || "Your Offer Headline"}</h3>
                    <p className="text-gray-600">
                      {offerData.offerBodyline || "Your offer description will appear here"}
                    </p>
                    {offerData.earnDisplayText && (
                      <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                        {offerData.earnDisplayText}
                      </Badge>
                    )}
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
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
                            <li key={key}>
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
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={downloadJson} className="w-full bg-transparent" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download JSON
                </Button>
                <Button onClick={() => setIsJsonOpen(true)} className="w-full" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  View JSON Output
                </Button>
                <Button
                  onClick={() => setIsChatOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
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
