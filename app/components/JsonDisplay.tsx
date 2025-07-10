"use client"

import { useState } from "react"
import { Copy, Download, Eye, EyeOff, FileJson, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

interface JsonDisplayProps {
  data: any
  isVisible: boolean
  onToggle: () => void
}

function generateJsonData(data: any) {
  const cleanData = { ...data }

  // Remove empty fields
  Object.keys(cleanData).forEach((key) => {
    if (cleanData[key] === "" || cleanData[key] === null || cleanData[key] === undefined) {
      delete cleanData[key]
    }
    // Remove empty objects
    if (typeof cleanData[key] === "object" && Object.keys(cleanData[key] || {}).length === 0) {
      delete cleanData[key]
    }
  })

  return cleanData
}

export default function JsonDisplay({ data, isVisible, onToggle }: JsonDisplayProps) {
  const [copied, setCopied] = useState(false)

  const jsonData = generateJsonData(data)
  const jsonString = JSON.stringify(jsonData, null, 2)

  const fieldCount = Object.keys(jsonData).length
  const rulesCount = Object.keys(jsonData.offerRules || {}).length

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString)
      setCopied(true)
      toast({
        title: "JSON Copied!",
        description: "The JSON data has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy JSON to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    try {
      const blob = new Blob([jsonString], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `offer-data-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "JSON Downloaded!",
        description: "The JSON file has been downloaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download JSON file.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-purple-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileJson className="w-5 h-5 mr-2" />
            JSON Output
            <div className="flex items-center ml-3 space-x-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Hash className="w-3 h-3 mr-1" />
                {fieldCount} fields
              </Badge>
              {rulesCount > 0 && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  📋 {rulesCount} rules
                </Badge>
              )}
            </div>
          </div>
          <Button onClick={onToggle} variant="ghost" size="sm" className="text-white hover:bg-purple-700">
            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {!isVisible ? (
          <div className="text-center py-8">
            <FileJson className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">JSON Data Ready</h3>
            <p className="text-gray-500 mb-4">Click the eye icon above to view the structured JSON output</p>
            <Button onClick={onToggle} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Eye className="w-4 h-4 mr-2" />
              Show JSON
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Offer Name:</span>
                  <div className="font-medium">{jsonData.offerName || "Not set"}</div>
                </div>
                <div>
                  <span className="text-gray-500">Earn Amount:</span>
                  <div className="font-medium">{jsonData.earnDisplayText || "Not set"}</div>
                </div>
                <div>
                  <span className="text-gray-500">Start Date:</span>
                  <div className="font-medium">{jsonData.offerStartDate || "Not set"}</div>
                </div>
                <div>
                  <span className="text-gray-500">End Date:</span>
                  <div className="font-medium">{jsonData.offerEndDate || "Not set"}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button onClick={handleCopy} variant="outline" className="flex-1 bg-transparent" disabled={copied}>
                <Copy className="w-4 h-4 mr-2" />
                {copied ? "Copied!" : "Copy JSON"}
              </Button>
              <Button onClick={handleDownload} variant="outline" className="flex-1 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            {/* JSON Code */}
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96">
              <pre className="text-sm font-mono whitespace-pre-wrap">{jsonString}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
