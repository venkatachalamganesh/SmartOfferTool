"use client"

import { Sparkles } from "lucide-react"

export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
      <div className="hidden sm:block">
        <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Smart Offer
        </div>
        <div className="text-xs text-gray-500 -mt-1">Framework</div>
      </div>
    </div>
  )
}

export { Logo }
