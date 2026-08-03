import { useGetMe, useUpdateProfile, getGetMeQueryKey } from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { User, Loader2, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(200, "Bio is too long").optional().nullable(),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { data: user, isLoading } = useGetMe()
  const updateProfile = useUpdateProfile()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name || "",
      bio: user?.bio || "",
    }
  })

  const onSubmit = (data: ProfileForm) => {
    updateProfile.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() })
        toast({ title: "Profile updated successfully" })
      },
      onError: () => {
        toast({ title: "Update failed", variant: "destructive" })
      }
    })
  }

  if (isLoading || !user) return null

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your personal information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Public Profile</CardTitle>
          <CardDescription>This information will be displayed on your public link.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-2xl bg-accent/20 flex items-center justify-center border border-accent/30 text-accent">
                <User className="w-10 h-10" />
              </div>
              <Button type="button" variant="outline" size="sm">Change Avatar</Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled className="opacity-70 cursor-not-allowed" />
              <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" {...register("name")} className={errors.name ? "border-destructive" : ""} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                {...register("bio")} 
                placeholder="A short bio about yourself..."
                className="resize-none"
              />
              {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
            </div>

            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
