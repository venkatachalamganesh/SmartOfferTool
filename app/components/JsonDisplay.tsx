"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Download, Eye, EyeOff, Code2 } from "lucide-react"

interface JsonDisplayProps {
  data: any
  title?: string
  onClose?: () => void
}

export default function JsonDisplay({ data, title = "Generated JSON", onClose }: JsonDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

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
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `offer-${jsonData.offerName || "data"}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="border-purple-200">
      <CardHeader className="bg-purple-50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Code2 className="w-5 h-5 mr-2 text-purple-600" />
            {title}
            <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-800">
              {fieldCount} fields
            </Badge>
            {rulesCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                {rulesCount} rules
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:bg-purple-100"
            >
              {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            {onClose && (
              <Button onClick={onClose} variant="ghost" size="sm" className="text-purple-600 hover:bg-purple-100">
                ×
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {fieldCount === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Code2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No Data Available</p>
            <p className="text-sm">Use the AI Assistant to extract offer data</p>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Offer Name:</span>
                  <span className="ml-2 text-gray-600">{jsonData.offerName || "Not set"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Earn Display:</span>
                  <span className="ml-2 text-gray-600">{jsonData.earnDisplayText || "Not set"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Start Date:</span>
                  <span className="ml-2 text-gray-600">{jsonData.offerStartDate || "Not set"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">End Date:</span>
                  <span className="ml-2 text-gray-600">{jsonData.offerEndDate || "Not set"}</span>
                </div>
              </div>
            </div>

            {/* JSON Code */}
            {isExpanded && (
              <div className="mb-4">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono max-h-96 overflow-y-auto">
                  {jsonString}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied!" : "Copy JSON"}
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                variant="outline"
                size="sm"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                {isExpanded ? "Hide" : "View"} Code
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
