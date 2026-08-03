import { useGetDashboardSummary } from "@workspace/api-client-react"
import { Link } from "wouter"
import { Heart, ArrowRight, Zap, Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function FavoritesPage() {
  const { data: summary, isLoading } = useGetDashboardSummary()

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  if (!summary) return null

  const getIcon = (name: string) => {
    switch(name) {
      case 'qr-code': return "📱"
      case 'key': return "🔑"
      case 'file-text': return "📝"
      case 'briefcase': return "👔"
      case 'file-spreadsheet': return "🧾"
      default: return "✨"
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight mb-2">Favorite Tools</h1>
        <p className="text-muted-foreground">Quick access to your most used utilities.</p>
      </div>

      {summary.favoriteTools.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-2xl border border-white/5">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="font-medium text-lg mb-1">No favorites yet</h3>
          <p className="text-muted-foreground mb-6">Star tools in the catalog to add them here for quick access.</p>
          <Link href="/tools" className="inline-flex items-center text-primary font-medium hover:underline">
            Browse catalog <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summary.favoriteTools.map(tool => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}>
              <Card className="h-full hover:border-primary/50 transition-colors group cursor-pointer relative overflow-hidden flex flex-col">
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Star className="w-3 h-3 text-primary fill-primary" />
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-card border border-white/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:border-primary/30 transition-all">
                    {getIcon(tool.icon)}
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6 flex-1">{tool.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="text-xs text-muted-foreground">{tool.category}</span>
                    <div className="flex items-center gap-1 text-xs font-medium bg-white/5 px-2 py-1 rounded-md">
                      <Zap className="w-3 h-3 text-accent" />
                      <span>{tool.creditsPerUse} Cr</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
