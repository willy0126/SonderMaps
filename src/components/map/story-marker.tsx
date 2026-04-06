"use client"

import { Marker } from "react-map-gl/mapbox"
import type { Story } from "@/types/story"

const MOOD_CONFIG = {
  happy: { emoji: "😊", color: "#f6c944" },
  sad: { emoji: "😢", color: "#7ab8e8" },
  nostalgic: { emoji: "📷", color: "#c4a1e0" },
  longing: { emoji: "💭", color: "#7ae8c8" },
} as const

interface StoryMarkerProps {
  story: Story
  onClick: (story: Story) => void
  fading?: boolean
}

export function StoryMarker({ story, onClick, fading }: StoryMarkerProps) {
  const mood = story.mood && MOOD_CONFIG[story.mood]
  const color = mood?.color ?? "#ffffff"

  return (
    <Marker
      longitude={story.longitude}
      latitude={story.latitude}
      anchor="center"
      onClick={(e) => {
        e.originalEvent.stopPropagation()
        onClick(story)
      }}
    >
      <div
        className="group relative flex flex-col items-center transition-opacity duration-1000"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <div className="relative flex h-9 w-9 items-center justify-center">
          <span
            className="animate-marker-pulse absolute h-9 w-9 rounded-full pointer-events-none"
            style={{ backgroundColor: color }}
          />
          <span
            className="relative z-10 h-3.5 w-3.5 cursor-pointer rounded-full border-2 border-[#0a0a0a] transition-transform duration-200 group-hover:scale-[1.3]"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    </Marker>
  )
}
