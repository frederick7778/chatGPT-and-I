/**
 * Free Public APIs that can be integrated into ToolKit AI
 * These enhance features without adding cost
 */

export const FREE_APIS = {
  // QR Code Enhancement
  QR_CODE: {
    name: "QR Server API",
    url: "https://api.qrserver.com/v1/create-qr-code/",
    description: "Generate QR codes with customization options",
    features: ["size", "margin", "format (PNG/SVG/EPS)", "error correction"],
    example: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://example.com"
  },

  // Password Strength Checker
  PASSWORD_STRENGTH: {
    name: "Have I Been Pwned API",
    url: "https://api.pwnedpasswords.com",
    description: "Check if passwords have been exposed in breaches",
    features: ["k-anonymity", "no logging", "free tier", "rate limited"],
    note: "Great for password generator - check generated passwords haven't been pwned"
  },

  // Text Analysis & Language
  TEXT_ANALYSIS: {
    name: "Text-Processing API",
    url: "https://api.textrazor.com",
    description: "NLP for keyword extraction, entities, sentiment",
    features: ["Keyword extraction", "Entity recognition", "Free tier available"],
    example: "Can enhance Word Counter with sentiment analysis"
  },

  // Currency & Financial
  EXCHANGE_RATES: {
    name: "ExchangeRate API",
    url: "https://exchangerate-api.com",
    description: "Real-time currency exchange rates",
    features: ["No auth needed", "1500 requests/month free", "Multiple currencies"],
    example: "Could add invoice multi-currency support"
  },

  // Image & File Processing
  IMAGE_OPTIMIZATION: {
    name: "TinyPNG/Compress API",
    url: "https://compressor.io/api",
    description: "Image compression for resume/invoice PDFs",
    features: ["Lossy compression", "API available", "Free tier"]
  },

  // Font & Design
  GOOGLE_FONTS_API: {
    name: "Google Fonts API",
    url: "https://www.googleapis.com/webfonts/v1/webfonts",
    description: "Free professional fonts for resume/invoice design",
    features: ["500+ fonts", "Free", "No auth needed for basic use"]
  },

  // Geolocation & Weather
  GEOLOCATION: {
    name: "IP Geolocation API",
    url: "https://ipapi.co",
    description: "Get user location from IP",
    features: ["Free tier", "No auth", "JSON response", "Rate limited"]
  },

  // Email Validation
  EMAIL_VALIDATION: {
    name: "AbstractAPI Email Validator",
    url: "https://www.abstractapi.com/api/email-validation-api",
    description: "Validate email format and check if mailbox exists",
    features: ["100 free requests/month", "Catches typos", "Prevents fake emails"]
  },

  // Data/Placeholder Services
  UNSPLASH_API: {
    name: "Unsplash API",
    url: "https://api.unsplash.com",
    description: "Free stock photos for resume/invoice templates",
    features: ["50k+ images", "Free", "Requires API key"]
  },

  // PDF Generation
  PDFSHIFT_API: {
    name: "PDFShift API",
    url: "https://www.pdfshift.io",
    description: "Convert HTML to PDF (free tier available)",
    features: ["50 free conversions/month", "Beautiful output", "Simple API"]
  }
};

/**
 * Recommended integrations for each tool:
 * 
 * 1. QR Code Generator
 *    - Use QR Server API for enhanced customization
 *    - Add real-time preview with size/format options
 * 
 * 2. Password Generator
 *    - Integrate Have I Been Pwned API
 *    - Show users if generated password appears in breaches
 *    - Add real-time strength indicator
 * 
 * 3. Word Counter
 *    - Add sentiment analysis via TextRazor
 *    - Keyword extraction for content optimization
 *    - Readability score (Flesch-Kincaid)
 * 
 * 4. Resume Builder
 *    - Google Fonts API for typography options
 *    - Unsplash API for background images
 *    - PDFShift for better PDF export
 *    - Email validation for contact info
 * 
 * 5. Invoice Generator
 *    - ExchangeRate API for multi-currency support
 *    - PDFShift for professional PDF rendering
 *    - Image optimization for attached files
 *    - Geolocation for auto-fill business location
 */

export function integratePublicAPI(apiType: keyof typeof FREE_APIS) {
  return FREE_APIS[apiType];
}
