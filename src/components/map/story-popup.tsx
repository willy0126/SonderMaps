"use client"

import { Popup } from "react-map-gl/mapbox"
import type { Story } from "@/types/story"

const MOOD_CONFIG = {
  happy: { label: "기쁨", emoji: "😊", color: "#f6c944" },
  sad: { label: "슬픔", emoji: "😢", color: "#7ab8e8" },
  nostalgic: { label: "그리움", emoji: "📷", color: "#c4a1e0" },
  longing: { label: "동경", emoji: "💭", color: "#7ae8c8" },
} as const

interface StoryPopupProps {
  story: Story
  onClose: () => void
}

export function StoryPopup({ story, onClose }: StoryPopupProps) {
  const mood = story.mood && MOOD_CONFIG[story.mood]

  return (
    <Popup
      longitude={story.longitude}
      latitude={story.latitude}
      anchor="bottom"
      onClose={onClose}
      closeOnClick={false}
      className="story-popup"
      maxWidth="280px"
    >
      <div className="space-y-3 p-1">
        {mood && (
          <div className="flex items-center gap-2">
            <span className="text-base">{mood.emoji}</span>
            <span
              className="text-[12px] font-medium tracking-wide"
              style={{ color: mood.color }}
            >
              {mood.label}
            </span>
          </div>
        )}
        <p className="whitespace-pre-line text-[14px] leading-[1.8] tracking-wide text-white/80">
          {story.content}
        </p>
        <p className="text-[11px] tracking-wide text-white/30">
          {new Date(story.created_at).toLocaleDateString("ko-KR")}
        </p>
      </div>
    </Popup>
  )
}
