"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { LocateFixed } from "lucide-react"
import Link from "next/link"
import { Map } from "react-map-gl/mapbox"
import type { MapMouseEvent, MapRef } from "react-map-gl/mapbox"
import { MAPBOX_TOKEN, DEFAULT_MAP_CONFIG } from "@/lib/mapbox/config"
import { useMapStore } from "@/stores/map-store"
import { useNearbyStories } from "@/hooks/use-nearby-stories"
import { useStoryClusters } from "@/hooks/use-story-clusters"
import type { ClusterPoint } from "@/hooks/use-story-clusters"
import { createClient } from "@/lib/supabase/client"
import { SEOUL_BOUNDS } from "@/components/landing/explore-data"
import { SEOUL_MASK, SEOUL_BORDER, SEOUL_COORDS } from "@/components/landing/seoul-boundary"
import { StoryMarker } from "./story-marker"
import { ClusterMarker } from "./cluster-marker"
import { StoryPopup } from "./story-popup"
import { StoryForm } from "./story-form"
import { SearchBar } from "./search-bar"
import { AuthorStoriesModal } from "./author-stories-modal"
import { ClusterStoryList } from "./cluster-story-list"
import type { Story } from "@/types/story"
import { useQueryClient } from "@tanstack/react-query"

// Ray-casting point-in-polygon
function isInsideSeoul(lng: number, lat: number): boolean {
  let inside = false
  for (let i = 0, j = SEOUL_COORDS.length - 1; i < SEOUL_COORDS.length; j = i++) {
    const [xi, yi] = SEOUL_COORDS[i]
    const [xj, yj] = SEOUL_COORDS[j]
    if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }
  return inside
}

const PIN_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='26' viewBox='0 0 28 36'%3E%3Cpath d='M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.27 21.73 0 14 0z' fill='%23f87171' fill-opacity='0.65'/%3E%3Ccircle cx='14' cy='14' r='6' fill='%230a0a0a' fill-opacity='0.9'/%3E%3C/svg%3E") 7 18, crosshair`

