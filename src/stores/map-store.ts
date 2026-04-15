import { create } from "zustand"
import { DEFAULT_MAP_CONFIG } from "@/lib/mapbox/config"
import type { StoryMood, Story } from "@/types/story"

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
  activeMoods: Set<StoryMood>
  toggleMood: (mood: StoryMood) => void
  clearMoods: () => void
  pendingFlyTo: Story | null
  setPendingFlyTo: (story: Story | null) => void
}

export const useMapStore = create<MapStore>((set) => ({
  viewState: DEFAULT_MAP_CONFIG.initialViewState,
  setViewState: (viewState) => set({ viewState }),
  selectedMarkerId: null,
  setSelectedMarkerId: (id) => set({ selectedMarkerId: id }),
  activeMoods: new Set(),
  toggleMood: (mood) =>
    set((state) => {
      const next = new Set(state.activeMoods)
      if (next.has(mood)) next.delete(mood)
      else next.add(mood)
      return { activeMoods: next }
    }),
  clearMoods: () => set({ activeMoods: new Set() }),
  pendingFlyTo: null,
  setPendingFlyTo: (story) => set({ pendingFlyTo: story }),
}))
