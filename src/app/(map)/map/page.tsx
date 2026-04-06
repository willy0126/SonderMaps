import { MapView } from "@/components/map/map-view"
import { MapSidebar } from "@/components/map/map-sidebar"
import { UserMenu } from "@/components/map/user-menu"

export default function MapPage() {
  return (
    <>
      <MapView />
      <MapSidebar />
      <UserMenu />
    </>
  )
}
