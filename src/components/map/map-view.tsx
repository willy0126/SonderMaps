"use client"

import { Map } from "react-map-gl/mapbox"
import { MAPBOX_TOKEN, DEFAULT_MAP_CONFIG } from "@/lib/mapbox/config"
import { useMapStore } from "@/stores/map-store"
import { SEOUL_BOUNDS } from "@/components/landing/explore-data"
import { SEOUL_MASK, SEOUL_BORDER } from "@/components/landing/seoul-boundary"
import "mapbox-gl/dist/mapbox-gl.css"

export function MapView() {
  const { viewState, setViewState } = useMapStore()

  const handleMapLoad = (e: { target: mapboxgl.Map }) => {
    const map = e.target
    map.setLanguage("ko")

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
  }

  return (
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
    />
  )
}
