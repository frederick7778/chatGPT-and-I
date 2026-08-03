import { useState } from "react"
import { useRoute, Link } from "wouter"
import { 
  useGetTool, 
  useCreateHistory, 
  useGetDashboardSummary,
  useAddFavorite,
  useRemoveFavorite,
  useListFavorites,
  getGetDashboardSummaryQueryKey,
  getGetCreditsQueryKey,
  getListFavoritesQueryKey
} from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { 
  ArrowLeft, Heart, Copy, Check, Download, 
  Settings2, Loader2, Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function ToolRunnerPage() {
  const [, params] = useRoute("/tools/:slug")
  const slug = params?.slug || ""
  
  const { data: tool, isLoading: toolLoading } = useGetTool(slug, { 
    query: { enabled: !!slug, queryKey: ["getTool", slug] as const }
  })
  
  const { data: favorites } = useListFavorites()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  const addFav = useAddFavorite()
  const remFav = useRemoveFavorite()
  
  const isFavorite = favorites?.some(f => f.toolSlug === slug)

  const toggleFavorite = () => {
    if (isFavorite) {
      remFav.mutate({ toolSlug: slug }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFavoritesQueryKey() })
          queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() })
          toast({ title: "Removed from favorites" })
        }
      })
    } else {
      addFav.mutate({ toolSlug: slug }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFavoritesQueryKey() })
          queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() })
          toast({ title: "Added to favorites" })
        }
      })
    }
  }

  if (toolLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Tool not found</h2>
        <Link href="/tools"><Button>Back to Catalog</Button></Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <Link href="/tools" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
      </Link>
      
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{tool.name}</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleFavorite}
              className={`rounded-full ${isFavorite ? 'text-primary' : 'text-muted-foreground'}`}
              data-testid="button-toggle-favorite"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-primary' : ''}`} />
            </Button>
          </div>
          <p className="text-muted-foreground">{tool.description}</p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-white/5 px-4 py-2 rounded-xl text-sm">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="font-medium">{tool.creditsPerUse} Credits</span>
          <span className="text-muted-foreground">per use</span>
        </div>
      </div>

      <div className="mt-8">
        {slug === "qr-code-generator" && <QRCodeTool tool={tool} />}
        {slug === "password-generator" && <PasswordTool tool={tool} />}
        {slug === "word-counter" && <WordCounterTool tool={tool} />}
        {slug === "resume-builder" && <ResumeTool tool={tool} />}
        {slug === "invoice-generator" && <InvoiceTool tool={tool} />}
      </div>
    </div>
  )
}

// --- SPECIFIC TOOL IMPLEMENTATIONS ---

