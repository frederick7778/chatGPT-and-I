import { Link, useLocation } from "wouter"
import { useGetMe } from "@workspace/api-client-react"
import { Zap, ArrowRight, CheckCircle2, Sparkles, Wand2, ArrowUpRight, History, BarChart3, Users, Zoomask } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function LandingPage() {
  const { data: user } = useGetMe({ query: { retry: false } })
  const [, setLocation] = useLocation()

  if (user) {
    setLocation("/dashboard")
    return null
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark selection:bg-primary/30">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-50"></div>
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-lg tracking-tight">ToolKit AI</span>
              <span className="text-xs text-muted-foreground">Productivity Suite</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/register">
              <Button size="sm" className="rounded-full px-6 bg-white text-black hover:bg-white/90 font-semibold">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Enhanced Glow effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-primary/40 via-purple-600/20 to-transparent blur-[120px] rounded-full pointer-events-none opacity-60"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>The AI-powered productivity platform</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-[1.1]"
          >
            Power Your <br/>
            <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">Productivity</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            5 essential tools in one platform. Generate QR codes, manage passwords, build resumes, create invoices, and analyze text. Free to start, premium at scale.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link href="/register">
              <Button size="lg" className="rounded-full px-8 h-14 text-base bg-white text-black hover:bg-white/90 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] font-semibold">
                Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-semibold border-white/20 hover:bg-white/5">
                Learn More
              </Button>
            </Link>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> No credit card required</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 100 free credits</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Daily rewards</span>
          </div>
        </div>

        {/* Feature Grid */}
        <motion.div 
          id="features"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-40 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { 
              title: "5 Essential Tools", 
              desc: "QR Code Generator, Password Manager, Word Counter, Resume Builder, and Invoice Generator all in one place.",
              icon: Wand2, 
              color: "text-blue-400", 
              bg: "bg-blue-400/10" 
            },
            { 
              title: "Earn as You Go", 
              desc: "Start with 100 free credits. Complete daily tasks to earn more. No spending required to explore.",
              icon: BarChart3, 
              color: "text-orange-400", 
              bg: "bg-orange-400/10" 
            },
            { 
              title: "Build Habits", 
              desc: "Create daily streaks by checking in every day. Longer streaks unlock bigger rewards and premium features.",
              icon: Zap, 
              color: "text-primary", 
              bg: "bg-primary/10" 
            }
          ].map((feature, i) => (
            <motion.div key={i} variants={item} className="group p-8 rounded-2xl relative overflow-hidden border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-primary/20 transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Section */}
        <motion.div
          id="about"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-6">Built for Modern Makers</h2>
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            ToolKit AI is a community-first company solving real productivity problems. We believe powerful tools shouldn't be expensive or complicated. 
            That's why we're building a suite of beautiful, lightning-fast utilities that anyone can use.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              { label: "Free to Start", value: "100 Credits" },
              { label: "Tools Available", value: "5 Powerful" },
              { label: "Save Everything", value: "History" }
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
                <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 max-w-4xl mx-auto text-center p-12 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-purple-600/5 to-pink-600/10"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to boost your productivity?</h2>
          <p className="text-lg text-muted-foreground mb-8">Join makers and professionals using ToolKit AI to get more done, faster.</p>
          <Link href="/register">
            <Button size="lg" className="rounded-full px-8 h-14 text-base bg-white text-black hover:bg-white/90 font-semibold">
              Start Free Today <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                  T
                </div>
                <span className="font-display font-bold">ToolKit AI</span>
              </div>
              <p className="text-muted-foreground text-sm">The AI-powered productivity suite for everyone.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#features" className="hover:text-foreground transition-colors">Tools</Link></li>
                <li><Link href="/register" className="hover:text-foreground transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><a href="https://github.com/frederick7778/chatGPT-and-I" className="hover:text-foreground transition-colors">GitHub</a></li>
                <li><a href="mailto:hello@toolkitai.com" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-muted-foreground text-sm">© 2024 ToolKit AI. A company built to solve community problems.</p>
            <p className="text-muted-foreground text-sm mt-4 md:mt-0">Made with intention for makers, by makers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
