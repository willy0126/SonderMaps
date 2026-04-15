import type { ReactNode } from "react"

export default function MapLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-dvh w-full overflow-hidden">{children}</div>
  )
}
