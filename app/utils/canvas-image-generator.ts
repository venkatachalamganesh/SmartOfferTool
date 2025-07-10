// Enhanced Canvas Image Generator with LLM-driven content

interface ImageGenerationOptions {
  offerName: string
  earnAmount: string
  earnType: string
  offerText: string
  offerHeadline?: string
  offerBodyline?: string
  width?: number
  height?: number
  // NEW: LLM-extracted details for better image generation
  extractedBrand?: string
  extractedProducts?: string[]
  extractedCategory?: string
  extractedRules?: { [key: string]: string }
}

interface ThemeConfig {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    text: string
    background: string
  }
  patterns: string[]
  icons: (ctx: CanvasRenderingContext2D, size: number, details?: any) => void
}

// Enhanced themes with brand-specific detection
const THEMES: { [key: string]: ThemeConfig } = {
  kenmore: {
    name: "Kenmore Appliances",
    colors: {
      primary: "#1e3a8a", // Kenmore blue
      secondary: "#3b82f6",
      accent: "#60a5fa",
      text: "#ffffff",
      background: "#1e40af",
    },
    patterns: ["kenmore"],
    icons: (ctx, size, details) => {
      const scale = size / 120
      const centerX = size / 2
      const centerY = size / 2

      // Kenmore appliance icon (washer/dryer specific if mentioned)
      const isWasherDryer = details?.products?.some(
        (p: string) => p.toLowerCase().includes("washer") || p.toLowerCase().includes("dryer"),
      )

      if (isWasherDryer) {
        // Draw washer/dryer icon
        ctx.fillStyle = "#1e3a8a"

        // Washer body
        ctx.beginPath()
        ctx.roundRect((centerX - 20) * scale, (centerY - 15) * scale, 40 * scale, 30 * scale, 4 * scale)
        ctx.fill()

        // Door/window
        ctx.fillStyle = "#60a5fa"
        ctx.beginPath()
        ctx.arc(centerX * scale, (centerY - 5) * scale, 12 * scale, 0, 2 * Math.PI)
        ctx.fill()

        // Door inner
        ctx.fillStyle = "#1e40af"
        ctx.beginPath()
        ctx.arc(centerX * scale, (centerY - 5) * scale, 8 * scale, 0, 2 * Math.PI)
        ctx.fill()

        // Control panel
        ctx.fillStyle = "#3b82f6"
        ctx.fillRect((centerX - 15) * scale, (centerY - 25) * scale, 30 * scale, 6 * scale)

        // Control knobs
        ctx.fillStyle = "#ffffff"
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.arc((centerX - 10 + i * 10) * scale, (centerY - 22) * scale, 2 * scale, 0, 2 * Math.PI)
          ctx.fill()
        }

        // Brand text
        ctx.fillStyle = "#ffffff"
        ctx.font = `bold ${8 * scale}px Arial`
        ctx.textAlign = "center"
        ctx.fillText("KENMORE", centerX * scale, (centerY + 20) * scale)
      } else {
        // Generic appliance icon
        drawGenericAppliance(ctx, size, scale, centerX, centerY)
      }
    },
  },

  levis: {
    name: "Levi's Denim",
    colors: {
      primary: "#b91c1c", // Levi's red
      secondary: "#dc2626",
      accent: "#f87171",
      text: "#ffffff",
      background: "#991b1b",
    },
    patterns: ["levis", "levi's"],
    icons: (ctx, size, details) => {
      const scale = size / 120
      const centerX = size / 2
      const centerY = size / 2

      // Levi's jeans with red tab
      ctx.fillStyle = "#1e40af" // Denim blue

      // Jeans waistband
      ctx.beginPath()
      ctx.roundRect((centerX - 25) * scale, (centerY - 30) * scale, 50 * scale, 8 * scale, 2 * scale)
      ctx.fill()

      // Left leg
      ctx.beginPath()
      ctx.roundRect((centerX - 20) * scale, (centerY - 22) * scale, 16 * scale, 45 * scale, 3 * scale)
      ctx.fill()

      // Right leg
      ctx.beginPath()
      ctx.roundRect((centerX + 4) * scale, (centerY - 22) * scale, 16 * scale, 45 * scale, 3 * scale)
      ctx.fill()

      // Iconic Levi's red tab
      ctx.fillStyle = "#b91c1c"
      ctx.fillRect((centerX - 18) * scale, (centerY - 10) * scale, 8 * scale, 4 * scale)

      // White Levi's text on red tab
      ctx.fillStyle = "#ffffff"
      ctx.font = `bold ${3 * scale}px Arial`
      ctx.textAlign = "center"
      ctx.fillText("LEVI'S", (centerX - 14) * scale, (centerY - 7) * scale)

      // Pocket stitching
      ctx.strokeStyle = "#f87171"
      ctx.lineWidth = 1.5 * scale
      ctx.beginPath()
      ctx.roundRect((centerX - 18) * scale, (centerY - 15) * scale, 12 * scale, 10 * scale, 2 * scale)
      ctx.stroke()
    },
  },

  nike: {
    name: "Nike",
    colors: {
      primary: "#000000",
      secondary: "#374151",
      accent: "#f97316",
      text: "#ffffff",
      background: "#1f2937",
    },
    patterns: ["nike"],
    icons: (ctx, size, details) => {
      const scale = size / 120
      const centerX = size / 2
      const centerY = size / 2

      // Nike shoe with swoosh
      ctx.fillStyle = "#000000"

      // Shoe sole
      ctx.beginPath()
      ctx.ellipse(centerX * scale, (centerY + 10) * scale, 30 * scale, 8 * scale, 0, 0, 2 * Math.PI)
      ctx.fill()

      // Shoe upper
      ctx.fillStyle = "#374151"
      ctx.beginPath()
      ctx.ellipse(centerX * scale, (centerY - 5) * scale, 25 * scale, 15 * scale, 0, 0, 2 * Math.PI)
      ctx.fill()

      // Nike swoosh
      ctx.fillStyle = "#f97316"
      ctx.beginPath()
      ctx.moveTo((centerX - 15) * scale, (centerY - 5) * scale)
      ctx.quadraticCurveTo((centerX + 5) * scale, (centerY - 15) * scale, (centerX + 20) * scale, (centerY + 2) * scale)
      ctx.quadraticCurveTo((centerX + 15) * scale, (centerY + 5) * scale, (centerX - 10) * scale, (centerY + 2) * scale)
      ctx.closePath()
      ctx.fill()
    },
  },

  walmart: {
    name: "Walmart",
    colors: {
      primary: "#0071ce", // Walmart blue
      secondary: "#004c91",
      accent: "#ffc220", // Walmart yellow
      text: "#ffffff",
      background: "#004c91",
    },
    patterns: ["walmart"],
    icons: (ctx, size, details) => {
      const scale = size / 120
      const centerX = size / 2
      const centerY = size / 2

      // Walmart spark/star logo
      ctx.fillStyle = "#ffc220"

      // Draw Walmart spark (6-pointed star)
      const spokes = 6
      const outerRadius = 20 * scale
      const innerRadius = 8 * scale

      ctx.beginPath()
      for (let i = 0; i < spokes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius
        const angle = (i * Math.PI) / spokes
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fill()

      // Center circle
      ctx.fillStyle = "#0071ce"
      ctx.beginPath()
      ctx.arc(centerX * scale, centerY * scale, 6 * scale, 0, 2 * Math.PI)
      ctx.fill()
    },
  },

  target: {
    name: "Target",
    colors: {
      primary: "#cc0000", // Target red
      secondary: "#ff6666",
      accent: "#ffffff",
      text: "#ffffff",
      background: "#990000",
    },
    patterns: ["target"],
    icons: (ctx, size, details) => {
      const scale = size / 120
      const centerX = size / 2
      const centerY = size / 2

      // Target bullseye logo
      const rings = [20, 15, 10, 5]

      rings.forEach((radius, index) => {
        ctx.fillStyle = index % 2 === 0 ? "#cc0000" : "#ffffff"
        ctx.beginPath()
        ctx.arc(centerX * scale, centerY * scale, radius * scale, 0, 2 * Math.PI)
        ctx.fill()
      })
    },
  },

  // Keep existing themes but enhance them...
  denim: {
    name: "Denim & Fashion",
    colors: {
      primary: "#1e40af",
      secondary: "#3b82f6",
      accent: "#60a5fa",
      text: "#ffffff",
      background: "#1e3a8a",
    },
    patterns: ["levis", "jeans", "denim", "fashion", "clothing", "apparel"],
    icons: (ctx, size) => {
      const scale = size / 120
      const centerX = size / 2
      const centerY = size / 2

      // More realistic jeans representation
      ctx.fillStyle = "#1e40af"

      // Jeans waistband
      ctx.beginPath()
      ctx.roundRect((centerX - 25) * scale, (centerY - 30) * scale, 50 * scale, 8 * scale, 2 * scale)
      ctx.fill()

      // Left leg with realistic proportions
      ctx.beginPath()
      ctx.roundRect((centerX - 20) * scale, (centerY - 22) * scale, 16 * scale, 45 * scale, 3 * scale)
      ctx.fill()

      // Right leg
      ctx.beginPath()
      ctx.roundRect((centerX + 4) * scale, (centerY - 22) * scale, 16 * scale, 45 * scale, 3 * scale)
      ctx.fill()

      // Realistic pocket stitching
      ctx.strokeStyle = "#60a5fa"
      ctx.lineWidth = 1.5 * scale

      // Left pocket
      ctx.beginPath()
      ctx.roundRect((centerX - 18) * scale, (centerX - 15) * scale, 12 * scale, 10 * scale, 2 * scale)
      ctx.stroke()

      // Right pocket
      ctx.beginPath()
      ctx.roundRect((centerX + 6) * scale, (centerX - 15) * scale, 12 * scale, 10 * scale, 2 * scale)
      ctx.stroke()

      // Seam lines
      ctx.beginPath()
      ctx.moveTo((centerX - 12) * scale, (centerY - 20) * scale)
      ctx.lineTo((centerX - 12) * scale, (centerY + 20) * scale)
      ctx.moveTo((centerX + 12) * scale, (centerY - 20) * scale)
      ctx.lineTo((centerX + 12) * scale, (centerY + 20) * scale)
      ctx.stroke()

      // Belt loops
      ctx.fillStyle = "#3b82f6"
      for (let i = 0; i < 5; i++) {
        const x = (centerX - 20 + i * 10) * scale
        ctx.fillRect(x, (centerY - 32) * scale, 2 * scale, 6 * scale)
      }
    },
  },

  shoes: {
    name: "Footwear",
    colors: {
      primary: "#7c2d12",
      secondary: "#dc2626",
      accent: "#f87171",
      text: "#ffffff",
      background: "#991b1b",
    },
    patterns: ["shoes", "sneakers", "boots", "footwear", "nike", "adidas", "converse"],
    icons: (ctx, size) => {
      const scale = size / 120
      const centerX = size / 2
      const centerY = size / 2

      // Sneaker sole
      ctx.fillStyle = "#7c2d12"
      ctx.beginPath()
      ctx.ellipse(centerX * scale, (centerY + 10) * scale, 30 * scale, 8 * scale, 0, 0, 2 * Math.PI)
      ctx.fill()

      // Shoe upper
      ctx.fillStyle = "#dc2626"
      ctx.beginPath()
      ctx.ellipse(centerX * scale, (centerY - 5) * scale, 25 * scale, 15 * scale, 0, 0, 2 * Math.PI)
      ctx.fill()

      // Shoe laces
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2 * scale
      for (let i = 0; i < 4; i++) {
        const y = (centerY - 15 + i * 6) * scale
        ctx.beginPath()
        ctx.moveTo((centerX - 8) * scale, y)
        ctx.lineTo((centerX + 8) * scale, y)
        ctx.stroke()
      }

      // Nike-style swoosh
      ctx.strokeStyle = "#f87171"
      ctx.lineWidth = 3 * scale
      ctx.beginPath()
      ctx.moveTo((centerX - 15) * scale, (centerY - 5) * scale)
      ctx.quadraticCurveTo((centerX + 5) * scale, (centerY - 10) * scale, (centerX + 15) * scale, (centerY + 5) * scale)
      ctx.stroke()
    },
  },

  grocery: {
    name: "Grocery & Supermarket",
    colors: {
      primary: "#16a34a",
      secondary: "#22c55e",
      accent: "#4ade80",
      text: "#ffffff",
      background: "#15803d",
    },
    patterns: ["grocery", "supermarket", "walmart", "target", "kroger", "food", "produce"],
    icons: (ctx, size) => {
      const scale = size / 120
      const centerX = size / 2
      const centerY = size / 2

      // Shopping cart
      ctx.strokeStyle = "#16a34a"
      ctx.lineWidth = 3 * scale
      ctx.fillStyle = "#22c55e"

      // Cart body
      ctx.beginPath()
      ctx.roundRect((centerX - 15) * scale, (centerY - 10) * scale, 25 * scale, 15 * scale, 3 * scale)
      ctx.stroke()

      // Cart handle
      ctx.beginPath()
      ctx.moveTo((centerX + 10) * scale, (centerY - 10) * scale)
      ctx.lineTo((centerX + 20) * scale, (centerY - 20) * scale)
      ctx.stroke()

      // Cart wheels
      ctx.fillStyle = "#16a34a"
      ctx.beginPath()
      ctx.arc((centerX - 8) * scale, (centerY + 8) * scale, 3 * scale, 0, 2 * Math.PI)
      ctx.fill()
      ctx.beginPath()
      ctx.arc((centerX + 5) * scale, (centerY + 8) * scale, 3 * scale, 0, 2 * Math.PI)
      ctx.fill()

      // Items in cart
      ctx.fillStyle = "#4ade80"
      ctx.fillRect((centerX - 12) * scale, (centerY - 8) * scale, 4 * scale, 6 * scale)
      ctx.fillRect((centerX - 5) * scale, (centerY - 8) * scale, 4 * scale, 8 * scale)
      ctx.fillRect((centerX + 2) * scale, (centerY - 8) * scale, 4 * scale, 5 * scale)
    },
  },

  electronics: {
    name: "Electronics & Tech",
    colors: {
      primary: "#4338ca",
      secondary: "#6366f1",
      accent: "#8b5cf6",
      text: "#ffffff",
      background: "#3730a3",
    },
    patterns: ["electronics", "tech", "phone", "computer", "apple", "samsung", "gadget", "laptop"],
    icons: (ctx, size) => {
      const scale = size / 120
      const centerX = size / 2
      const centerY = size / 2

      // Smartphone with more detail
      ctx.fillStyle = "#4338ca"
      ctx.beginPath()
      ctx.roundRect((centerX - 12) * scale, (centerY - 20) * scale, 24 * scale, 40 * scale, 6 * scale)
      ctx.fill()

      // Screen
      ctx.fillStyle = "#1e1b4b"
      ctx.beginPath()
      ctx.roundRect((centerX - 10) * scale, (centerY - 15) * scale, 20 * scale, 25 * scale, 2 * scale)
      ctx.fill()

      // Screen content (app icons)
      ctx.fillStyle = "#6366f1"
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const x = (centerX - 6 + col * 4) * scale
          const y = (centerY - 10 + row * 4) * scale
          ctx.beginPath()
          ctx.roundRect(x, y, 2 * scale, 2 * scale, 0.5 * scale)
          ctx.fill()
        }
      }

      // Home button
      ctx.fillStyle = "#8b5cf6"
      ctx.beginPath()
      ctx.arc(centerX * scale, (centerY + 12) * scale, 2 * scale, 0, 2 * Math.PI)
      ctx.fill()

      // Camera
      ctx.fillStyle = "#1e1b4b"
      ctx.beginPath()
      ctx.arc(centerX * scale, (centerY - 16) * scale, 1.5 * scale, 0, 2 * Math.PI)
      ctx.fill()
    },
  },

  beauty: {
    name: "Beauty & Cosmetics",
    colors: {
      primary: "#be185d",
      secondary: "#ec4899",
      accent: "#f9a8d4",
      text: "#ffffff",
      background: "#9d174d",
    },
    patterns: ["beauty", "cosmetics", "makeup", "skincare", "sephora", "ulta", "lipstick"],
    icons: (ctx, size) => {
      const scale = size / 120
      const centerX = size / 2
      const centerY = size / 2

      // Lipstick
      ctx.fillStyle = "#be185d"
      ctx.beginPath()
      ctx.roundRect((centerX - 4) * scale, (centerY - 20) * scale, 8 * scale, 25 * scale, 2 * scale)
      ctx.fill()

      // Lipstick tip
      ctx.fillStyle = "#ec4899"
      ctx.beginPath()
      ctx.roundRect((centerX - 3) * scale, (centerY - 25) * scale, 6 * scale, 8 * scale, 3 * scale)
      ctx.fill()

      // Compact mirror
      ctx.fillStyle = "#f9a8d4"
      ctx.beginPath()
      ctx.arc((centerX + 15) * scale, (centerY - 5) * scale, 8 * scale, 0, 2 * Math.PI)
      ctx.fill()

      // Mirror reflection
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.arc((centerX + 15) * scale, (centerY - 5) * scale, 6 * scale, 0, 2 * Math.PI)
      ctx.fill()

      // Makeup brush
      ctx.strokeStyle = "#be185d"
      ctx.lineWidth = 2 * scale
      ctx.beginPath()
      ctx.moveTo((centerX - 15) * scale, (centerY + 15) * scale)
      ctx.lineTo((centerX - 8) * scale, (centerY + 8) * scale)
      ctx.stroke()

      // Brush tip
      ctx.fillStyle = "#ec4899"
      ctx.beginPath()
      ctx.arc((centerX - 8) * scale, (centerY + 8) * scale, 3 * scale, 0, 2 * Math.PI)
      ctx.fill()
    },
  },

  automotive: {
    name: "Automotive",
    colors: {
      primary: "#374151",
      secondary: "#6b7280",
      accent: "#9ca3af",
      text: "#ffffff",
      background: "#1f2937",
    },
    patterns: ["car", "auto", "automotive", "vehicle", "tire", "parts", "service"],
    icons: (ctx, size) => {
      const scale = size / 120
      const centerX = size / 2
      const centerY = size / 2

      // Car body
      ctx.fillStyle = "#374151"
      ctx.beginPath()
      ctx.roundRect((centerX - 20) * scale, (centerY - 8) * scale, 40 * scale, 16 * scale, 4 * scale)
      ctx.fill()

      // Car roof
      ctx.beginPath()
      ctx.roundRect((centerX - 12) * scale, (centerY - 16) * scale, 24 * scale, 12 * scale, 6 * scale)
      ctx.fill()

      // Wheels
      ctx.fillStyle = "#1f2937"
      ctx.beginPath()
      ctx.arc((centerX - 12) * scale, (centerY + 6) * scale, 6 * scale, 0, 2 * Math.PI)
      ctx.fill()
      ctx.beginPath()
      ctx.arc((centerX + 12) * scale, (centerY + 6) * scale, 6 * scale, 0, 2 * Math.PI)
      ctx.fill()

      // Wheel rims
      ctx.fillStyle = "#9ca3af"
      ctx.beginPath()
      ctx.arc((centerX - 12) * scale, (centerY + 6) * scale, 3 * scale, 0, 2 * Math.PI)
      ctx.fill()
      ctx.beginPath()
      ctx.arc((centerX + 12) * scale, (centerY + 6) * scale, 3 * scale, 0, 2 * Math.PI)
      ctx.fill()

      // Windows
      ctx.fillStyle = "#60a5fa"
      ctx.beginPath()
      ctx.roundRect((centerX - 10) * scale, (centerY - 14) * scale, 8 * scale, 8 * scale, 2 * scale)
      ctx.fill()
      ctx.beginPath()
      ctx.roundRect((centerX + 2) * scale, (centerY - 14) * scale, 8 * scale, 8 * scale, 2 * scale)
      ctx.fill()
    },
  },

  coffee: {
    name: "Coffee & Beverages",
    colors: {
      primary: "#92400e",
      secondary: "#d97706",
      accent: "#fbbf24",
      text: "#ffffff",
      background: "#78350f",
    },
    patterns: ["coffee", "starbucks", "cafe", "beverage", "drink", "latte", "espresso"],
    icons: (ctx, size) => {
      const scale = size / 120
      const centerX = size / 2
      const centerY = size / 2

      // Coffee cup with better proportions
      ctx.fillStyle = "#92400e"
      ctx.beginPath()
      ctx.roundRect((centerX - 12) * scale, (centerY - 15) * scale, 24 * scale, 30 * scale, 4 * scale)
      ctx.fill()

      // Coffee liquid
      ctx.fillStyle = "#78350f"
      ctx.beginPath()
      ctx.roundRect((centerX - 10) * scale, (centerY - 12) * scale, 20 * scale, 20 * scale, 2 * scale)
      ctx.fill()

      // Coffee foam/cream
      ctx.fillStyle = "#fbbf24"
      ctx.beginPath()
      ctx.ellipse(centerX * scale, (centerY - 10) * scale, 8 * scale, 3 * scale, 0, 0, 2 * Math.PI)
      ctx.fill()

      // Handle with better curve
      ctx.strokeStyle = "#d97706"
      ctx.lineWidth = 3 * scale
      ctx.beginPath()
      ctx.arc((centerX + 18) * scale, centerY * scale, 8 * scale, Math.PI * 0.3, Math.PI * 1.7)
      ctx.stroke()

      // Steam with more realistic curves
      ctx.strokeStyle = "#fbbf24"
      ctx.lineWidth = 2 * scale
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.moveTo((centerX - 6 + i * 6) * scale, (centerY - 18) * scale)
        ctx.quadraticCurveTo(
          (centerX - 4 + i * 6) * scale,
          (centerY - 25) * scale,
          (centerX - 6 + i * 6) * scale,
          (centerY - 30) * scale,
        )
        ctx.quadraticCurveTo(
          (centerX - 8 + i * 6) * scale,
          (centerY - 35) * scale,
          (centerX - 6 + i * 6) * scale,
          (centerY - 40) * scale,
        )
        ctx.stroke()
      }
    },
  },

  cashback: {
    name: "Cashback & Finance",
    colors: {
      primary: "#059669",
      secondary: "#10b981",
      accent: "#34d399",
      text: "#ffffff",
      background: "#047857",
    },
    patterns: ["cashback", "cash", "money", "finance", "bank", "credit", "reward"],
    icons: (ctx, size) => {
      const scale = size / 120
      const centerX = size / 2
      const centerY = size / 2

      // Dollar sign background circle with gradient effect
      const gradient = ctx.createRadialGradient(
        centerX * scale,
        centerY * scale,
        0,
        centerX * scale,
        centerY * scale,
        25 * scale,
      )
      gradient.addColorStop(0, "#10b981")
      gradient.addColorStop(1, "#059669")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX * scale, centerY * scale, 25 * scale, 0, 2 * Math.PI)
      ctx.fill()

      // Dollar sign with better typography
      ctx.fillStyle = "#ffffff"
      ctx.font = `bold ${28 * scale}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("$", centerX * scale, centerY * scale)

      // Animated sparkles around (positioned better)
      ctx.fillStyle = "#34d399"
      const sparkles = [
        [25 * scale, 25 * scale, 3 * scale],
        [95 * scale, 30 * scale, 2 * scale],
        [20 * scale, 90 * scale, 2.5 * scale],
        [100 * scale, 85 * scale, 3 * scale],
        [30 * scale, 60 * scale, 1.5 * scale],
        [90 * scale, 55 * scale, 2 * scale],
      ]

      sparkles.forEach(([x, y, radius]) => {
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, 2 * Math.PI)
        ctx.fill()
      })
    },
  },

  percentage: {
    name: "Percentage Deals",
    colors: {
      primary: "#dc2626",
      secondary: "#ef4444",
      accent: "#f87171",
      text: "#ffffff",
      background: "#b91c1c",
    },
    patterns: ["percent", "%", "off", "discount", "sale"],
    icons: (ctx, size) => {
      const scale = size / 120
      const centerX = size / 2
      const centerY = size / 2

      // Percentage circle with gradient
      const gradient = ctx.createRadialGradient(
        centerX * scale,
        centerY * scale,
        0,
        centerX * scale,
        centerY * scale,
        30 * scale,
      )
      gradient.addColorStop(0, "#ef4444")
      gradient.addColorStop(1, "#dc2626")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX * scale, centerY * scale, 30 * scale, 0, 2 * Math.PI)
      ctx.fill()

      // Percentage symbol with better font
      ctx.fillStyle = "#ffffff"
      ctx.font = `bold ${32 * scale}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("%", centerX * scale, centerY * scale)

      // Decorative dashed border
      ctx.strokeStyle = "#f87171"
      ctx.lineWidth = 2 * scale
      ctx.setLineDash([4 * scale, 4 * scale])
      ctx.beginPath()
      ctx.arc(centerX * scale, centerY * scale, 35 * scale, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.setLineDash([])

      // Corner accent marks
      ctx.fillStyle = "#f87171"
      const corners = [
        [centerX - 45, centerY - 45],
        [centerX + 45, centerY - 45],
        [centerX - 45, centerY + 45],
        [centerX + 45, centerY + 45],
      ]

      corners.forEach(([x, y]) => {
        ctx.beginPath()
        ctx.arc(x * scale, y * scale, 3 * scale, 0, 2 * Math.PI)
        ctx.fill()
      })
    },
  },

  default: {
    name: "General Offers",
    colors: {
      primary: "#f97316",
      secondary: "#fb923c",
      accent: "#fdba74",
      text: "#ffffff",
      background: "#ea580c",
    },
    patterns: [],
    icons: (ctx, size, details) => {
      // Enhanced default icon based on extracted details
      drawSmartDefaultIcon(ctx, size, details)
    },
  },
}

