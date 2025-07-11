"use client"

import { Sparkles } from "lucide-react"

export function Logo() {
  return (
    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
      <Sparkles className="w-6 h-6 text-white" />
    </div>
  )
}
