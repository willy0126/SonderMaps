import { useState, useEffect } from "react"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Story, NearbyStoriesParams } from "@/types/story"

function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function useNearbyStories(params: NearbyStoriesParams) {
  const supabase = createClient()

  // 좌표/반경 변경을 300ms debounce → 지도 이동 중 과도한 쿼리 방지
  const debouncedParams = useDebounced(params, 300)

  return useQuery<Story[]>({
    queryKey: ["stories", "nearby", debouncedParams],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_nearby_stories", {
        lat: debouncedParams.latitude,
        lng: debouncedParams.longitude,
        radius_km: debouncedParams.radius_km,
        result_limit: debouncedParams.limit ?? 50,
      })

      if (error) throw error
      return data as Story[]
    },
    enabled: debouncedParams.latitude !== 0 && debouncedParams.longitude !== 0,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}
