"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <nav className="animate-fade-in-up fixed top-0 left-0 z-50 flex w-full justify-center px-4 pt-4 transition-all duration-300 md:px-6" style={{ animationDelay: "0.3s" }}>
      <div
        className={`flex w-full max-w-7xl items-center justify-between px-6 py-4 transition-all duration-300 md:px-8 ${
          scrolled
            ? "rounded-2xl bg-white/5 backdrop-blur-[2px]"
            : "bg-transparent"
        }`}
      >
      {/* 로고 */}
      <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2">
        <Image
          src="/images/logo-main.png"
          alt="SonderMaps"
          width={64}
          height={64}
          className="h-16 w-16"
        />
      </Link>

      {/* 중앙 메뉴 */}
      <div className="flex items-center gap-30">
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("explore")
            if (el) {
              el.scrollIntoView({ behavior: "smooth" })
            }
          }}
          className="group relative cursor-pointer text-[17px] tracking-wide text-white/70 transition-colors duration-300 hover:text-white"
        >
          Explore
          <span className="absolute -bottom-1 left-0 h-px w-0 bg-white/60 transition-all duration-300 group-hover:w-full" />
        </button>
        <Link
          href="/about"
          className="group relative text-[17px] tracking-wide text-white/70 transition-colors duration-300 hover:text-white"
        >
          About
          <span className="absolute -bottom-1 left-0 h-px w-0 bg-white/60 transition-all duration-300 group-hover:w-full" />
        </Link>
      </div>

      {/* 우측 CTA */}
      <Link
        href={user ? "/map" : "/auth"}
        className="rounded-full bg-white/20 px-5 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/50"
      >
        {user ? "지도 보기" : "시작하기"}
      </Link>
      </div>
    </nav>
  )
}
