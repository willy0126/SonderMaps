export interface MapViewState {
  longitude: number
  latitude: number
  zoom: number
  pitch?: number
  bearing?: number
}

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface GeoPoint {
  latitude: number
  longitude: number
}
