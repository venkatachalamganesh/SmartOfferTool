"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface JsonDisplayProps {
  jsonData: string
  onCopy: () => void
}

export default function JsonDisplay({ jsonData, onCopy }: JsonDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonData)
      setCopied(true)
      onCopy()
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <Card className="border-blue-200 shadow-lg">
      <CardHeader className="bg-blue-100">
        <CardTitle className="flex items-center justify-between text-blue-800">
          <span>Generated JSON</span>
          <Button onClick={handleCopy} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy JSON
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <pre className="bg-gray-900 text-green-400 p-4 rounded-b-lg overflow-x-auto text-sm font-mono max-h-96 overflow-y-auto">
          {jsonData}
        </pre>
      </CardContent>
    </Card>
  )
}
