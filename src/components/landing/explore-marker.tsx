"use client"

import { Marker } from "react-map-gl/mapbox"
import type { LocationGroup } from "./explore-data"

interface ExploreMarkerProps {
  group: LocationGroup
  onClick: (group: LocationGroup) => void
  index: number
}

export function ExploreMarker({ group, onClick, index }: ExploreMarkerProps) {
  const { coords, pins } = group
  const [lng, lat] = coords

  return (
    <Marker
      longitude={lng}
      latitude={lat}
      anchor="center"
      onClick={(e) => {
        e.originalEvent.stopPropagation()
        onClick(group)
      }}
    >
      <div className="group relative flex cursor-pointer flex-col items-center">
        {/* Pulse rings — one per emotion, staggered */}
        <div className="relative flex h-9 w-9 items-center justify-center">
          {pins.map((pin, i) => (
            <span
              key={pin.id}
              className="animate-marker-pulse absolute h-9 w-9 rounded-full"
              style={{
                backgroundColor: pin.emotion.color,
                animationDelay: `${index * 0.6 + i * 1.2}s`,
              }}
            />
          ))}
          <span
            className="relative z-10 h-3.5 w-3.5 rounded-full border-2 border-[#0a0a0a] transition-transform duration-200 group-hover:scale-[1.3]"
            style={{ backgroundColor: pins[0].emotion.color }}
          />
        </div>

        {/* Count badge */}
        {pins.length > 1 && (
          <span className="pointer-events-none absolute -right-1 -top-1 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-[9px] font-medium text-white/60 backdrop-blur-sm">
            {pins.length}
          </span>
        )}
      </div>
    </Marker>
  )
}