// Helper function for generic appliance
function drawGenericAppliance(
  ctx: CanvasRenderingContext2D,
  size: number,
  scale: number,
  centerX: number,
  centerY: number,
) {
  // Generic appliance shape
  ctx.fillStyle = "#374151"
  ctx.beginPath()
  ctx.roundRect((centerX - 18) * scale, (centerY - 20) * scale, 36 * scale, 40 * scale, 4 * scale)
  ctx.fill()

  // Door
  ctx.fillStyle = "#6b7280"
  ctx.beginPath()
  ctx.roundRect((centerX - 15) * scale, (centerY - 15) * scale, 30 * scale, 25 * scale, 2 * scale)
  ctx.fill()

  // Handle
  ctx.fillStyle = "#9ca3af"
  ctx.fillRect((centerX + 10) * scale, (centerY - 5) * scale, 3 * scale, 10 * scale)
}

// Smart default icon that adapts to extracted details
function drawSmartDefaultIcon(ctx: CanvasRenderingContext2D, size: number, details?: any) {
  const scale = size / 120
  const centerX = size / 2
  const centerY = size / 2

  if (details?.products) {
    const products = details.products.join(" ").toLowerCase()

    if (products.includes("appliance") || products.includes("washer") || products.includes("dryer")) {
      drawGenericAppliance(ctx, size, scale, centerX, centerY)
      return
    }

    if (products.includes("shoe") || products.includes("sneaker")) {
      // Draw shoe icon
      ctx.fillStyle = "#374151"
      ctx.beginPath()
      ctx.ellipse(centerX * scale, (centerY + 5) * scale, 25 * scale, 12 * scale, 0, 0, 2 * Math.PI)
      ctx.fill()
      return
    }

    if (products.includes("clothing") || products.includes("apparel")) {
      // Draw shirt icon
      ctx.fillStyle = "#374151"
      ctx.beginPath()
      ctx.roundRect((centerX - 15) * scale, (centerY - 10) * scale, 30 * scale, 25 * scale, 3 * scale)
      ctx.fill()
      return
    }
  }

  // Fallback to gift box
  ctx.fillStyle = "#f97316"
  ctx.beginPath()
  ctx.roundRect((centerX - 18) * scale, (centerY - 12) * scale, 36 * scale, 24 * scale, 4 * scale)
  ctx.fill()
}

