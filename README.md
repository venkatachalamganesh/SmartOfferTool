# Smart Offer Framework

A comprehensive AI-powered offer creation and management platform built with Next.js 15, featuring intelligent data extraction, real-time form population, and automated image generation.

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/ganesh-venkatachalams-projects/v0-smart-offer-framework)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/A43YpBKuycs)

## 🚀 Overview

The Smart Offer Framework is designed to streamline the process of creating, managing, and deploying promotional offers. It combines artificial intelligence with intuitive user interfaces to extract offer details from natural language descriptions and automatically generate structured data outputs.

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## ✨ Key Features

### 🤖 AI-Powered Extraction
- **OpenAI Integration**: Intelligent parsing of offer descriptions using GPT-4
- **Regex Fallback**: Reliable pattern matching when AI services are unavailable
- **Auto-Close Assistant**: Modal automatically closes after successful data extraction
- **Real-time Processing**: Live feedback during extraction process

### 🎨 Smart Canvas Image Generation
- **Brand-Specific Themes**: Automatic theme detection for major brands (Kenmore, Levi's, Nike, etc.)
- **Dynamic Image Creation**: Canvas-based thumbnail generation with brand colors
- **Category-Aware Icons**: Context-sensitive icons based on product categories
- **Responsive Design**: Images optimized for various display sizes

### 📊 Comprehensive Form Management
- **Dynamic Form Population**: Extracted data automatically fills form fields
- **Rule Management**: Add, edit, and remove offer rules dynamically
- **Date Range Selection**: Built-in date pickers for offer validity periods
- **Reward Configuration**: Support for multiple reward types (percentage, fixed, points, cashback)

### 📄 JSON Export & Management
- **Structured Output**: Clean, standardized JSON format
- **Download Functionality**: Export offer data as JSON files
- **Real-time Preview**: Live JSON viewer with syntax highlighting
- **Data Validation**: Ensures all required fields are properly formatted

## 🛠 Technologies Used

### Frontend Framework
- **Next.js 15.2.4**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript 5**: Type-safe development

### UI/UX Libraries
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icon library
- **shadcn/ui**: Pre-built component system

### AI & Machine Learning
- **AI SDK 3.4.32**: Vercel's AI SDK for LLM integration
- **@ai-sdk/openai 0.0.66**: OpenAI provider for AI SDK
- **GPT-4**: Advanced language model for text extraction

### Form Management
- **React Hook Form 7.54.1**: Performant form library
- **Zod 3.23.8**: TypeScript-first schema validation
- **@hookform/resolvers**: Form validation resolvers

### Styling & Animation
- **tailwindcss-animate**: Animation utilities
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility

### Additional Libraries
- **date-fns**: Date manipulation and formatting
- **sonner**: Toast notifications
- **cmdk**: Command palette component
- **recharts**: Chart and data visualization

## 🔌 Integrations

### OpenAI Integration
The application integrates with OpenAI's GPT-4 model for intelligent offer extraction:

\`\`\`typescript
// API Route: /api/openai-extract
const result = await generateText({
  model: openai("gpt-4o"),
  prompt: extractionPrompt,
  maxTokens: 1000,
  temperature: 0.3,
})
\`\`\`

**Features:**
- Natural language processing for offer descriptions
- Structured JSON output generation
- Error handling with regex fallback
- Rate limiting and cost optimization

### Smart Canvas Integration
Custom canvas-based image generation system:

\`\`\`typescript
// Enhanced Canvas Image Generator
export function generateEnhancedThumbnail(options: ImageGenerationOptions): string {
  // Brand detection and theme application
  // Dynamic icon generation
  // Gradient backgrounds and styling
}
\`\`\`

**Capabilities:**
- Brand-specific color schemes and icons
- Product category recognition
- Responsive image sizing
- Base64 data URL output

## 📁 Project Structure

\`\`\`
smart-offer-framework/
├── app/
│   ├── api/
│   │   └── openai-extract/
│   │       └── route.ts          # OpenAI API integration
│   ├── components/
│   │   ├── ChatModal.tsx         # AI Assistant interface
│   │   ├── JsonDisplay.tsx       # JSON viewer and export
│   │   └── Logo.tsx              # Application branding
│   ├── utils/
│   │   └── canvas-image-generator.ts  # Image generation logic
│   ├── globals.css               # Global styles and Tailwind config
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Main application interface
├── components/
│   ├── ui/                       # shadcn/ui components
│   └── theme-provider.tsx        # Dark/light theme management
├── hooks/
│   ├── use-mobile.tsx            # Mobile detection hook
│   └── use-toast.ts              # Toast notification hook
├── lib/
│   └── utils.ts                  # Utility functions
└── public/                       # Static assets
\`\`\`

## 🎯 Core Functionality

### 1. Offer Extraction Workflow
1. **Input**: User provides offer description via AI Assistant
2. **Processing**: OpenAI extracts structured data or regex fallback
3. **Generation**: Smart Canvas creates brand-specific thumbnail
4. **Population**: Form fields automatically filled with extracted data
5. **Export**: JSON output available for download

### 2. Form Management
- **Dynamic Fields**: Add/remove offer rules on demand
- **Validation**: Real-time form validation with error handling
- **Preview**: Live preview of offer appearance
- **Export**: Multiple export formats (JSON, download)

### 3. AI Assistant Features
- **Test Prompts**: Pre-built examples for common offer types
- **Status Indicators**: Real-time processing status
- **Auto-Close**: Automatic modal closure after successful extraction
- **Error Handling**: Graceful fallback to regex parsing

## 🔧 Configuration

### Environment Variables
\`\`\`bash
# Required for OpenAI integration
OPENAI_API_KEY=your_openai_api_key_here
\`\`\`

### Build Configuration
\`\`\`javascript
// next.config.mjs
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['canvas']
  }
}
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm package manager
- OpenAI API key (optional, regex fallback available)

### Installation
\`\`\`bash
# Clone the repository
git clone <repository-url>
cd smart-offer-framework

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your OPENAI_API_KEY to .env.local

# Run development server
npm run dev
\`\`\`

### Usage
1. **Open AI Assistant**: Click the "AI Offer Assistant" button
2. **Input Offer**: Use test prompts or describe your offer
3. **Review Extraction**: Check extracted data and generated image
4. **Edit Form**: Modify any fields as needed
5. **Export Data**: Download JSON or view structured output

## 🎨 Theming & Customization

### Brand Themes
The application includes pre-built themes for major brands:
- **Kenmore**: Blue appliance theme with washer/dryer icons
- **Levi's**: Red denim theme with jeans and red tab
- **Nike**: Black/orange athletic theme with swoosh
- **Walmart**: Blue/yellow retail theme with spark logo
- **Target**: Red bullseye theme

### Custom Themes
Add new brand themes in `canvas-image-generator.ts`:
\`\`\`typescript
const THEMES = {
  yourBrand: {
    name: "Your Brand",
    colors: { /* color scheme */ },
    patterns: ["brand", "keywords"],
    icons: (ctx, size, details) => { /* icon drawing logic */ }
  }
}
\`\`\`

## 📊 Performance & Optimization

### Build Optimizations
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Dynamic imports for large components
- **Image Optimization**: Canvas-based generation reduces external dependencies
- **Bundle Analysis**: Optimized package sizes

### Runtime Performance
- **React 19**: Concurrent features and automatic batching
- **Server Components**: Reduced client-side JavaScript
- **Streaming**: Progressive page loading
- **Caching**: Optimized API response caching

## 🔒 Security Considerations

### API Security
- **Input Validation**: All user inputs validated and sanitized
- **Rate Limiting**: OpenAI API calls are throttled
- **Error Handling**: Sensitive information not exposed in errors
- **CORS**: Proper cross-origin resource sharing configuration

### Data Privacy
- **No Persistent Storage**: Offer data not stored server-side
- **Client-Side Processing**: Sensitive data remains in browser
- **Secure Transmission**: HTTPS for all API communications

## 🧪 Testing & Quality Assurance

### Built-in Test Prompts
The application includes comprehensive test cases:
- **Kenmore Appliances**: Complex appliance offer with segments
- **Levi's Jeans**: Fashion offer with age-based targeting
- **Electronics Sale**: Multi-category technology promotion
- **Fashion Week**: Designer clothing with premium tiers

### Error Handling
- **Graceful Degradation**: Regex fallback when AI unavailable
- **User Feedback**: Clear error messages and recovery options
- **Validation**: Form validation prevents invalid submissions

## 🚀 Deployment

### Vercel Deployment (Recommended)
\`\`\`bash
# Deploy to Vercel
vercel --prod

# Environment variables required:
# OPENAI_API_KEY=your_key_here
\`\`\`

### Alternative Deployments
- **Netlify**: Static site generation support
- **Docker**: Containerized deployment option
- **Self-hosted**: Node.js server deployment

Your project is live at:

**[https://vercel.com/ganesh-venkatachalams-projects/v0-smart-offer-framework](https://vercel.com/ganesh-venkatachalams-projects/v0-smart-offer-framework)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/A43YpBKuycs](https://v0.dev/chat/projects/A43YpBKuycs)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## 🤝 Contributing

### Development Guidelines
1. **TypeScript**: All code must be properly typed
2. **ESLint**: Follow established linting rules
3. **Prettier**: Code formatting consistency
4. **Component Structure**: Follow established patterns

### Adding New Features
1. **AI Extraction**: Extend prompt engineering in API routes
2. **Themes**: Add new brand themes in canvas generator
3. **Form Fields**: Update TypeScript interfaces and validation
4. **Export Formats**: Extend JSON output structure

## 📈 Future Enhancements

### Planned Features
- **Multi-language Support**: Internationalization (i18n)
- **Advanced Analytics**: Offer performance tracking
- **Template Library**: Pre-built offer templates
- **Batch Processing**: Multiple offer extraction
- **API Integration**: External system connectivity

### Technical Improvements
- **Database Integration**: Persistent offer storage
- **User Authentication**: Multi-user support
- **Real-time Collaboration**: Shared offer editing
- **Advanced AI**: Custom model fine-tuning

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Vercel**: For the AI SDK and deployment platform
- **OpenAI**: For GPT-4 language model capabilities
- **Radix UI**: For accessible component primitives
- **shadcn/ui**: For beautiful component designs
- **Tailwind CSS**: For utility-first styling approach

---

**Built with ❤️ using Next.js 15, OpenAI, and modern web technologies.**
