import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Story, NearbyStoriesParams } from "@/types/story"

export function useNearbyStories(params: NearbyStoriesParams) {
  const supabase = createClient()

  return useQuery<Story[]>({
    queryKey: ["stories", "nearby", params],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_nearby_stories", {
        lat: params.latitude,
        lng: params.longitude,
        radius_km: params.radius_km,
        result_limit: params.limit ?? 50,
      })

      if (error) throw error
      return data as Story[]
    },
    enabled: params.latitude !== 0 && params.longitude !== 0,
  })
}
