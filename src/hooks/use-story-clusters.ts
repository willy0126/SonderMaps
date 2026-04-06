import { useMemo } from "react"
import Supercluster from "supercluster"
import type { Story } from "@/types/story"

export interface ClusterPoint {
  type: "cluster"
  id: number
  longitude: number
  latitude: number
  count: number
  expansionZoom: number
}

export interface StoryPoint {
  type: "story"
  story: Story
  longitude: number
  latitude: number
}

export type MapPoint = ClusterPoint | StoryPoint

export function useStoryClusters(stories: Story[], zoom: number, bounds?: [number, number, number, number]) {
  const index = useMemo(() => {
    const sc = new Supercluster<{ story: Story }>({
      radius: 60,
      maxZoom: 13,
    })

    const points: Supercluster.PointFeature<{ story: Story }>[] = stories.map((story) => ({
      type: "Feature",
      properties: { story },
      geometry: {
        type: "Point",
        coordinates: [story.longitude, story.latitude],
      },
    }))

    sc.load(points)
    return sc
  }, [stories])

  const points = useMemo<MapPoint[]>(() => {
    if (!bounds) return []

    const clusters = index.getClusters(bounds, Math.floor(zoom))

    return clusters.map((feature) => {
      const [lng, lat] = feature.geometry.coordinates
      const props = feature.properties

      if ("cluster" in props && props.cluster) {
        return {
          type: "cluster" as const,
          id: props.cluster_id as number,
          longitude: lng,
          latitude: lat,
          count: props.point_count as number,
          expansionZoom: index.getClusterExpansionZoom(props.cluster_id as number),
        }
      }

      return {
        type: "story" as const,
        story: props.story,
        longitude: lng,
        latitude: lat,
      }
    })
  }, [index, zoom, bounds])

  return points
}
