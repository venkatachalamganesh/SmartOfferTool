export default function PRD() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Requirements Document (PRD)</h1>
        <div className="text-sm text-gray-600 mb-6">
          <strong>Project:</strong> Smart Offer Creation Tool
          <br />
          <strong>Version:</strong> 1.0
          <br />
          <strong>Date:</strong> {new Date().toLocaleDateString()}
          <br />
          <strong>Status:</strong> In Development
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Executive Summary</h2>
        <p className="text-gray-700 leading-relaxed">
          The Smart Offer Creation Tool is a web-based application that enables users to create, manage, and generate
          promotional offers with AI-powered assistance. The tool features a responsive interface with form-based input,
          natural language processing for offer extraction, and JSON export functionality for downstream applications.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Objectives</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Streamline the offer creation process with an intuitive interface</li>
          <li>Provide AI-powered text extraction to populate offer details automatically</li>
          <li>Generate standardized JSON output for system integration</li>
          <li>Ensure responsive design for desktop and mobile usage</li>
          <li>Implement proper validation and error handling</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Features & Requirements</h2>

        <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 Core Features</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h4 className="font-medium mb-2">Offer Form Fields:</h4>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Offer Name (Text, 30 characters max)</li>
            <li>Offer Description (Text, 1000 characters max)</li>
            <li>Offer Headline (Text, 20 characters max)</li>
            <li>Offer Bodyline (Text, 75 characters max)</li>
            <li>Offer Image (Image upload, 100x100px)</li>
            <li>Start Date (Date picker)</li>
            <li>End Date (Date picker)</li>
            <li>Offer Rules (Text area)</li>
            <li>Earn Type (Dropdown: Percentage/Points/Cashback)</li>
            <li>Points per Dollar (Number input)</li>
          </ul>
        </div>

        <h3 className="text-xl font-medium text-gray-800 mb-3">3.2 AI Assistant</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Magic wand button to trigger AI assistant</li>
          <li>Chat-like interface for natural language input</li>
          <li>Text parsing and extraction of offer details</li>
          <li>Automatic form population based on extracted data</li>
          <li>Support for member segments and age group conditions</li>
        </ul>

        <h3 className="text-xl font-medium text-gray-800 mb-3">3.3 JSON Generation</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Real-time JSON generation from form data</li>
          <li>Structured output for downstream applications</li>
          <li>Copy to clipboard functionality</li>
          <li>Proper data validation and formatting</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Technical Specifications</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Frontend Stack</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Next.js 14+ (App Router)</li>
              <li>• React 18+</li>
              <li>• TypeScript</li>
              <li>• Tailwind CSS</li>
              <li>• shadcn/ui components</li>
              <li>• Lucide React icons</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Deployment</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• GitHub repository</li>
              <li>• Vercel hosting</li>
              <li>• Automatic deployments</li>
              <li>• Environment variables support</li>
              <li>• SSL/HTTPS enabled</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. User Interface Design</h2>

        <h3 className="text-xl font-medium text-gray-800 mb-3">5.1 Design System</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            <strong>Color Scheme:</strong> Orange (#f97316) and White (#ffffff) primary colors
          </li>
          <li>
            <strong>Typography:</strong> Inter font family for clean, modern appearance
          </li>
          <li>
            <strong>Layout:</strong> Responsive grid system with mobile-first approach
          </li>
          <li>
            <strong>Components:</strong> Consistent use of shadcn/ui component library
          </li>
        </ul>

        <h3 className="text-xl font-medium text-gray-800 mb-3">5.2 Layout Structure</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Header with logo and branding</li>
          <li>Two-column layout: Form (left) and Preview/JSON (right)</li>
          <li>Modal overlay for AI assistant chat interface</li>
          <li>Responsive breakpoints for mobile and tablet devices</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Development Phases</h2>

        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-medium text-green-700">Phase 1: Core Implementation ✅</h3>
            <ul className="text-sm text-gray-600 mt-1">
              <li>• Basic form structure and validation</li>
              <li>• Responsive layout with Tailwind CSS</li>
              <li>• Logo and branding implementation</li>
            </ul>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-medium text-green-700">Phase 2: AI Assistant ✅</h3>
            <ul className="text-sm text-gray-600 mt-1">
              <li>• Chat modal interface</li>
              <li>• Text parsing and extraction logic</li>
              <li>• Form auto-population functionality</li>
            </ul>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-medium text-green-700">Phase 3: JSON Generation ✅</h3>
            <ul className="text-sm text-gray-600 mt-1">
              <li>• JSON structure definition</li>
              <li>• Real-time generation and display</li>
              <li>• Copy to clipboard functionality</li>
            </ul>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-medium text-orange-700">Phase 4: Deployment 🚀</h3>
            <ul className="text-sm text-gray-600 mt-1">
              <li>• GitHub repository setup</li>
              <li>• Vercel deployment configuration</li>
              <li>• Production testing and optimization</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Success Metrics</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Form completion rate &gt; 90%</li>
          <li>AI extraction accuracy &gt; 80%</li>
          <li>Page load time &lt; 2 seconds</li>
          <li>Mobile responsiveness score &gt; 95%</li>
          <li>Zero critical accessibility violations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Future Enhancements</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Integration with actual AI/NLP services (OpenAI, etc.)</li>
          <li>Database storage for offer persistence</li>
          <li>User authentication and authorization</li>
          <li>Offer templates and presets</li>
          <li>Advanced analytics and reporting</li>
          <li>Multi-language support</li>
          <li>API endpoints for external integrations</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Deployment Checklist</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Pre-Deployment:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>☐ Code review and testing completed</li>
            <li>☐ Responsive design verified on multiple devices</li>
            <li>☐ Performance optimization implemented</li>
            <li>☐ SEO meta tags and descriptions added</li>
            <li>☐ Error handling and validation tested</li>
          </ul>

          <h3 className="font-medium mb-2 mt-4">Deployment Steps:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>☐ Push code to GitHub repository</li>
            <li>☐ Connect repository to Vercel</li>
            <li>☐ Configure build settings and environment variables</li>
            <li>☐ Deploy to production</li>
            <li>☐ Verify functionality in production environment</li>
            <li>☐ Set up monitoring and analytics</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