export function MapView() {
  const mapRef = useRef<MapRef>(null)
  const queryClient = useQueryClient()
  const { viewState, setViewState, activeMoods, pendingFlyTo, setPendingFlyTo } = useMapStore()
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [deletingStoryId, setDeletingStoryId] = useState<string | null>(null)
  const [clusterStories, setClusterStories] = useState<Story[] | null>(null)
  const [formPosition, setFormPosition] = useState<{ lng: number; lat: number } | null>(null)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [mapBounds, setMapBounds] = useState<[number, number, number, number] | undefined>()
  const [authorModal, setAuthorModal] = useState<{ id: string; name: string } | null>(null)
  const [mapCursor, setMapCursor] = useState<string>("default")
  const [mapLoaded, setMapLoaded] = useState(false)

  // 줌 레벨에 따라 검색 반경 동적 조정
  const zoom = viewState.zoom ?? 12
  const radiusKm = Math.min(50, 40000 / Math.pow(2, zoom))

  const { data: stories = [], isError: storiesError } = useNearbyStories({
    latitude: viewState.latitude,
    longitude: viewState.longitude,
    radius_km: radiusKm,
    limit: 200,
  })

  const filteredStories = activeMoods.size === 0
    ? stories
    : stories.filter((s) => s.mood && activeMoods.has(s.mood))

  const { points: clusterPoints, getClusterStories } = useStoryClusters(filteredStories, zoom, mapBounds)

  useEffect(() => {
    if (!pendingFlyTo || !mapLoaded) return
    const map = mapRef.current?.getMap()
    if (!map) return

    setFormPosition(null)
    setClusterStories(null)
    setPendingFlyTo(null)

    const story = pendingFlyTo

    map.flyTo({
      center: [story.longitude, story.latitude],
      zoom: 14,
      duration: 1200,
    })

    const onMoveEnd = () => {
      setSelectedStory(story)
      map.off("moveend", onMoveEnd)
    }
    map.on("moveend", onMoveEnd)
  }, [pendingFlyTo, mapLoaded, setPendingFlyTo])

  const updateBounds = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return
    const b = map.getBounds()
    if (!b) return
    setMapBounds([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()])
  }, [])

  async function handleStoryDelete(storyId: string) {
    setSelectedStory(null)
    setDeletingStoryId(storyId)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const supabase = createClient()
      const { error } = await supabase.from("stories").delete().eq("id", storyId)
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ["stories", "nearby"] })
      }
    } finally {
      setDeletingStoryId(null)
    }
  }

  const handleClusterClick = useCallback((cluster: ClusterPoint) => {
    if (cluster.expansionZoom > 14) {
      setClusterStories(getClusterStories(cluster.id))
    } else {
      mapRef.current?.flyTo({
        center: [cluster.longitude, cluster.latitude],
        zoom: cluster.expansionZoom,
        duration: 500,
      })
    }
  }, [getClusterStories])

  const handleMapClick = async (e: MapMouseEvent) => {
    // 팝업/마커가 아닌 빈 영역 클릭 시
    setSelectedStory(null)
    setFormPosition(null)
    setClusterStories(null)

    // 서울 경계 밖 클릭 무시
    if (!isInsideSeoul(e.lngLat.lng, e.lngLat.lat)) return

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setShowAuthPrompt(true)
        return
      }

      setFormPosition({ lng: e.lngLat.lng, lat: e.lngLat.lat })
    } catch {
      setShowAuthPrompt(true)
    }
  }

  const handleMapLoad = (e: { target: mapboxgl.Map }) => {
    const map = e.target
    map.setLanguage("ko")

    // 휠 줌 속도 — 기본(1/450)의 1.5배
    map.scrollZoom.setWheelZoomRate(1 / 300)

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
    {storiesError && (
      <div className="pointer-events-none absolute inset-x-0 top-4 z-50 flex justify-center">
        <p className="rounded-lg bg-black/70 px-4 py-2 text-[12px] text-red-400">
          이야기를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </p>
      </div>
    )}
    <Map
      ref={mapRef}
      {...viewState}
      onMove={(evt) => {
        setViewState(evt.viewState)
        updateBounds()
      }}
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle={DEFAULT_MAP_CONFIG.mapStyle}
      style={{ width: "100%", height: "100%" }}
      maxBounds={SEOUL_BOUNDS}
      maxZoom={14}
      attributionControl={false}
      dragRotate={false}
      pitchWithRotate={false}
      onLoad={(e) => {
        handleMapLoad(e)
        updateBounds()
        setMapLoaded(true)
      }}
      cursor={mapCursor}
      onMouseMove={(e) => {
        setMapCursor(isInsideSeoul(e.lngLat.lng, e.lngLat.lat) ? PIN_CURSOR : "default")
      }}
      onClick={handleMapClick}
    >
      {clusterPoints.map((point) =>
        point.type === "cluster" ? (
          <ClusterMarker
            key={`cluster-${point.id}`}
            cluster={point}
            onClick={handleClusterClick}
          />
        ) : (
          <StoryMarker
            key={point.story.id}
            story={point.story}
            fading={deletingStoryId === point.story.id}
            onClick={(s) => {
              setFormPosition(null)
              setClusterStories(null)
              setSelectedStory(s)
            }}
          />
        )
      )}

      {selectedStory && (
        <StoryPopup
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
          onDelete={() => handleStoryDelete(selectedStory.id)}
          onCreateHere={async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
              setShowAuthPrompt(true)
              return
            }
            const { longitude, latitude } = selectedStory
            setSelectedStory(null)
            setFormPosition({ lng: longitude, lat: latitude })
          }}
          onAuthRequired={() => setShowAuthPrompt(true)}
          onAuthorClick={(authorId, authorName) => {
            setSelectedStory(null)
            setAuthorModal({ id: authorId, name: authorName })
          }}
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
    {clusterStories && (
      <ClusterStoryList
        stories={clusterStories}
        onSelect={(story) => {
          setFormPosition(null)
          setSelectedStory(story)
        }}
        onClose={() => setClusterStories(null)}
      />
    )}
    {authorModal && (
      <AuthorStoriesModal
        authorId={authorModal.id}
        authorName={authorModal.name}
        onClose={() => setAuthorModal(null)}
        onStoryClick={(story) => {
          setAuthorModal(null)
          setFormPosition(null)
          setSelectedStory(story)
          mapRef.current?.flyTo({
            center: [story.longitude, story.latitude],
            zoom: 15,
            duration: 1200,
          })
        }}
      />
    )}
    <SearchBar onSelect={(lng, lat) => {
      mapRef.current?.flyTo({ center: [lng, lat], zoom: 15, duration: 1200 })
    }} />
    <AuthPrompt show={showAuthPrompt} onClose={() => setShowAuthPrompt(false)} />
    <div className="fixed bottom-6 right-4 z-10 flex flex-col items-center gap-2">
      <MyLocationButton onLocate={(lng, lat) => {
        mapRef.current?.flyTo({ center: [lng, lat], zoom: 14, duration: 1200 })
      }} />
      <ZoomIndicator />
    </div>
    </>
  )
}

