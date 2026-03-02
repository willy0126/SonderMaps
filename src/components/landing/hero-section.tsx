"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative h-dvh w-full overflow-hidden bg-neutral-950">
      {/* 배경 동영상 */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

      {/* 텍스트 컨텐츠 */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 font-[family-name:var(--font-pretendard)]">
        <h1 className="font-(family-name:--font-space-grotesk) text-[80px] font-bold tracking-tight text-white">
          SonderMaps
        </h1>
        <p className="mt-4 text-lg font-light text-white/85 md:text-xl">
          모든 장소엔 당신이 모르는 이야기가 있다.
        </p>
        <Link
          href="/map"
          className="mt-10 rounded-full bg-violet-500/80 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-500 md:text-base"
        >
          이야기 발견하기
        </Link>
      </div>

      {/* 스크롤 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-white/50" />
      </div>
    </section>
  )
}
