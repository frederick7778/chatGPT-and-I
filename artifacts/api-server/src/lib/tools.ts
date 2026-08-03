export interface ToolDefinition {
  slug: string;
  name: string;
  description: string;
  category: string;
  creditsPerUse: number;
  icon: string;
  isNew?: boolean;
  isPremium?: boolean;
  usageCount: number;
}

export const TOOLS: ToolDefinition[] = [
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    description: "Generate QR codes from any URL or text instantly. Download as PNG or SVG.",
    category: "Utilities",
    creditsPerUse: 1,
    icon: "QrCode",
    isNew: false,
    usageCount: 4821,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description: "Create strong, secure passwords with custom length and character sets.",
    category: "Security",
    creditsPerUse: 1,
    icon: "KeyRound",
    isNew: false,
    usageCount: 7293,
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, sentences, and estimate reading time from any text.",
    category: "Writing",
    creditsPerUse: 1,
    icon: "AlignLeft",
    isNew: false,
    usageCount: 3102,
  },
  {
    slug: "resume-builder",
    name: "Resume Builder",
    description: "Build a professional resume with a beautiful template. Export as PDF.",
    category: "Career",
    creditsPerUse: 5,
    icon: "FileUser",
    isNew: true,
    isPremium: false,
    usageCount: 1245,
  },
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    description: "Create professional invoices with line items, taxes, and client details.",
    category: "Business",
    creditsPerUse: 5,
    icon: "Receipt",
    isNew: true,
    isPremium: false,
    usageCount: 892,
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