const ZOOM_MIN = 10
const ZOOM_MAX = 14

function ZoomIndicator() {
  const zoom = useMapStore((s) => s.viewState.zoom ?? 12)
  const current = Math.round(zoom)
  const levels = Array.from({ length: ZOOM_MAX - ZOOM_MIN + 1 }, (_, i) => ZOOM_MAX - i)

  return (
    <div className="flex w-11 flex-col items-center gap-2.5 rounded-xl bg-black/50 py-5 backdrop-blur-sm select-none">
      {levels.map((level) => {
        const isActive = level === current
        return (
          <div
            key={level}
            className={`rounded-full transition-all duration-200 ${
              isActive
                ? "h-0.5 w-5 bg-red-500"
                : "h-px w-3 bg-red-300/30"
            }`}
          />
        )
      })}
    </div>
  )
}

type MyLocationButtonProps = {
  onLocate: (lng: number, lat: number) => void
}

function MyLocationButton({ onLocate }: MyLocationButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "denied" | "outOfBounds">("idle")

  function handleClick() {
    if (!navigator.geolocation) return
    setStatus("loading")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { longitude, latitude } = pos.coords
        const [[minLng, minLat], [maxLng, maxLat]] = SEOUL_BOUNDS
        if (longitude < minLng || longitude > maxLng || latitude < minLat || latitude > maxLat) {
          setStatus("outOfBounds")
          setTimeout(() => setStatus("idle"), 3000)
          return
        }
        setStatus("idle")
        onLocate(longitude, latitude)
      },
      () => {
        setStatus("denied")
        setTimeout(() => setStatus("idle"), 3000)
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  const isError = status === "denied" || status === "outOfBounds"
  const [hovered, setHovered] = useState(false)

  const label =
    status === "denied" ? "위치 권한이 거부되었습니다" :
    status === "outOfBounds" ? "서울 외 지역은 지원하지 않습니다" :
    status === "loading" ? "위치 확인 중..." :
    "내 위치로 이동"

  const showTooltip = hovered || isError

  return (
    <div className="relative">
      {showTooltip && (
        <div className={`absolute right-11 top-1/2 -translate-y-1/2 mr-2 rounded-lg border border-white/10 bg-neutral-900/90 px-3 py-1.5 text-[12px] tracking-wide backdrop-blur-sm whitespace-nowrap ${
          isError ? "text-red-400/80" : "text-white/50"
        }`}>
          {label}
        </div>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "loading"}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border backdrop-blur-sm transition-all disabled:cursor-not-allowed ${
          isError
            ? "border-red-500/40 bg-red-500/20 text-red-400"
            : "border-white/10 bg-neutral-900/80 text-white/60 hover:bg-neutral-800 hover:text-white"
        }`}
      >
        <LocateFixed className={`h-4 w-4 ${status === "loading" ? "animate-pulse" : ""}`} />
      </button>
    </div>
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
