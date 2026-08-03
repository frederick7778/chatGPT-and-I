import { useState } from "react"
import { Link } from "wouter"
import { 
  useListTools, 
  useListFavorites,
  useAddFavorite,
  useRemoveFavorite,
  getListFavoritesQueryKey
} from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { Heart, Search, QrCode, KeyRound, AlignLeft, FileUser, Receipt, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  QrCode, KeyRound, AlignLeft, FileUser, Receipt, Sparkles
}

const CATEGORIES = ["All", "Utilities", "Security", "Writing", "Career", "Business"]

export default function ToolsPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const { data: tools, isLoading } = useListTools()
  const { data: favorites } = useListFavorites()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const addFav = useAddFavorite()
  const remFav = useRemoveFavorite()

  const favSlugs = new Set(favorites?.map(f => f.toolSlug) ?? [])

  const toggleFavorite = (e: React.MouseEvent, slug: string) => {
    e.preventDefault()
    if (favSlugs.has(slug)) {
      remFav.mutate({ toolSlug: slug }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFavoritesQueryKey() })
          toast({ title: "Removed from favorites" })
        }
      })
    } else {
      addFav.mutate({ toolSlug: slug }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFavoritesQueryKey() })
          toast({ title: "Added to favorites" })
        }
      })
    }
  }

  const filtered = tools?.filter(tool => {
    const matchesSearch = !search || tool.name.toLowerCase().includes(search.toLowerCase()) || tool.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === "All" || tool.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Tool Catalog</h1>
        <p className="text-muted-foreground">Discover productivity tools to supercharge your workflow</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="pl-9"
            data-testid="input-search-tools"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="text-xs"
              data-testid={`button-category-${cat.toLowerCase()}`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Tool Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : filtered?.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No tools match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered?.map(tool => {
            const Icon = ICON_MAP[tool.icon] ?? Sparkles
            const isFav = favSlugs.has(tool.slug)
            return (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                <Card
                  className="p-6 h-full flex flex-col gap-4 cursor-pointer hover:border-primary/40 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 group relative"
                  data-testid={`card-tool-${tool.slug}`}
                >
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {tool.isNew && <Badge className="text-[10px] px-1.5 py-0 bg-green-500/20 text-green-400 border-green-500/30">NEW</Badge>}
                    {tool.isPremium && <Badge className="text-[10px] px-1.5 py-0 bg-amber-500/20 text-amber-400 border-amber-500/30">PRO</Badge>}
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <button
                      onClick={e => toggleFavorite(e, tool.slug)}
                      className={`p-2 rounded-full transition-colors hover:bg-white/10 ${isFav ? 'text-primary' : 'text-muted-foreground'}`}
                      data-testid={`button-favorite-${tool.slug}`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-primary' : ''}`} />
                    </button>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="secondary" className="text-xs">{tool.category}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />{tool.creditsPerUse} cr
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
