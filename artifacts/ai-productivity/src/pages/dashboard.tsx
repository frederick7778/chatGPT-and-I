import { useState } from "react"
import { 
  useGetDashboardSummary, 
  useDailyCheckin, 
  getGetDashboardSummaryQueryKey,
  getGetMeQueryKey,
  getGetStreakQueryKey,
  getGetCreditsQueryKey
} from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { 
  Flame, Zap, History, Wallet, CheckCircle2, 
  ArrowRight, ExternalLink, Calendar, Grid 
} from "lucide-react"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

export default function DashboardPage() {
  const { data: summary, isLoading } = useGetDashboardSummary()
  const checkinMutation = useDailyCheckin()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  const [showCheckinSuccess, setShowCheckinSuccess] = useState(false)
  const [checkinData, setCheckinData] = useState<{credits: number, streak: number} | null>(null)

  const handleCheckin = () => {
    checkinMutation.mutate(undefined, {
      onSuccess: (res) => {
        setCheckinData({ credits: res.creditsEarned, streak: res.newStreak })
        setShowCheckinSuccess(true)
        
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() })
        queryClient.invalidateQueries({ queryKey: getGetStreakQueryKey() })
        queryClient.invalidateQueries({ queryKey: getGetCreditsQueryKey() })
        
        toast({
          title: "Daily Check-in Complete!",
          description: `You earned ${res.creditsEarned} credits and extended your streak to ${res.newStreak} days.`,
        })
        
        setTimeout(() => setShowCheckinSuccess(false), 3000)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-card rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-card rounded-2xl animate-pulse" />
          <div className="h-48 bg-card rounded-2xl animate-pulse" />
          <div className="h-48 bg-card rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight mb-2">Welcome back, {summary.user.name.split(' ')[0]}</h1>
          <p className="text-muted-foreground">Here's what's happening in your workspace today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak Card */}
        <Card className="col-span-1 md:col-span-2 overflow-hidden relative border-primary/20 bg-primary/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
          
          <CardContent className="p-8 relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-orange-500">Current Streak</span>
                </div>
                <div className="text-5xl font-display font-bold">{summary.streak.currentStreak} <span className="text-2xl text-muted-foreground font-sans font-medium">Days</span></div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Longest Streak</div>
                <div className="font-semibold text-lg">{summary.streak.longestStreak} Days</div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {showCheckinSuccess && checkinData ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-green-500/20 text-green-400 border border-green-500/30 p-4 rounded-xl flex items-center gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                  <div>
                    <div className="font-bold">Check-in claimed!</div>
                    <div className="text-sm opacity-90">+{checkinData.credits} credits • Streak extended</div>
                  </div>
                </motion.div>
              ) : summary.streak.checkedInToday ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card border border-white/5 p-4 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">You're all caught up for today</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Come back tomorrow</span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Button 
                    onClick={handleCheckin} 
                    disabled={checkinMutation.isPending}
                    className="w-full h-14 text-base font-semibold shadow-lg shadow-primary/25 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {checkinMutation.isPending ? "Claiming..." : "Claim Daily Reward"}
                      <Zap className="w-4 h-4 fill-current" />
                    </span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Credits Card */}
        <Card className="flex flex-col">
          <CardContent className="p-8 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Wallet className="w-5 h-5 text-accent" />
              <span className="font-semibold text-accent">Credit Balance</span>
            </div>
            <div className="text-5xl font-display font-bold mb-auto">{summary.credits.balance}</div>
            
            <div className="space-y-3 mt-8">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Earned</span>
                <span className="font-medium text-green-400">+{summary.credits.totalEarned}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Spent</span>
                <span className="font-medium text-red-400">-{summary.credits.totalSpent}</span>
              </div>
            </div>
            
            <Link href="/credits" className="mt-6 block">
              <Button variant="outline" className="w-full">View Transactions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent History */}
        <Card>
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5" />
              <h2 className="font-semibold">Recent Activity</h2>
            </div>
            <Link href="/history" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <CardContent className="p-0">
            {summary.recentHistory.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>No activity yet.</p>
                <Link href="/tools">
                  <Button variant="link" className="mt-2">Try a tool</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {summary.recentHistory.map(entry => (
                  <Link key={entry.id} href={`/tools/${entry.toolSlug}`} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
                    <div>
                      <p className="font-medium text-sm mb-1">{entry.toolName}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{entry.output.substring(0, 50)}...</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{new Date(entry.createdAt).toLocaleDateString()}</span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Favorite Tools */}
        <Card>
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grid className="w-5 h-5" />
              <h2 className="font-semibold">Favorite Tools</h2>
            </div>
            <Link href="/favorites" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <CardContent className="p-0">
            {summary.favoriteTools.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>No favorites yet.</p>
                <Link href="/tools">
                  <Button variant="link" className="mt-2">Browse catalog</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {summary.favoriteTools.map(tool => (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-card border border-white/10 flex items-center justify-center">
                        <span className="text-xl">{/* Use icon lookup in real app, placeholder here */ tool.icon === 'qr-code' ? '📱' : tool.icon === 'key' ? '🔑' : '✨'}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{tool.name}</p>
                        <p className="text-xs text-muted-foreground">{tool.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">{tool.creditsPerUse} Cr</Badge>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
