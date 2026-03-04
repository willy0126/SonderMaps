"use client"

import { useState } from "react"
import { Map } from "react-map-gl/mapbox"
import { MAPBOX_TOKEN, DEFAULT_MAP_CONFIG } from "@/lib/mapbox/config"
import { LANDING_GROUPS, LANDING_MAP_VIEW, SEOUL_BOUNDS } from "./explore-data"
import { ExploreMarker } from "./explore-marker"
import { ExplorePopup } from "./explore-popup"
import type { LocationGroup } from "./explore-data"
import { SEOUL_MASK, SEOUL_BORDER } from "./seoul-boundary"
import "mapbox-gl/dist/mapbox-gl.css"

export function ExploreMap() {
  const [activeGroup, setActiveGroup] = useState<LocationGroup | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleMarkerClick = (group: LocationGroup) => {
    if (activeGroup?.location === group.location) {
      setActiveGroup(null)
    } else {
      setActiveGroup(group)
      setActiveIndex(0)
    }
  }

  const handlePrev = () => {
    if (!activeGroup) return
    setActiveIndex((prev) =>
      prev === 0 ? activeGroup.pins.length - 1 : prev - 1,
    )
  }

  const handleNext = () => {
    if (!activeGroup) return
    setActiveIndex((prev) =>
      prev === activeGroup.pins.length - 1 ? 0 : prev + 1,
    )
  }

  const handleMapLoad = (e: { target: mapboxgl.Map }) => {
    const map = e.target
    map.setLanguage("ko")

    // 지명/도로명 간소화 — 주요 라벨만 유지
    const hideLayers = [
      "poi-label",            // 상점, 음식점 등 POI
      "transit-label",        // 지하철역, 버스정류장
      "natural-point-label",  // 산, 공원 등 자연지물
      "water-point-label",    // 수역 라벨
      "waterway-label",       // 하천명
      "road-label",           // 도로명
    ]

    for (const id of hideLayers) {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, "visibility", "none")
      }
    }

    // 배경색 — 섹션 배경(neutral-950)과 통일
    map.setPaintProperty("background", "background-color", "#0a0a0a")

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

    // 경계 블러 라인 — 마스크 가장자리를 부드럽게
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
    <Map
      initialViewState={LANDING_MAP_VIEW}
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle={DEFAULT_MAP_CONFIG.mapStyle}
      style={{ width: "100%", height: "100%" }}
      scrollZoom={true}
      doubleClickZoom={false}
      boxZoom={false}
      keyboard={false}
      dragRotate={false}
      pitchWithRotate={false}
      touchZoomRotate={false}
      dragPan={true}
      interactive={true}
      maxBounds={SEOUL_BOUNDS}
      attributionControl={false}
      onLoad={handleMapLoad}
      onClick={() => setActiveGroup(null)}
    >
      {LANDING_GROUPS.map((group, i) => (
        <ExploreMarker
          key={group.location}
          group={group}
          index={i}
          onClick={handleMarkerClick}
        />
      ))}

      {activeGroup && (
        <ExplorePopup
          group={activeGroup}
          activeIndex={activeIndex}
          onPrev={handlePrev}
          onNext={handleNext}
          onClose={() => setActiveGroup(null)}
        />
      )}
    </Map>
  )
}