// Enhanced theme detection using LLM data
function detectThemeFromLLMData(
  offerText: string,
  earnType: string,
  offerName?: string,
  extractedRules?: { [key: string]: string },
): ThemeConfig {
  const text = (offerText + " " + (offerName || "")).toLowerCase()

  console.log("🎨 === ENHANCED THEME DETECTION ===")
  console.log("🎨 Offer text:", text.substring(0, 100))
  console.log("🎨 Offer name:", offerName)
  console.log("🎨 Extracted rules:", extractedRules)

  // Brand-specific detection (highest priority)
  if (text.includes("kenmore")) {
    console.log("🎨 Detected: Kenmore brand")
    return THEMES.kenmore
  }

  if (text.includes("levis") || text.includes("levi's")) {
    console.log("🎨 Detected: Levi's brand")
    return THEMES.levis
  }

  if (text.includes("nike")) {
    console.log("🎨 Detected: Nike brand")
    return THEMES.nike
  }

  if (text.includes("walmart")) {
    console.log("🎨 Detected: Walmart brand")
    return THEMES.walmart
  }

  if (text.includes("target")) {
    console.log("🎨 Detected: Target brand")
    return THEMES.target
  }

  // Product category detection
  if (text.includes("appliance") || text.includes("washer") || text.includes("dryer")) {
    console.log("🎨 Detected: Appliance category")
    return THEMES.kenmore // Use appliance theme
  }

  // Fallback based on earn type
  if (earnType === "cashback") return THEMES.cashback || THEMES.default
  if (earnType === "percentage") return THEMES.percentage || THEMES.default

  console.log("🎨 Using enhanced default theme")
  return THEMES.default
}

