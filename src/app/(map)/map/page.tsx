import Link from "next/link"
import Image from "next/image"
import { MapView } from "@/components/map/map-view"
import { UserMenu } from "@/components/map/user-menu"

export default function MapPage() {
  return (
    <>
      <MapView />
      <Link
        href="/"
        className="absolute top-4 left-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900/80 backdrop-blur-sm transition-colors hover:bg-neutral-800"
      >
        <Image
          src="/images/logo-main.png"
          alt="SonderMaps"
          width={24}
          height={24}
          className="h-6 w-6"
        />
      </Link>
      <UserMenu />
    </>
  )
}
