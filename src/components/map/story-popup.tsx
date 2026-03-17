"use client"

import { useState, useEffect } from "react"
import { Popup } from "react-map-gl/mapbox"
import { createClient } from "@/lib/supabase/client"
import type { Story } from "@/types/story"

const MOOD_CONFIG = {
  happy: { label: "기쁨", emoji: "😊", color: "#f6c944" },
  sad: { label: "슬픔", emoji: "😢", color: "#7ab8e8" },
  nostalgic: { label: "그리움", emoji: "📷", color: "#c4a1e0" },
  longing: { label: "동경", emoji: "💭", color: "#7ae8c8" },
} as const

const ANON_ADJECTIVES = ["고요한", "빛나는", "떠도는", "아련한", "조용한", "은은한", "따뜻한", "차분한"]
const ANON_NOUNS = ["여행자", "산책자", "몽상가", "관찰자", "이방인", "방랑자", "사색가", "길손"]

function generateAnonName(id: string): string {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const adj = ANON_ADJECTIVES[hash % ANON_ADJECTIVES.length]
  const noun = ANON_NOUNS[Math.floor(hash / ANON_ADJECTIVES.length) % ANON_NOUNS.length]
  return `${adj} ${noun}`
}

interface StoryPopupProps {
  story: Story
  onClose: () => void
}

export function StoryPopup({ story, onClose }: StoryPopupProps) {
  const mood = story.mood && MOOD_CONFIG[story.mood]
  const [authorName, setAuthorName] = useState<string | null>(null)

  useEffect(() => {
    if (!story.author_id) return
    const supabase = createClient()
    supabase
      .from("profiles")
      .select("username, is_anonymous")
      .eq("id", story.author_id)
      .single()
      .then(({ data }) => {
        if (!data) return
        if (data.is_anonymous || !data.username) {
          setAuthorName(generateAnonName(story.author_id!))
        } else {
          setAuthorName(data.username)
        }
      })
  }, [story.author_id])

  return (
    <Popup
      longitude={story.longitude}
      latitude={story.latitude}
      anchor="bottom"
      onClose={onClose}
      closeOnClick={false}
      className="story-popup"
      maxWidth="320px"
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
        <div className="flex items-center justify-between gap-6">
          <p className="text-[11px] tracking-wide text-white/30">
            {new Date(story.created_at).toLocaleDateString("ko-KR")}
          </p>
          {authorName && (
            <p className="text-[11px] tracking-wide text-white/40">
              {authorName}
            </p>
          )}
        </div>
      </div>
    </Popup>
  )
}