// Main image generation function with LLM enhancement
export function generateEnhancedThumbnail(options: ImageGenerationOptions): string {
  const {
    offerName = "",
    earnAmount = "",
    earnType = "",
    offerText = "",
    offerHeadline = "",
    offerBodyline = "",
    width = 120,
    height = 120,
    extractedBrand = "",
    extractedProducts = [],
    extractedCategory = "",
    extractedRules = {},
  } = options

  console.log("🎨 === ENHANCED IMAGE GENERATION ===")
  console.log("🎨 Offer name:", offerName)
  console.log("🎨 Extracted brand:", extractedBrand)
  console.log("🎨 Extracted products:", extractedProducts)
  console.log("🎨 Extracted category:", extractedCategory)
  console.log("🎨 Extracted rules:", extractedRules)

  // Create canvas
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Could not get canvas context")
  }

  // Enhanced theme detection using LLM data
  const theme = detectThemeFromLLMData(offerText, earnType, offerName, extractedRules)
  console.log(`🎨 Using theme: ${theme.name}`)

  // Prepare enhanced details for icon generation
  const iconDetails = {
    brand: extractedBrand || offerName,
    products: extractedProducts,
    category: extractedCategory,
    rules: extractedRules,
    earnAmount,
    earnType,
  }

  // Draw layers
  createGradientBackground(ctx, width, height, theme)
  addDecorations(ctx, theme, width)

  // Draw the themed icon with LLM details
  theme.icons(ctx, width, iconDetails)

  // Enhanced text rendering
  if (offerHeadline || offerName) {
    drawEnhancedOfferText(ctx, offerName, offerHeadline, offerBodyline, earnAmount, earnType, theme, width, iconDetails)
  }

  // Convert to base64
  return canvas.toDataURL("image/png")
}

