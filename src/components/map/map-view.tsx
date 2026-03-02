"use client"

import { Map } from "react-map-gl/mapbox"
import { MAPBOX_TOKEN, DEFAULT_MAP_CONFIG } from "@/lib/mapbox/config"
import { useMapStore } from "@/stores/map-store"
import "mapbox-gl/dist/mapbox-gl.css"

export function MapView() {
  const { viewState, setViewState } = useMapStore()

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle={DEFAULT_MAP_CONFIG.mapStyle}
      style={{ width: "100%", height: "100%" }}
    />
  )
}
