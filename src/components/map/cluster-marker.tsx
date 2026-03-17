"use client"

import { Marker } from "react-map-gl/mapbox"
import type { ClusterPoint } from "@/hooks/use-story-clusters"

interface ClusterMarkerProps {
  cluster: ClusterPoint
  onClick: (cluster: ClusterPoint) => void
}

export function ClusterMarker({ cluster, onClick }: ClusterMarkerProps) {
  const size = Math.min(50, 28 + Math.log2(cluster.count) * 8)

  return (
    <Marker
      longitude={cluster.longitude}
      latitude={cluster.latitude}
      anchor="center"
      onClick={(e) => {
        e.originalEvent.stopPropagation()
        onClick(cluster)
      }}
    >
      <div
        className="flex cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm transition-transform duration-200 hover:scale-110"
        style={{ width: size, height: size }}
      >
        <span className="text-[12px] font-medium text-white/70">{cluster.count}</span>
      </div>
    </Marker>
  )
}
