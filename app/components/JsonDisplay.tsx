"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Download, Eye, EyeOff, FileJson, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface JsonDisplayProps {
  data: any
  isVisible?: boolean
  onToggle?: () => void
}

export default function JsonDisplay({ data, isVisible = true, onToggle }: JsonDisplayProps) {
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)

  // Clean and prepare JSON data
  const cleanData = () => {
    const cleaned = { ...data }

    // Remove empty fields
    Object.keys(cleaned).forEach((key) => {
      if (cleaned[key] === "" || cleaned[key] === null || cleaned[key] === undefined) {
        delete cleaned[key]
      }
      // Remove empty objects
      if (typeof cleaned[key] === "object" && Object.keys(cleaned[key] || {}).length === 0) {
        delete cleaned[key]
      }
    })

    return cleaned
  }

  const jsonData = cleanData()
  const jsonString = JSON.stringify(jsonData, null, 2)
  const fieldCount = Object.keys(jsonData).length
  const rulesCount = Object.keys(jsonData.offerRules || {}).length

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "JSON data copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `offer-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded!",
      description: "JSON file has been downloaded",
    })
  }

  if (!isVisible) {
    return (
      <Card className="border-purple-200">
        <CardHeader className="bg-purple-50">
          <CardTitle className="flex items-center justify-between text-purple-700">
            <div className="flex items-center">
              <FileJson className="w-5 h-5 mr-2" />
              JSON Output
            </div>
            {onToggle && (
              <Button onClick={onToggle} variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-gray-600">Click to view generated JSON data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-purple-200">
      <CardHeader className="bg-purple-50">
        <CardTitle className="flex items-center justify-between text-purple-700">
          <div className="flex items-center">
            <FileJson className="w-5 h-5 mr-2" />
            JSON Output
            <div className="flex items-center ml-3 space-x-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {fieldCount} fields
              </Badge>
              {rulesCount > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {rulesCount} rules
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setShowCode(!showCode)} variant="ghost" size="sm" className="text-purple-600">
              {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            {onToggle && (
              <Button onClick={onToggle} variant="ghost" size="sm" className="text-purple-600">
                <EyeOff className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Summary View */}
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-1 gap-2 text-sm">
            {jsonData.offerName && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Offer Name:</span>
                <span className="text-gray-900">{jsonData.offerName}</span>
              </div>
            )}
            {jsonData.offerHeadline && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Headline:</span>
                <span className="text-gray-900 truncate ml-2">{jsonData.offerHeadline}</span>
              </div>
            )}
            {jsonData.earnDisplayText && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Reward:</span>
                <Badge className="bg-green-100 text-green-800">{jsonData.earnDisplayText}</Badge>
              </div>
            )}
            {jsonData.offerStartDate && jsonData.offerEndDate && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Duration:</span>
                <span className="text-gray-900 text-xs">
                  {jsonData.offerStartDate} to {jsonData.offerEndDate}
                </span>
              </div>
            )}
          </div>

          {/* Rules Summary */}
          {rulesCount > 0 && (
            <div className="border-t pt-3">
              <h4 className="font-medium text-gray-700 mb-2">Rules & Conditions:</h4>
              <div className="space-y-1">
                {Object.entries(jsonData.offerRules).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-gray-600">{key}:</span>
                    <span className="text-gray-900 font-medium">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Code View */}
        {showCode && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-700">JSON Code:</h4>
              <div className="flex space-x-2">
                <Button
                  onClick={handleCopy}
                  size="sm"
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  onClick={handleDownload}
                  size="sm"
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            <ScrollArea className="h-64 w-full border rounded-lg">
              <pre className="p-4 text-xs font-mono bg-gray-50 text-gray-800 overflow-x-auto">{jsonString}</pre>
            </ScrollArea>
          </div>
        )}

        {/* Action Buttons */}
        {!showCode && (
          <div className="flex space-x-2 pt-3 border-t">
            <Button
              onClick={() => setShowCode(true)}
              variant="outline"
              className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Code
            </Button>
            <Button
              onClick={handleCopy}
              variant="outline"
              className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { JsonDisplay }