function QRCodeTool({ tool }: { tool: { slug: string; creditsPerUse: number } }) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const createHistory = useCreateHistory()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  const generate = () => {
    if (!input.trim()) return
    const resultUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(input)}`
    setOutput(resultUrl)
    createHistory.mutate({
      data: { toolSlug: tool.slug, input, output: resultUrl }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() })
        queryClient.invalidateQueries({ queryKey: getGetCreditsQueryKey() })
        toast({ title: "QR Code generated", description: "Saved to history" })
      }
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <Label>Enter Text or URL</Label>
          <Textarea 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="https://example.com"
            className="min-h-[120px]"
            data-testid="input-qr-text"
          />
        </div>
        <Button onClick={generate} disabled={!input || createHistory.isPending} className="w-full" data-testid="button-generate-qr">
          {createHistory.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Generate QR Code
        </Button>
      </Card>
      
      <Card className="p-6 flex flex-col items-center justify-center min-h-[300px] bg-black/20 border-white/5">
        {output ? (
          <div className="text-center space-y-6">
            <div className="p-4 bg-white rounded-xl inline-block shadow-xl">
              <img src={output} alt="Generated QR" className="w-48 h-48" />
            </div>
            <Button variant="outline" size="sm" onClick={() => window.open(output, '_blank')}>
              <Download className="w-4 h-4 mr-2" /> Download PNG
            </Button>
          </div>
        ) : (
          <div className="text-muted-foreground flex flex-col items-center gap-2 opacity-50">
            <Sparkles className="w-8 h-8" />
            <p>Your QR code will appear here</p>
          </div>
        )}
      </Card>
    </div>
  )
}

function PasswordTool({ tool }: { tool: { slug: string } }) {
  const [length, setLength] = useState(16)
  const [useSymbols, setUseSymbols] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)
  const createHistory = useCreateHistory()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  const generate = () => {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (useNumbers) charset += "0123456789"
    if (useSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"
    
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    const password = Array.from(array, (n) => charset[n % charset.length]).join("")
    
    setOutput(password)
    setCopied(false)
    
    createHistory.mutate({
      data: { toolSlug: tool.slug, input: `Length: ${length}, Symbols: ${useSymbols}, Numbers: ${useNumbers}`, output: password }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() })
        queryClient.invalidateQueries({ queryKey: getGetCreditsQueryKey() })
      }
    })
  }

  const copy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    toast({ title: "Copied to clipboard" })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="max-w-2xl mx-auto overflow-hidden">
      <div className="p-8 border-b border-white/5 bg-black/20">
        <div className="relative">
          <Input 
            value={output} 
            readOnly 
            placeholder="Click generate to create a password"
            className="h-16 text-center text-xl font-mono tracking-widest bg-card pr-16"
            data-testid="input-password-output"
          />
          {output && (
            <Button 
              size="icon" 
              variant="ghost" 
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={copy}
              data-testid="button-copy-password"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </Button>
          )}
        </div>
      </div>
      <div className="p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Length: {length}</Label>
          </div>
          <input type="range" min="8" max="64" value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="w-full accent-primary" data-testid="input-password-length" />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={useNumbers} onChange={e => setUseNumbers(e.target.checked)} className="accent-primary" data-testid="checkbox-numbers" />
            Include Numbers
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={useSymbols} onChange={e => setUseSymbols(e.target.checked)} className="accent-primary" data-testid="checkbox-symbols" />
            Include Symbols
          </label>
        </div>
        <Button onClick={generate} disabled={createHistory.isPending} className="w-full h-12 text-base shadow-lg shadow-primary/20" data-testid="button-generate-password">
          {createHistory.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
          Generate Secure Password
        </Button>
      </div>
    </Card>
  )
}

function WordCounterTool({ tool }: { tool: { slug: string } }) {
  const [input, setInput] = useState("")
  const [stats, setStats] = useState({ words: 0, chars: 0, sentences: 0, readTime: 0 })
  const createHistory = useCreateHistory()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  const analyze = (text: string) => {
    setInput(text)
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const chars = text.length
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0
    const readTime = Math.ceil(words / 200) || 0
    setStats({ words, chars, sentences, readTime })
  }
  
  const saveRecord = () => {
    if (!input.trim()) return
    const out = `Words: ${stats.words} | Characters: ${stats.chars} | Sentences: ${stats.sentences} | Read time: ${stats.readTime} min`
    createHistory.mutate({
      data: { toolSlug: tool.slug, input: input.substring(0, 200), output: out }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() })
        queryClient.invalidateQueries({ queryKey: getGetCreditsQueryKey() })
        toast({ title: "Analysis saved to history" })
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Words", value: stats.words, color: "text-blue-400" },
          { label: "Characters", value: stats.chars, color: "text-orange-400" },
          { label: "Sentences", value: stats.sentences, color: "text-primary" },
          { label: "Read Time (min)", value: stats.readTime, color: "text-green-400" },
        ].map((stat, i) => (
          <Card key={i} className="p-4 text-center">
            <div className={`text-3xl font-bold mb-1 ${stat.color}`} data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
          </Card>
        ))}
      </div>
      <Card className="overflow-hidden border-white/10">
        <Textarea 
          value={input} 
          onChange={e => analyze(e.target.value)} 
          placeholder="Paste or type your text here to analyze..."
          className="min-h-[400px] border-0 rounded-none bg-transparent p-6 text-base focus-visible:ring-0 resize-y"
          data-testid="input-word-counter-text"
        />
        <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end">
          <Button onClick={saveRecord} disabled={!input.trim() || createHistory.isPending} data-testid="button-save-analysis">
            {createHistory.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Analysis
          </Button>
        </div>
      </Card>
    </div>
  )
}

function ResumeTool({ tool }: { tool: { slug: string } }) {
  const [formData, setFormData] = useState({
    name: "", title: "", email: "", phone: "", location: "", summary: "",
    experience: "", education: "", skills: ""
  })
  const createHistory = useCreateHistory()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const update = (field: string, value: string) => setFormData(p => ({ ...p, [field]: value }))

  const save = () => {
    const output = JSON.stringify(formData)
    createHistory.mutate({
      data: { toolSlug: tool.slug, input: formData.name || "Unnamed Resume", output }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() })
        queryClient.invalidateQueries({ queryKey: getGetCreditsQueryKey() })
        toast({ title: "Resume saved to history" })
      }
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Personal Info</h3>
        {[
          { field: "name", label: "Full Name", placeholder: "Jane Doe" },
          { field: "title", label: "Job Title", placeholder: "Senior Engineer" },
          { field: "email", label: "Email", placeholder: "jane@example.com" },
          { field: "phone", label: "Phone", placeholder: "+1 234 567 8900" },
          { field: "location", label: "Location", placeholder: "San Francisco, CA" },
        ].map(({ field, label, placeholder }) => (
          <div key={field} className="space-y-1">
            <Label>{label}</Label>
            <Input value={formData[field as keyof typeof formData]} onChange={e => update(field, e.target.value)} placeholder={placeholder} data-testid={`input-resume-${field}`} />
          </div>
        ))}
        <div className="space-y-1">
          <Label>Professional Summary</Label>
          <Textarea value={formData.summary} onChange={e => update("summary", e.target.value)} placeholder="Brief summary of your background..." className="min-h-[80px]" data-testid="input-resume-summary" />
        </div>
        <div className="space-y-1">
          <Label>Experience (one role per line)</Label>
          <Textarea value={formData.experience} onChange={e => update("experience", e.target.value)} placeholder="Senior Engineer @ Company (2020–Present)" className="min-h-[100px]" data-testid="input-resume-experience" />
        </div>
        <div className="space-y-1">
          <Label>Education</Label>
          <Textarea value={formData.education} onChange={e => update("education", e.target.value)} placeholder="BS Computer Science, MIT (2016)" className="min-h-[60px]" data-testid="input-resume-education" />
        </div>
        <div className="space-y-1">
          <Label>Skills (comma-separated)</Label>
          <Input value={formData.skills} onChange={e => update("skills", e.target.value)} placeholder="React, TypeScript, Node.js..." data-testid="input-resume-skills" />
        </div>
        <Button onClick={save} disabled={!formData.name || createHistory.isPending} className="w-full" data-testid="button-save-resume">
          {createHistory.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Save Resume
        </Button>
      </div>

      <Card className="p-8 bg-white text-gray-900 min-h-[600px]">
        {formData.name ? (
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-gray-900">{formData.name}</h2>
              {formData.title && <p className="text-lg text-purple-700 font-medium">{formData.title}</p>}
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                {formData.email && <span>{formData.email}</span>}
                {formData.phone && <span>· {formData.phone}</span>}
                {formData.location && <span>· {formData.location}</span>}
              </div>
            </div>
            {formData.summary && <div><h3 className="font-bold text-gray-800 mb-1 text-sm uppercase tracking-wider">Summary</h3><p className="text-gray-700 text-sm">{formData.summary}</p></div>}
            {formData.experience && <div><h3 className="font-bold text-gray-800 mb-1 text-sm uppercase tracking-wider">Experience</h3>{formData.experience.split('\n').filter(Boolean).map((e, i) => <p key={i} className="text-gray-700 text-sm py-0.5">{e}</p>)}</div>}
            {formData.education && <div><h3 className="font-bold text-gray-800 mb-1 text-sm uppercase tracking-wider">Education</h3><p className="text-gray-700 text-sm">{formData.education}</p></div>}
            {formData.skills && <div><h3 className="font-bold text-gray-800 mb-1 text-sm uppercase tracking-wider">Skills</h3><div className="flex flex-wrap gap-2">{formData.skills.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => <span key={i} className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">{s}</span>)}</div></div>}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Settings2 className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">Fill in the form to preview your resume</p>
          </div>
        )}
      </Card>
    </div>
  )
}

function InvoiceTool({ tool }: { tool: { slug: string } }) {
  const [fromName, setFromName] = useState("")
  const [toName, setToName] = useState("")
  const [toEmail, setToEmail] = useState("")
  const [invoiceNum, setInvoiceNum] = useState(`INV-${Date.now().toString().slice(-6)}`)
  const [items, setItems] = useState([{ description: "", qty: 1, rate: 0 }])
  const [tax, setTax] = useState(0)
  const createHistory = useCreateHistory()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const addItem = () => setItems(p => [...p, { description: "", qty: 1, rate: 0 }])
  const updateItem = (i: number, field: string, value: string | number) =>
    setItems(p => p.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  const removeItem = (i: number) => setItems(p => p.filter((_, idx) => idx !== i))

  const subtotal = items.reduce((s, item) => s + item.qty * item.rate, 0)
  const taxAmount = subtotal * (tax / 100)
  const total = subtotal + taxAmount

  const save = () => {
    const output = JSON.stringify({ fromName, toName, toEmail, invoiceNum, items, subtotal, tax, total })
    createHistory.mutate({
      data: { toolSlug: tool.slug, input: `Invoice ${invoiceNum} for ${toName}`, output }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() })
        queryClient.invalidateQueries({ queryKey: getGetCreditsQueryKey() })
        toast({ title: "Invoice saved to history" })
      }
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Your Name / Company</Label>
          <Input value={fromName} onChange={e => setFromName(e.target.value)} placeholder="Acme Inc." data-testid="input-invoice-from" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Bill To (Name)</Label>
            <Input value={toName} onChange={e => setToName(e.target.value)} placeholder="Client Name" data-testid="input-invoice-to-name" />
          </div>
          <div className="space-y-1">
            <Label>Bill To (Email)</Label>
            <Input value={toEmail} onChange={e => setToEmail(e.target.value)} placeholder="client@email.com" data-testid="input-invoice-to-email" />
          </div>
        </div>
        <div className="space-y-1">
          <Label>Invoice Number</Label>
          <Input value={invoiceNum} onChange={e => setInvoiceNum(e.target.value)} data-testid="input-invoice-number" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Line Items</Label>
            <Button type="button" variant="outline" size="sm" onClick={addItem} data-testid="button-add-item">+ Add Item</Button>
          </div>
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <Input className="col-span-6" value={item.description} onChange={e => updateItem(i, "description", e.target.value)} placeholder="Description" data-testid={`input-item-desc-${i}`} />
              <Input className="col-span-2" type="number" value={item.qty} onChange={e => updateItem(i, "qty", Number(e.target.value))} min={1} data-testid={`input-item-qty-${i}`} />
              <Input className="col-span-3" type="number" value={item.rate} onChange={e => updateItem(i, "rate", Number(e.target.value))} placeholder="Rate" data-testid={`input-item-rate-${i}`} />
              <Button type="button" variant="ghost" size="icon" className="col-span-1 text-muted-foreground" onClick={() => removeItem(i)} data-testid={`button-remove-item-${i}`}>×</Button>
            </div>
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <Label className="whitespace-nowrap">Tax %</Label>
          <Input type="number" value={tax} onChange={e => setTax(Number(e.target.value))} min={0} max={100} className="w-24" data-testid="input-invoice-tax" />
        </div>
        <Button onClick={save} disabled={!fromName || !toName || createHistory.isPending} className="w-full" data-testid="button-save-invoice">
          {createHistory.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Save Invoice
        </Button>
      </div>

      <Card className="p-8 bg-white text-gray-900 min-h-[500px]">
        {fromName || toName ? (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-purple-700">INVOICE</h2>
                <p className="text-gray-500 text-sm">{invoiceNum}</p>
                <p className="text-gray-500 text-sm mt-1">Date: {new Date().toLocaleDateString()}</p>
              </div>
              {fromName && <div className="text-right"><p className="font-bold text-gray-800">{fromName}</p></div>}
            </div>
            {toName && <div><p className="text-xs text-gray-500 uppercase font-semibold mb-1">Bill To</p><p className="font-medium text-gray-800">{toName}</p>{toEmail && <p className="text-gray-500 text-sm">{toEmail}</p>}</div>}
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-200"><th className="text-left py-2 text-gray-600 font-semibold">Description</th><th className="text-right text-gray-600 font-semibold">Qty</th><th className="text-right text-gray-600 font-semibold">Rate</th><th className="text-right text-gray-600 font-semibold">Amount</th></tr></thead>
              <tbody>
                {items.filter(i => i.description).map((item, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2 text-gray-800">{item.description}</td>
                    <td className="text-right text-gray-700">{item.qty}</td>
                    <td className="text-right text-gray-700">${item.rate.toFixed(2)}</td>
                    <td className="text-right font-medium text-gray-800">${(item.qty * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              {tax > 0 && <div className="flex justify-between text-gray-600"><span>Tax ({tax}%)</span><span>${taxAmount.toFixed(2)}</span></div>}
              <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-200 pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Settings2 className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">Fill in the form to preview your invoice</p>
          </div>
        )}
      </Card>
    </div>
  )
}
