"use client"

import { useAuthorStories } from "@/hooks/use-author-stories"
import type { Story, StoryMood } from "@/types/story"

const MOOD_CONFIG: Record<StoryMood, { label: string; emoji: string; color: string }> = {
  happy: { label: "기쁨", emoji: "😊", color: "#f6c944" },
  sad: { label: "슬픔", emoji: "😢", color: "#7ab8e8" },
  nostalgic: { label: "그리움", emoji: "📷", color: "#c4a1e0" },
  longing: { label: "동경", emoji: "💭", color: "#7ae8c8" },
}

interface AuthorStoriesModalProps {
  authorId: string
  authorName: string
  onClose: () => void
  onStoryClick: (story: Story) => void
}

export function AuthorStoriesModal({ authorId, authorName, onClose, onStoryClick }: AuthorStoriesModalProps) {
  const { data: stories, isLoading } = useAuthorStories(authorId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" style={{ animationDuration: "0.3s" }}>
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        className="relative w-80 animate-fade-in-up rounded-2xl border border-white/10 bg-neutral-900/95 shadow-2xl backdrop-blur-sm"
        style={{ animationDuration: "0.3s" }}
      >
        {/* 헤더 */}
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="text-[15px] font-medium tracking-wide text-white/80">
            {authorName}의 이야기
          </h3>
        </div>

        {/* 스토리 목록 */}
        <div className="max-h-[60vh] overflow-y-auto px-4 py-3">
          {isLoading ? (
            <p className="py-8 text-center text-[13px] text-white/30">불러오는 중...</p>
          ) : !stories || stories.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-white/30">아직 남긴 이야기가 없습니다</p>
          ) : (
            <div className="space-y-2">
              {stories.map((story) => {
                const mood = story.mood && MOOD_CONFIG[story.mood]
                return (
                  <button
                    key={story.id}
                    type="button"
                    onClick={() => onStoryClick(story)}
                    className="w-full cursor-pointer space-y-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-colors hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {mood && <span className="text-sm">{mood.emoji}</span>}
                        {mood && (
                          <span className="text-[11px] tracking-wide" style={{ color: mood.color }}>
                            {mood.label}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-white/25">
                        {new Date(story.created_at).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                    <p className="truncate text-[13px] leading-relaxed text-white/60">
                      {story.content}
                    </p>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
