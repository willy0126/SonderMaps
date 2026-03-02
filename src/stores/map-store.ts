import { create } from "zustand"
import { DEFAULT_MAP_CONFIG } from "@/lib/mapbox/config"

interface ViewState {
  longitude: number
  latitude: number
  zoom: number
  pitch?: number
  bearing?: number
}

interface MapStore {
  viewState: ViewState
  setViewState: (viewState: ViewState) => void
  selectedMarkerId: string | null
  setSelectedMarkerId: (id: string | null) => void
}

export const useMapStore = create<MapStore>((set) => ({
  viewState: DEFAULT_MAP_CONFIG.initialViewState,
  setViewState: (viewState) => set({ viewState }),
  selectedMarkerId: null,
  setSelectedMarkerId: (id) => set({ selectedMarkerId: id }),
}))
