import * as React from "react"
import { Link, useLocation } from "wouter"
import { useGetMe, useGetDashboardSummary, useLogout, getGetMeQueryKey } from "@workspace/api-client-react"
import { Zap, LogOut, Wallet, LayoutDashboard, Grid, History, Heart, User, Trophy, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useQueryClient } from "@tanstack/react-query"
import { cn } from "@/lib/utils"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useGetMe({ query: { retry: false } })
  const { data: summary } = useGetDashboardSummary({ query: { enabled: !!user } })
  const [, setLocation] = useLocation()
  const queryClient = useQueryClient()
  const logout = useLogout()
  const [location] = useLocation()
  const isAuthPage = location === "/login" || location === "/register" || location === "/"

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() })
        setLocation("/")
      }
    })
  }

  // If loading user data and not on a public page, show loading
  if (isLoading && !isAuthPage) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
  }

  // Handle redirects
  if (!user && !isAuthPage && !isLoading) {
    setLocation("/login")
    return null
  }

  // For public pages when not logged in
  if (!user) {
    return <>{children}</>
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tools", label: "Tools", icon: Grid },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/history", label: "History", icon: History },
  ]

  return (
    <div className="flex min-h-screen bg-background text-foreground dark">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 border-r border-white/5 bg-background/50 backdrop-blur-xl z-10">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 fill-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">ToolKit AI</span>
          </Link>
        </div>

        <div className="px-4 py-2">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-white/5 mb-6">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-6">
            <Link href="/credits" className="p-3 rounded-xl bg-card border border-white/5 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-1 group">
              <Wallet className="w-4 h-4 text-primary group-hover:text-primary transition-colors" />
              <span className="text-xs font-medium">{summary?.credits.balance || 0} Cr</span>
            </Link>
            <div className="p-3 rounded-xl bg-card border border-white/5 flex flex-col items-center justify-center gap-1 group">
              <Flame className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">{summary?.streak.currentStreak || 0} Days</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                location === item.href || location.startsWith(`${item.href}/`)
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <Link href="/profile" className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1",
            location === "/profile" ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
          )}>
            <User className="w-4 h-4" />
            Profile
          </Link>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 relative">
        <main className="min-h-[100dvh] p-4 md:p-8 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
