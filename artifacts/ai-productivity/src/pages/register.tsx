import { Link, useLocation } from "wouter"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRegister } from "@workspace/api-client-react"
import { Zap, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [, setLocation] = useLocation()
  const { toast } = useToast()
  const registerMutation = useRegister()

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate({ data }, {
      onSuccess: () => {
        setLocation("/dashboard")
      },
      onError: (err) => {
        toast({
          title: "Registration failed",
          description: err.error?.error || "Could not create account",
          variant: "destructive"
        })
      }
    })
  }

  return (
    <div className="min-h-screen flex bg-background dark text-foreground">
      {/* Left side - form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 relative z-10">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary fill-primary" />
          <span className="font-display font-bold text-xl">ToolKit AI</span>
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Create an account</h1>
            <p className="text-muted-foreground">Join the toolkit and start building.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Jane Doe" 
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full h-12 text-base mt-4 group" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Sign Up <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary-foreground transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
      
      {/* Right side - decorative */}
      <div className="hidden lg:flex w-1/2 relative bg-card items-center justify-center overflow-hidden border-l border-white/5">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 max-w-md text-center">
          <div className="glass-card p-8 rounded-2xl border-white/10">
            <h3 className="text-2xl font-bold mb-4 font-display">Your Workflow Arsenal</h3>
            <p className="text-muted-foreground leading-relaxed">
              Stop hunting for ad-hoc tools that look like they were built in 2004. Everything you need to get work done, beautifully designed and seamlessly integrated.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
