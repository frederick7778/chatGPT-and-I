import { useGetCredits, useGetCreditTransactions } from "@workspace/api-client-react"
import { Wallet, ArrowDownRight, ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function CreditsPage() {
  const { data: balance, isLoading: balanceLoading } = useGetCredits()
  const { data: txs, isLoading: txsLoading } = useGetCreditTransactions()

  if (balanceLoading || txsLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl mt-8" />
      </div>
    )
  }

  if (!balance || !txs) return null

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight mb-2">Credits</h1>
        <p className="text-muted-foreground">Manage your balance and view transaction history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 overflow-hidden relative border-accent/20 bg-accent/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[80px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
          <CardContent className="p-8 relative z-10 flex flex-col h-full justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-6 h-6 text-accent" />
              <span className="font-semibold text-lg text-accent">Available Balance</span>
            </div>
            <div className="text-6xl font-display font-bold mb-2">{balance.balance}</div>
            <p className="text-muted-foreground">Credits refresh every 30 days automatically.</p>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col justify-between">
          <CardContent className="p-6 h-full flex flex-col justify-center">
             <div className="space-y-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Total Earned All Time</div>
                <div className="text-2xl font-bold text-green-400">+{balance.totalEarned}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Total Spent All Time</div>
                <div className="text-2xl font-bold text-red-400">-{balance.totalSpent}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Sparkles className="w-5 h-5 text-accent" /> Need more credits?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Daily Check-ins (+10)</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Streak Milestones (+50)</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Upgrade to Pro (Coming Soon)</li>
          </ul>
        </div>
        <Button className="shrink-0 rounded-full px-8 h-12 shadow-lg shadow-primary/20" disabled>
          Upgrade to Pro
        </Button>
      </Card>

      <Card>
        <div className="p-6 border-b border-white/5">
          <h2 className="font-semibold text-lg">Transaction History</h2>
        </div>
        <CardContent className="p-0">
          {txs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No transactions yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {txs.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-5 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'earn' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {tx.type === 'earn' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className={`font-bold font-mono text-lg ${tx.type === 'earn' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.type === 'earn' ? '+' : '-'}{tx.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
