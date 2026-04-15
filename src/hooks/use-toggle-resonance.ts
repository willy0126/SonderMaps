import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { ResonanceData } from "@/types/resonance"

export function useToggleResonance() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (storyId: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data: existing } = await supabase
        .from("story_resonances")
        .select("id")
        .eq("story_id", storyId)
        .eq("user_id", user.id)
        .maybeSingle()

      if (existing) {
        await supabase.from("story_resonances").delete().eq("id", existing.id)
      } else {
        await supabase.from("story_resonances").insert({
          story_id: storyId,
          user_id: user.id,
        })
      }
    },

    onMutate: async (storyId) => {
      await queryClient.cancelQueries({ queryKey: ["resonance", storyId] })

      const previous = queryClient.getQueryData<ResonanceData>(["resonance", storyId])

      if (previous) {
        queryClient.setQueryData<ResonanceData>(["resonance", storyId], {
          count: previous.resonated ? previous.count - 1 : previous.count + 1,
          resonated: !previous.resonated,
        })
      }

      return { previous }
    },

    onError: (_err, storyId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["resonance", storyId], context.previous)
      }
    },

    onSettled: (_data, _error, storyId) => {
      queryClient.invalidateQueries({ queryKey: ["resonance", storyId] })
    },
  })
}
