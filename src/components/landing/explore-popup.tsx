"use client"

import { Popup } from "react-map-gl/mapbox"
import type { LocationGroup } from "./explore-data"

interface ExplorePopupProps {
  group: LocationGroup
  activeIndex: number
  onPrev: () => void
  onNext: () => void
  onClose: () => void
}

export function ExplorePopup({
  group,
  activeIndex,
  onPrev,
  onNext,
  onClose,
}: ExplorePopupProps) {
  const { coords, pins } = group
  const pin = pins[activeIndex]
  const { emotion, location, content, resonance } = pin
  const [lng, lat] = coords

  return (
    <Popup
      longitude={lng}
      latitude={lat}
      anchor="bottom"
      onClose={onClose}
      closeOnClick={false}
      closeButton={false}
      className="explore-popup"
      offset={25}
    >
      <div className="w-64 rounded-xl border border-[#2a2a35] bg-[#131318] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.7)]">
        {/* Emotion tag */}
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.2em]"
          style={{
            backgroundColor: `${emotion.color}1e`,
            color: emotion.color,
          }}
        >
          {emotion.emoji} {emotion.label}
        </span>

        {/* Location */}
        <p className="mt-2.5 text-[11px] tracking-[0.1em] text-[#5a5750]">
          {location}
        </p>

        {/* Story content */}
        <p className="mt-2 font-(family-name:--font-noto-serif) text-[13px] font-extralight leading-[1.8] text-[#f0ece4]">
          {content.split("\n").map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>

        {/* Resonance */}
        <p className="mt-3 text-[11px] tracking-[0.1em] text-[#3a3a4a]">
          ◎ &nbsp;{resonance}명이 공명했어요
        </p>

        {/* Carousel navigation */}
        {pins.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3 border-t border-white/5 pt-3">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onPrev()
              }}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[14px] text-white/30 transition-colors hover:bg-white/5 hover:text-white/60"
            >
              ‹
            </button>

            <div className="flex items-center gap-1.5">
              {pins.map((p, i) => (
                <span
                  key={p.id}
                  className="h-1.5 rounded-full transition-all duration-200"
                  style={{
                    width: i === activeIndex ? 12 : 6,
                    backgroundColor:
                      i === activeIndex ? p.emotion.color : "#3a3a4a",
                  }}
                />
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onNext()
              }}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[14px] text-white/30 transition-colors hover:bg-white/5 hover:text-white/60"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </Popup>
  )
}
