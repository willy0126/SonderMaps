"use client"

import { Marker } from "react-map-gl/mapbox"
import type { Story } from "@/types/story"

interface StoryMarkerProps {
  story: Story
  onClick: (story: Story) => void
}

export function StoryMarker({ story, onClick }: StoryMarkerProps) {
  return (
    <Marker
      longitude={story.longitude}
      latitude={story.latitude}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation()
        onClick(story)
      }}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg cursor-pointer hover:scale-110 transition-transform">
        <span className="text-xs">S</span>
      </div>
    </Marker>
  )
}
