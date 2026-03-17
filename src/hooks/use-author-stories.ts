import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Story } from "@/types/story"

export function useAuthorStories(authorId: string | null) {
  const supabase = createClient()

  return useQuery<Story[]>({
    queryKey: ["stories", "author", authorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stories")
        .select()
        .eq("author_id", authorId!)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as Story[]
    },
    enabled: !!authorId,
    staleTime: 30_000,
  })
}