// Enhanced text rendering with brand context
function drawEnhancedOfferText(
  ctx: CanvasRenderingContext2D,
  offerName: string,
  offerHeadline: string,
  offerBodyline: string,
  earnAmount: string,
  earnType: string,
  theme: ThemeConfig,
  size: number,
  details: any,
) {
  const scale = size / 120
  const text = offerHeadline || offerName || "SPECIAL OFFER"

  // Enhanced background with brand context
  const bgOpacity = details.brand ? 0.9 : 0.8
  ctx.fillStyle = `rgba(0, 0, 0, ${bgOpacity})`
  ctx.fillRect(0, size - 35 * scale, size, 35 * scale)

  // Brand name if available
  if (details.brand && details.brand !== text) {
    ctx.fillStyle = theme.colors.accent
    ctx.font = `bold ${8 * scale}px Arial`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    let brandText = details.brand.toUpperCase()
    if (brandText.length > 12) {
      brandText = brandText.substring(0, 10) + "..."
    }

    ctx.fillText(brandText, size / 2, size - 28 * scale)
  }

  // Main text
  ctx.fillStyle = theme.colors.text
  ctx.font = `bold ${11 * scale}px Arial`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  let displayText = text.toUpperCase()
  if (displayText.length > 15) {
    displayText = displayText.substring(0, 12) + "..."
  }

  const textY = details.brand ? size - 18 * scale : size - 25 * scale
  ctx.fillText(displayText, size / 2, textY)

  // Reward info
  if (earnAmount) {
    ctx.font = `bold ${10 * scale}px Arial`
    ctx.fillStyle = theme.colors.accent

    let rewardText = ""
    if (earnType === "percentage") {
      rewardText = `GET ${(Number.parseFloat(earnAmount) / 10).toFixed(1)}% OFF!`
    } else if (earnType === "cashback") {
      rewardText = `GET ${earnAmount}% BACK!`
    } else if (earnType === "points") {
      const amount = Number.parseFloat(earnAmount)
      if (amount >= 1000) {
        rewardText = `GET $${(amount / 1000).toFixed(0)} POINTS!`
      } else {
        rewardText = `GET ${(amount / 10).toFixed(1)}% BACK!`
      }
    }

    const rewardY = details.brand ? size - 8 * scale : size - 12 * scale
    ctx.fillText(rewardText, size / 2, rewardY)
  }
}

// Create gradient background
function createGradientBackground(ctx: CanvasRenderingContext2D, width: number, height: number, theme: ThemeConfig) {
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, theme.colors.primary)
  gradient.addColorStop(0.6, theme.colors.secondary)
  gradient.addColorStop(1, theme.colors.background)

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Add subtle pattern overlay
  ctx.fillStyle = `${theme.colors.accent}20`
  for (let i = 0; i < width; i += 20) {
    for (let j = 0; j < height; j += 20) {
      if ((i + j) % 40 === 0) {
        ctx.fillRect(i, j, 2, 2)
      }
    }
  }
}

// Add decorative elements
function addDecorations(ctx: CanvasRenderingContext2D, theme: ThemeConfig, size: number) {
  const scale = size / 120

  // Corner decorations
  ctx.fillStyle = `${theme.colors.accent}60`

  // Top-left corner
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(20 * scale, 0)
  ctx.lineTo(0, 20 * scale)
  ctx.closePath()
  ctx.fill()

  // Bottom-right corner
  ctx.beginPath()
  ctx.moveTo(size, size)
  ctx.lineTo(size - 20 * scale, size)
  ctx.lineTo(size, size - 20 * scale)
  ctx.closePath()
  ctx.fill()
}
