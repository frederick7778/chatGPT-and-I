import { Link, useLocation } from "wouter"
import { useGetMe } from "@workspace/api-client-react"
import { Zap, ArrowRight, CheckCircle2, Sparkles, Wand2, ArrowUpRight, History } from "lucide-react"
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <Zap className="w-5 h-5 fill-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">ToolKit AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/register">
              <Button size="sm" className="rounded-full px-6 bg-white text-black hover:bg-white/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/30 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-accent/20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>The productivity suite for modern makers</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-[1.1]"
          >
            Your Daily <br/>
            <span className="text-gradient">Workflow Arsenal</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Beautiful, lightning-fast tools that you'll actually want to use. Earn credits, build your streak, and optimize your workday.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register">
              <Button size="lg" className="rounded-full px-8 h-14 text-base bg-white text-black hover:bg-white/90 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                Start Building Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> No credit card</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> Daily rewards</span>
            </div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-32 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { title: "Beautiful Utilities", desc: "From QR codes to invoices, tools that don't look like they were built in 2004.", icon: Wand2, color: "text-blue-400", bg: "bg-blue-400/10" },
            { title: "Daily Streaks", desc: "Build habits that stick. Check in daily to earn credits and unlock premium features.", icon: Zap, color: "text-orange-400", bg: "bg-orange-400/10" },
            { title: "Infinite Memory", desc: "Every generated password, every crafted resume—saved securely in your history.", icon: History, color: "text-primary", bg: "bg-primary/10" }
          ].map((feature, i) => (
            <motion.div key={i} variants={item} className="glass-card p-8 rounded-2xl relative overflow-hidden group">
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Mockup Preview */}
        <div className="mt-32 max-w-5xl mx-auto relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/20">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
          <div className="bg-card/50 backdrop-blur-sm p-4 border-b border-white/5 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <div className="p-8 bg-card aspect-[16/9] flex items-center justify-center">
            <div className="text-center">
              <Zap className="w-16 h-16 text-primary mx-auto mb-6 opacity-50" />
              <h2 className="text-3xl font-display font-bold text-white/50">The missing operating system for makers</h2>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-muted-foreground text-sm">
        <p>© 2024 ToolKit AI. Built with intention.</p>
      </footer>
    </div>
  )
}
