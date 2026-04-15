"use client"

import { X } from "lucide-react"
import type { Story } from "@/types/story"

const MOOD_CONFIG = {
  happy: { label: "기쁨", emoji: "😊", color: "#f6c944" },
  sad: { label: "슬픔", emoji: "😢", color: "#7ab8e8" },
  nostalgic: { label: "그리움", emoji: "📷", color: "#c4a1e0" },
  longing: { label: "동경", emoji: "💭", color: "#7ae8c8" },
} as const

interface ClusterStoryListProps {
  stories: Story[]
  onSelect: (story: Story) => void
  onClose: () => void
}

export function ClusterStoryList({ stories, onSelect, onClose }: ClusterStoryListProps) {
  return (
    <div className="fixed bottom-6 left-1/2 z-30 w-80 -translate-x-1/2 rounded-2xl border border-white/10 bg-neutral-950/90 shadow-2xl backdrop-blur-md">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
        <span className="text-[13px] tracking-wide text-white/40">
          이 장소의 이야기 {stories.length}개
        </span>
        <button
          type="button"
          onClick={onClose}
          className="flex h-5 w-5 items-center justify-center text-white/30 transition-colors hover:text-white/60"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 스토리 목록 */}
      <ul className="max-h-72 overflow-y-auto py-1">
        {stories.map((story) => {
          const mood = story.mood && MOOD_CONFIG[story.mood]
          return (
            <li key={story.id}>
              <button
                type="button"
                onClick={() => onSelect(story)}
                className="flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-white/5"
              >
                <div className="flex items-center gap-1.5">
                  {mood && (
                    <>
                      <span className="text-sm">{mood.emoji}</span>
                      <span
                        className="text-[12px] font-medium tracking-wide"
                        style={{ color: mood.color }}
                      >
                        {mood.label}
                      </span>
                    </>
                  )}
                  <span className="ml-auto text-[11px] tracking-wide text-white/25">
                    {new Date(story.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <p className="line-clamp-2 text-[13px] leading-relaxed tracking-wide text-white/60">
                  {story.content}
                </p>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
