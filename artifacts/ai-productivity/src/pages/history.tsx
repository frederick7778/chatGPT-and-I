import { useListHistory, useDeleteHistory, getListHistoryQueryKey, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { Trash2, ExternalLink, Calendar, Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function HistoryPage() {
  const { data: history, isLoading } = useListHistory()
  const deleteMut = useDeleteHistory()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")

  const handleDelete = (id: number) => {
    deleteMut.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListHistoryQueryKey() })
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() })
      }
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-48 mb-8" />
        <Skeleton className="h-12 w-full" />
        <div className="space-y-4 mt-8">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      </div>
    )
  }

  if (!history) return null

  const filtered = history.filter(item => 
    item.toolName.toLowerCase().includes(search.toLowerCase()) || 
    item.input.toLowerCase().includes(search.toLowerCase()) || 
    item.output.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight mb-2">Workspace History</h1>
        <p className="text-muted-foreground">Every tool execution, safely stored and searchable.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search input, output, or tool name..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 h-12 bg-card border-white/10"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-white/5">
          <p className="text-muted-foreground">No history found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(entry => (
            <Card key={entry.id} className="p-5 flex flex-col md:flex-row gap-6 hover:border-primary/30 transition-colors">
              <div className="flex-shrink-0 md:w-48 space-y-2 border-r border-white/5 pr-4">
                <div className="font-medium text-primary">{entry.toolName}</div>
                <div className="text-xs flex items-center text-muted-foreground gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(entry.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex-1 min-w-0 overflow-hidden space-y-3">
                <div className="text-sm bg-black/20 p-3 rounded-md border border-white/5 break-words">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Input</span>
                  {entry.input}
                </div>
                <div className="text-sm bg-black/20 p-3 rounded-md border border-white/5 break-words">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Output</span>
                  {entry.output.startsWith('http') ? (
                    <a href={entry.output} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">{entry.output}</a>
                  ) : (
                    entry.output
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 flex md:flex-col justify-end md:justify-start gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)} disabled={deleteMut.isPending} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
