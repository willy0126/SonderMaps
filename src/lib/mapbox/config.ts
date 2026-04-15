export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

export const DEFAULT_MAP_CONFIG = {
  initialViewState: {
    longitude: 126.978,
    latitude: 37.5665,
    zoom: 12,
  },
  mapStyle: "mapbox://styles/mapbox/dark-v11",
} as const
