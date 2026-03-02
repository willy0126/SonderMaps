"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/images/logo-main.png"
          alt="SonderMaps"
          width={64}
          height={64}
          className="h-16 w-16"
        />
      </Link>

      {/* 우측 메뉴 */}
      <div className="flex items-center gap-6">
        <Link
          href="/login"
          className="text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          로그인
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/15"
        >
          시작하기
        </Link>
      </div>
      </div>
    </nav>
  )
}
