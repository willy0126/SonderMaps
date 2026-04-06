"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMapStore } from "@/stores/map-store"
import { useNearbyStories } from "@/hooks/use-nearby-stories"
import type { StoryMood } from "@/types/story"

const MOOD_CONFIG: Record<StoryMood, { label: string; emoji: string; color: string }> = {
  happy:     { label: "기쁨",   emoji: "😊", color: "#f6c944" },
  sad:       { label: "슬픔",   emoji: "😢", color: "#7ab8e8" },
  nostalgic: { label: "그리움", emoji: "📷", color: "#c4a1e0" },
  longing:   { label: "동경",   emoji: "💭", color: "#7ae8c8" },
}

const MOODS = Object.keys(MOOD_CONFIG) as StoryMood[]

export function MapSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { viewState, activeMoods, toggleMood, clearMoods, setPendingFlyTo } = useMapStore()

  const zoom = viewState.zoom ?? 12
  const radiusKm = Math.min(50, 40000 / Math.pow(2, zoom))

  const { data: stories = [] } = useNearbyStories({
    latitude: viewState.latitude,
    longitude: viewState.longitude,
    radius_km: radiusKm,
    limit: 200,
  })

  const filteredStories = activeMoods.size === 0
    ? stories
    : stories.filter((s) => s.mood && activeMoods.has(s.mood))

  const sorted = [...filteredStories].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className={`fixed left-0 top-0 z-20 h-dvh ${collapsed ? "pointer-events-none" : ""}`}>
      {/* 사이드바 패널 */}
      <div
        className={`flex h-full w-64 flex-col border-r border-white/6 bg-neutral-950/90 backdrop-blur-md transition-transform duration-300 ease-in-out ${
          collapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {/* 헤더 — 로고 */}
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-white/6 px-4">
          <Link
            href="/"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
          >
            <Image
              src="/images/logo-main.png"
              alt="SonderMaps"
              width={20}
              height={20}
              className="h-5 w-5"
            />
          </Link>
          <span className="text-[13px] font-medium tracking-wide text-white/50">
            SonderMaps
          </span>
        </div>

        {/* 감정 필터 */}
        <div className="shrink-0 border-b border-white/6 px-4 py-3">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest text-white/25">감정 필터</span>
            {activeMoods.size > 0 && (
              <button
                type="button"
                onClick={clearMoods}
                className="cursor-pointer text-[11px] text-white/30 transition-colors hover:text-white/60"
              >
                초기화
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MOODS.map((mood) => {
              const cfg = MOOD_CONFIG[mood]
              const active = activeMoods.has(mood)
              return (
                <button
                  key={mood}
                  type="button"
                  onClick={() => toggleMood(mood)}
                  className="flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] tracking-wide transition-all"
                  style={{
                    borderColor: active ? cfg.color : "rgba(255,255,255,0.1)",
                    backgroundColor: active ? `${cfg.color}18` : "transparent",
                    color: active ? cfg.color : "rgba(255,255,255,0.35)",
                  }}
                >
                  <span className="text-[13px]">{cfg.emoji}</span>
                  {cfg.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* 스토리 피드 */}
        <div className="sidebar-scroll flex-1 overflow-y-auto">
          <div className="px-4 py-3">
            <span className="text-[11px] uppercase tracking-widest text-white/25">
              주변 이야기 {sorted.length > 0 ? `${sorted.length}개` : ""}
            </span>
          </div>

          {sorted.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-[12px] text-white/25">주변에 이야기가 없습니다</p>
            </div>
          ) : (
            <ul className="pb-4">
              {sorted.map((story) => {
                const mood = story.mood ? MOOD_CONFIG[story.mood] : null
                return (
                  <li key={story.id}>
                    <button
                      type="button"
                      onClick={() => setPendingFlyTo(story)}
                      className="flex w-full flex-col gap-1.5 px-4 py-3 text-left transition-colors hover:bg-white/5"
                    >
                      <div className="flex items-center gap-1.5">
                        {mood && (
                          <>
                            <span className="text-[13px]">{mood.emoji}</span>
                            <span
                              className="text-[11px] font-medium tracking-wide"
                              style={{ color: mood.color }}
                            >
                              {mood.label}
                            </span>
                          </>
                        )}
                        <span className="ml-auto shrink-0 text-[11px] text-white/20">
                          {new Date(story.created_at).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-[12px] leading-relaxed tracking-wide text-white/50">
                        {story.content}
                      </p>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Collapse 토글 탭 */}
      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        className={`pointer-events-auto absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out ${
          collapsed ? "left-0" : "left-64"
        } flex h-16 w-6 items-center justify-center rounded-r-lg border border-l-0 border-white/15 bg-neutral-700 text-white/70 shadow-lg hover:bg-neutral-600 hover:text-white`}
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  )
}
