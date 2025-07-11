"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Download, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface JsonDisplayProps {
  isOpen: boolean
  onClose: () => void
  data: any
}

export default function JsonDisplay({ isOpen, onClose, data }: JsonDisplayProps) {
  const jsonString = JSON.stringify(data, null, 2)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString)
    toast({
      title: "Copied!",
      description: "JSON data has been copied to clipboard.",
    })
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
      description: "JSON file has been saved to your downloads.",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-3xl max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>JSON Output</span>
            <div className="flex items-center space-x-2">
              <Button onClick={copyToClipboard} size="sm" variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button onClick={downloadJson} size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={onClose} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 border rounded-lg p-4">
          <pre className="text-sm font-mono whitespace-pre-wrap break-words">
            <code>{jsonString}</code>
          </pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export { JsonDisplay }
