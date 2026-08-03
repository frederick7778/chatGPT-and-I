import { Link } from "wouter"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-muted-foreground mb-8 text-lg">Page not found</p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  )
}
