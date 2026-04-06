import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { ResonanceData } from "@/types/resonance"

export function useStoryResonance(storyId: string | null) {
  const supabase = createClient()

  return useQuery<ResonanceData>({
    queryKey: ["resonance", storyId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("story_resonances")
        .select("*", { count: "exact", head: true })
        .eq("story_id", storyId!)

      if (error) throw error

      const { data: { user } } = await supabase.auth.getUser()

      let resonated = false
      if (user) {
        const { data } = await supabase
          .from("story_resonances")
          .select("id")
          .eq("story_id", storyId!)
          .eq("user_id", user.id)
          .maybeSingle()

        resonated = !!data
      }

      return { count: count ?? 0, resonated }
    },
    enabled: !!storyId,
    staleTime: 10_000,
  })
}
