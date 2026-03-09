"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Popup } from "react-map-gl/mapbox"
import type { StoryMood } from "@/types/story"

const MOODS: { key: StoryMood; emoji: string; label: string; color: string }[] = [
  { key: "happy", emoji: "😊", label: "기쁨", color: "#f6c944" },
  { key: "sad", emoji: "😢", label: "슬픔", color: "#7ab8e8" },
  { key: "nostalgic", emoji: "📷", label: "그리움", color: "#c4a1e0" },
  { key: "longing", emoji: "💭", label: "동경", color: "#7ae8c8" },
]

interface StoryFormProps {
  longitude: number
  latitude: number
  onClose: () => void
  onSuccess: () => void
}

export function StoryForm({ longitude, latitude, onClose, onSuccess }: StoryFormProps) {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [mood, setMood] = useState<StoryMood | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!content.trim() || !mood) return

    setSubmitting(true)
    setError(null)

    const supabase = createClient()

    // 로그인 확인
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth")
      return
    }

    const { error: insertError } = await supabase.from("stories").insert({
      content: content.trim(),
      latitude,
      longitude,
      mood,
    })

    if (insertError) {
      console.error("Story insert error:", insertError)
      setError("저장에 실패했습니다. 다시 시도해주세요.")
      setSubmitting(false)
      return
    }

    onSuccess()
  }

  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      anchor="bottom"
      onClose={onClose}
      closeOnClick={false}
      className="story-popup"
      maxWidth="320px"
    >
      <div className="space-y-4 p-1">
        <p className="text-[13px] font-medium tracking-wide text-white/70">
          이 장소에 이야기 남기기
        </p>

        {/* Mood selector */}
        <div className="flex gap-2">
          {MOODS.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMood(m.key)}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] transition-all ${
                mood === m.key
                  ? "border-white/30 bg-white/10"
                  : "border-white/10 bg-transparent hover:border-white/20"
              }`}
            >
              <span>{m.emoji}</span>
              <span
                className="tracking-wide"
                style={{ color: mood === m.key ? m.color : "rgba(255,255,255,0.5)" }}
              >
                {m.label}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="당신의 이야기를 적어주세요..."
          maxLength={300}
          rows={4}
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-[14px] leading-[1.8] tracking-wide text-white/80 placeholder:text-white/30 focus:border-white/20 focus:outline-none"
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/30">
            {content.length}/300
          </span>

          {error && (
            <span className="text-[12px] text-red-400">{error}</span>
          )}

          <button
            type="button"
            disabled={!content.trim() || !mood || submitting}
            onClick={handleSubmit}
            className="cursor-pointer rounded-full bg-white/15 px-4 py-1.5 text-[13px] font-medium tracking-wide text-white/80 transition-all hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "저장 중..." : "남기기"}
          </button>
        </div>
      </div>
    </Popup>
  )
}
