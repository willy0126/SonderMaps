"use client"

import { useState } from "react"
import Link from "next/link"
import { Map } from "react-map-gl/mapbox"
import type { MapMouseEvent } from "react-map-gl/mapbox"
import { MAPBOX_TOKEN, DEFAULT_MAP_CONFIG } from "@/lib/mapbox/config"
import { useMapStore } from "@/stores/map-store"
import { useNearbyStories } from "@/hooks/use-nearby-stories"
import { createClient } from "@/lib/supabase/client"
import { SEOUL_BOUNDS } from "@/components/landing/explore-data"
import { SEOUL_MASK, SEOUL_BORDER } from "@/components/landing/seoul-boundary"
import { StoryMarker } from "./story-marker"
import { StoryPopup } from "./story-popup"
import { StoryForm } from "./story-form"
import type { Story } from "@/types/story"
import { useQueryClient } from "@tanstack/react-query"
import "mapbox-gl/dist/mapbox-gl.css"

export function MapView() {
  const queryClient = useQueryClient()
  const { viewState, setViewState } = useMapStore()

  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [formPosition, setFormPosition] = useState<{ lng: number; lat: number } | null>(null)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)

  const { data: stories = [] } = useNearbyStories({
    latitude: viewState.latitude,
    longitude: viewState.longitude,
    radius_km: 10,
    limit: 100,
  })

  const handleMapClick = async (e: MapMouseEvent) => {
    // 팝업/마커가 아닌 빈 영역 클릭 시
    setSelectedStory(null)
    setFormPosition(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setShowAuthPrompt(true)
      return
    }

    setFormPosition({ lng: e.lngLat.lng, lat: e.lngLat.lat })
  }

  const handleMapLoad = (e: { target: mapboxgl.Map }) => {
    const map = e.target
    map.setLanguage("ko")

    // 지명/도로명 간소화 — 주요 라벨만 유지
    const hideLayers = [
      "poi-label",
      "transit-label",
      "natural-point-label",
      "water-point-label",
      "waterway-label",
      "road-label",
    ]

    for (const id of hideLayers) {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, "visibility", "none")
      }
    }

    // 배경색 — neutral-950과 통일
    if (map.getLayer("background")) {
      map.setPaintProperty("background", "background-color", "#0a0a0a")
    }

    // 물(한강 등) — 어두운 네이비 블루
    if (map.getLayer("water")) {
      map.setPaintProperty("water", "fill-color", "#0d1b2a")
    }

    // 공원/녹지 — 어두운 그린
    for (const id of ["landuse", "landcover"]) {
      if (map.getLayer(id)) {
        map.setPaintProperty(id, "fill-color", "#0a1a12")
        map.setPaintProperty(id, "fill-opacity", 0.6)
      }
    }

    // 주요 도로 — 약간 밝게
    for (const id of [
      "road-street",
      "road-secondary-tertiary",
      "road-primary",
      "road-motorway-trunk",
    ]) {
      if (map.getLayer(id)) {
        map.setPaintProperty(id, "line-color", "#1e1e28")
      }
    }

    // 서울 외부 마스킹
    map.addSource("seoul-mask", { type: "geojson", data: SEOUL_MASK })
    map.addLayer({
      id: "seoul-mask-fill",
      type: "fill",
      source: "seoul-mask",
      paint: { "fill-color": "#0a0a0a", "fill-opacity": 0.65 },
    })

    // 경계 블러 라인
    map.addSource("seoul-border", { type: "geojson", data: SEOUL_BORDER })
    map.addLayer({
      id: "seoul-edge-blur",
      type: "line",
      source: "seoul-border",
      paint: {
        "line-color": "#0a0a0a",
        "line-width": 40,
        "line-blur": 30,
        "line-opacity": 0.4,
      },
    })

    // 구 경계선
    try {
      map.addLayer({
        id: "seoul-gu-boundary",
        type: "line",
        source: "composite",
        "source-layer": "admin",
        filter: ["==", ["get", "admin_level"], 2],
        paint: {
          "line-color": "#ffffff",
          "line-opacity": 0.12,
          "line-width": 0.8,
          "line-dasharray": [3, 2],
        },
      })
    } catch {
      // 레이어가 이미 존재하거나 소스가 없는 경우 무시
    }
  }

  return (
    <>
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle={DEFAULT_MAP_CONFIG.mapStyle}
      style={{ width: "100%", height: "100%" }}
      maxBounds={SEOUL_BOUNDS}
      attributionControl={false}
      dragRotate={false}
      pitchWithRotate={false}
      onLoad={handleMapLoad}
      onClick={handleMapClick}
    >
      {stories.map((story) => (
        <StoryMarker
          key={story.id}
          story={story}
          onClick={(s) => {
            setFormPosition(null)
            setSelectedStory(s)
          }}
        />
      ))}

      {selectedStory && (
        <StoryPopup
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}

      {formPosition && (
        <StoryForm
          longitude={formPosition.lng}
          latitude={formPosition.lat}
          onClose={() => setFormPosition(null)}
          onSuccess={() => {
            setFormPosition(null)
            queryClient.invalidateQueries({ queryKey: ["stories", "nearby"] })
          }}
        />
      )}

    </Map>
    <AuthPrompt show={showAuthPrompt} onClose={() => setShowAuthPrompt(false)} />
    </>
  )
}

function AuthPrompt({ show, onClose }: { show: boolean; onClose: () => void }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" style={{ animationDuration: "0.3s" }}>
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      {/* modal */}
      <div className="relative animate-fade-in-up space-y-5 rounded-2xl border border-white/10 bg-neutral-900/95 px-8 py-7 text-center shadow-2xl backdrop-blur-sm" style={{ animationDuration: "0.3s" }}>
        <p className="text-[15px] tracking-wide text-white/80">
          이야기를 남기려면 로그인이 필요해요
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-white/10 px-5 py-1.5 text-[13px] tracking-wide text-white/50 transition-all hover:border-white/20 hover:text-white/70"
          >
            취소
          </button>
          <Link
            href="/auth"
            className="rounded-full bg-white/15 px-5 py-1.5 text-[13px] font-medium tracking-wide text-white/80 transition-all hover:bg-white/25"
          >
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  )
}
