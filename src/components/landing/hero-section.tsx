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
      {/* 하단 페이드 — 다음 섹션과의 부드러운 전환 */}
      <div className="absolute bottom-0 left-0 z-1 h-32 w-full bg-linear-to-b from-transparent to-neutral-950" />

      {/* 텍스트 컨텐츠 */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 font-[family-name:var(--font-pretendard)]">
        <h1 className="animate-fade-in-up font-(family-name:--font-space-grotesk) text-[85px] font-bold tracking-tight text-white" style={{ animationDelay: "1s" }}>
          SonderMaps
        </h1>
        <p className="animate-fade-in-up mt-10 text-lg font-light text-white/85 md:text-xl" style={{ animationDelay: "1.3s" }}>
          모든 장소엔 당신이 모르는 이야기가 있다
        </p>
        <Link
          href="/map"
          className="animate-fade-in-up mt-6 rounded-full bg-neutral-200 px-8 py-3 text-sm font-medium text-neutral-950 transition-colors duration-300 hover:bg-neutral-300 md:text-base"
          style={{ animationDelay: "1.3s" }}
        >
          이야기 발견하기
        </Link>
      </div>

      {/* 스크롤 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-white/80" />
      </div>
    </section>
  )
}
