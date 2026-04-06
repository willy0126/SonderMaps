"use client"

import { useState, useEffect } from "react"
import { Popup } from "react-map-gl/mapbox"
import { Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { MAPBOX_TOKEN } from "@/lib/mapbox/config"
import { useStoryResonance } from "@/hooks/use-story-resonance"
import { useToggleResonance } from "@/hooks/use-toggle-resonance"
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
  onDelete: () => void
  onAuthRequired: () => void
  onAuthorClick: (authorId: string, authorName: string) => void
}

export function StoryPopup({ story, onClose, onDelete, onAuthRequired, onAuthorClick }: StoryPopupProps) {
  const mood = story.mood && MOOD_CONFIG[story.mood]
  const [authorName, setAuthorName] = useState<string | null>(null)
  const [isAnonymousAuthor, setIsAnonymousAuthor] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [placeName, setPlaceName] = useState<string | null>(null)
  const { data: resonance } = useStoryResonance(story.id)
  const { mutate: toggleResonance } = useToggleResonance()
  const [deleteConfirming, setDeleteConfirming] = useState(false)

  const isOwnStory = !!currentUserId && currentUserId === story.author_id

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id ?? null))
  }, [])

  function handleDeleteClick() {
    if (!deleteConfirming) {
      setDeleteConfirming(true)
      return
    }
    onDelete()
  }

  function handleResonanceClick() {
    if (!currentUserId) {
      onAuthRequired()
      return
    }
    if (isOwnStory) return
    toggleResonance(story.id)
  }

  useEffect(() => {
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${story.longitude},${story.latitude}.json?access_token=${MAPBOX_TOKEN}&language=ko&types=poi,address,neighborhood&limit=1`)
      .then((res) => res.json())
      .then((data) => {
        const feature = data.features?.[0]
        if (!feature) return
        // context에서 동네(neighborhood) 추출하여 "POI · 동네" 형태로 표시
        const neighborhood = feature.context?.find((c: { id: string }) => c.id.startsWith("neighborhood"))
        if (feature.place_type?.[0] === "neighborhood") {
          setPlaceName(feature.text)
        } else if (neighborhood) {
          setPlaceName(`${feature.text} · ${neighborhood.text}`)
        } else {
          setPlaceName(feature.text)
        }
      })
      .catch(() => {})
  }, [story.longitude, story.latitude])

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
          setIsAnonymousAuthor(true)
        } else {
          setAuthorName(data.username)
          setIsAnonymousAuthor(false)
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
      maxWidth="360px"
    >
      <div className="space-y-3 p-2">
        {mood && (
          <div className="flex items-center gap-2">
            <span className="text-lg">{mood.emoji}</span>
            <span
              className="text-[14px] font-medium tracking-wide"
              style={{ color: mood.color }}
            >
              {mood.label}
            </span>
            {placeName && (
              <span className="ml-auto text-[12px] tracking-wide text-white/25">
                {placeName}
              </span>
            )}
          </div>
        )}
        <p className="whitespace-pre-line text-[15px] leading-[1.8] tracking-wide text-white/80">
          {story.content}
        </p>
        <div className="flex items-center justify-between gap-6">
          <p className="text-[13px] tracking-wide text-white/30">
            {new Date(story.created_at).toLocaleDateString("ko-KR")}
          </p>
          {authorName && (
            isAnonymousAuthor ? (
              <p className="text-[13px] tracking-wide text-white/40">
                {authorName}
              </p>
            ) : (
              <button
                type="button"
                onClick={() => onAuthorClick(story.author_id!, authorName)}
                className="cursor-pointer text-[13px] tracking-wide text-white/40 underline underline-offset-2 transition-colors hover:text-white/60"
              >
                {authorName}
              </button>
            )
          )}
        </div>

        {/* 공명 + 삭제 */}
        <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
          <button
            type="button"
            onClick={handleResonanceClick}
            disabled={isOwnStory}
            className={`flex items-center gap-1.5 transition-opacity ${
              isOwnStory ? "cursor-default opacity-30" : "cursor-pointer hover:opacity-80"
            }`}
          >
            <span className="text-base">{resonance?.resonated ? "💜" : "🤍"}</span>
            <span className={`text-[14px] tracking-wide ${resonance?.resonated ? "text-violet-400" : "text-white/30"}`}>
              {resonance?.count ?? 0}
            </span>
          </button>

          {isOwnStory && (
            <div className="flex items-center gap-2">
              {deleteConfirming ? (
                <>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirming(false)}
                    className="text-[12px] tracking-wide text-white/30 transition-colors hover:text-white/60"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="text-[12px] tracking-wide text-red-400 transition-colors hover:text-red-300"
                  >
                    삭제
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="flex items-center gap-1 text-[12px] tracking-wide text-white/20 transition-colors hover:text-white/50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Popup>
  )
}
