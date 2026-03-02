"use client"

import { Popup } from "react-map-gl/mapbox"
import type { Story } from "@/types/story"

interface StoryPopupProps {
  story: Story
  onClose: () => void
}

export function StoryPopup({ story, onClose }: StoryPopupProps) {
  return (
    <Popup
      longitude={story.longitude}
      latitude={story.latitude}
      anchor="bottom"
      onClose={onClose}
      closeOnClick={false}
      className="max-w-xs"
    >
      <div className="p-2 space-y-2">
        <p className="text-sm text-foreground">{story.content}</p>
        {story.mood && (
          <span className="text-xs text-muted-foreground">#{story.mood}</span>
        )}
      </div>
    </Popup>
  )
}
