"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function MapSidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`fixed left-0 top-0 z-20 h-dvh ${collapsed ? "pointer-events-none" : ""}`}>
      {/* 사이드바 패널 */}
      <div
        className={`flex h-full w-64 flex-col border-r border-white/6 bg-neutral-950/90 backdrop-blur-md transition-transform duration-300 ease-in-out ${
          collapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {/* 헤더 — 로고 */}
        <div className="flex h-14 shrink-0 items-center gap-3 px-4 border-b border-white/6">
          <Link
            href="/"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
          >
            <Image
              src="/images/logo-main.png"
              alt="SonderMaps"
              width={20}
              height={20}
              className="h-5 w-5"
            />
          </Link>
          <span className="text-[13px] font-medium tracking-wide text-white/50">
            SonderMaps
          </span>
        </div>

        {/* 콘텐츠 영역 — 추후 채울 것 */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <p className="text-[12px] text-white/20">콘텐츠 영역</p>
        </div>
      </div>

      {/* Collapse 토글 탭 */}
      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        className={`pointer-events-auto absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out ${
          collapsed ? "left-0" : "left-64"
        } flex h-16 w-6 items-center justify-center rounded-r-lg border border-l-0 border-white/15 bg-neutral-700 text-white/70 shadow-lg hover:bg-neutral-600 hover:text-white`}
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  )
}
