"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, CheckCircle, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface JsonDisplayProps {
  isOpen: boolean
  onClose: () => void
  data: any
}

export function JsonDisplay({ isOpen, onClose, data }: JsonDisplayProps) {
  const [copied, setCopied] = useState(false)

  const jsonString = JSON.stringify(data, null, 2)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "JSON data copied to clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const downloadJson = () => {
    const blob = new Blob([jsonString], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${data.offerName || "offer"}-data.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded!",
      description: "JSON file has been downloaded.",
    })
  }

  const getDataStats = () => {
    const stats = {
      totalFields: 0,
      filledFields: 0,
      rules: Object.keys(data.offerRules || {}).length,
    }

    Object.entries(data).forEach(([key, value]) => {
      if (key !== "offerRules") {
        stats.totalFields++
        if (value && value !== "") {
          stats.filledFields++
        }
      }
    })

    stats.totalFields += stats.rules
    stats.filledFields += stats.rules

    return stats
  }

  const stats = getDataStats()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              JSON Output
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {stats.filledFields}/{stats.totalFields} fields
              </Badge>
              <Badge variant="outline">{stats.rules} rules</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Stats Bar */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.filledFields}</div>
                <div className="text-sm text-gray-600">Filled Fields</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.rules}</div>
                <div className="text-sm text-gray-600">Rules</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((stats.filledFields / stats.totalFields) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
          </div>

          {/* JSON Content */}
          <ScrollArea className="flex-1 border rounded-lg">
            <pre className="p-4 text-sm font-mono bg-gray-50 whitespace-pre-wrap">
              <code>{jsonString}</code>
            </pre>
          </ScrollArea>

          {/* Actions */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              {data.offerName ? `${data.offerName} Offer Data` : "Offer Data"}
            </div>
            <div className="flex space-x-2">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy JSON
                  </>
                )}
              </Button>
              <Button onClick={downloadJson} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
