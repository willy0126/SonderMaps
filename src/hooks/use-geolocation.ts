"use client"

import { useState, useEffect, useSyncExternalStore } from "react"
import type { GeoPoint } from "@/types/map"

interface GeolocationState {
  position: GeoPoint | null
  error: string | null
  loading: boolean
}

const NO_GEOLOCATION: GeolocationState = {
  position: null,
  error: "Geolocation is not supported",
  loading: false,
}

const INITIAL_STATE: GeolocationState = {
  position: null,
  error: null,
  loading: true,
}

export function useGeolocation() {
  const supported = useSyncExternalStore(
    () => () => {},
    () => !!navigator.geolocation,
    () => false
  )

  const [state, setState] = useState<GeolocationState>(
    supported ? INITIAL_STATE : NO_GEOLOCATION
  )

  useEffect(() => {
    if (!supported) return

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          position: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
          error: null,
          loading: false,
        })
      },
      (err) => {
        setState({
          position: null,
          error: err.message,
          loading: false,
        })
      },
      { enableHighAccuracy: true }
    )

    return () => navigator.geolocation.clearWatch(watcher)
  }, [supported])

  return state
}
