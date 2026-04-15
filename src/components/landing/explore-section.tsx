"use client"

import { useRef, useState, useEffect } from "react"
import dynamic from "next/dynamic"

const ExploreMap = dynamic(
  () => import("./explore-map").then((mod) => ({ default: mod.ExploreMap })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-neutral-900">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
      </div>
    ),
  }
)

export function ExploreSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    // 지도를 먼저 마운트하기 위해 더 넓은 rootMargin 사용
    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMapReady(true)
          preloadObserver.disconnect()
        }
      },
      { rootMargin: "0px 0px 200px 0px" }
    )

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -15% 0px" }
    )

    preloadObserver.observe(el)
    observer.observe(el)
    return () => {
      preloadObserver.disconnect()
      observer.disconnect()
    }
  }, [])

  return (
    <section id="explore" className="scroll-mt-24 flex min-h-dvh flex-col items-center justify-center bg-neutral-950 px-6 py-24">
      <div ref={sectionRef} className="w-full max-w-4xl">
        {/* Eyebrow */}
        <p
          className={`text-center font-(family-name:--font-noto-serif) text-l font-extralight uppercase tracking-[0.4em] text-violet-400 ${
            visible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDuration: "1s"}}
        >
          explore
        </p>

        {/* Title */}
        <h2
          className={`mt-6 text-center font-(family-name:--font-noto-serif) text-2xl font-extralight leading-relaxed tracking-wide text-white/90 md:text-4xl ${
            visible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDuration: "1.2s", animationDelay: "0.8s" }}
        >
          같은 장소, <span className="text-violet-400">다른 감정</span>.
          <br />
          지도 위의 핀을 클릭해보세요
        </h2>

        {/* Map container */}
        <div
          className={`relative mt-14 aspect-4/3 w-full overflow-hidden rounded-2xl border border-[#1e1e1e] shadow-[0_40px_80px_rgba(0,0,0,0.6)] ${
            visible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDuration: "1.2s", animationDelay: "1.6s" }}
        >
          {mapReady && <ExploreMap />}

          {/* Hint overlay */}
          <div className="pointer-events-none absolute bottom-0 right-0 px-4 py-3 text-right">
            <p className="text-[12px] tracking-[0.15em] text-white/60">
              ● 마커를 클릭하면 이야기가 열려요
            </p>
            <p className="mt-0.5 text-[10px] tracking-[0.1em] text-white/40">
              사이트 이해를 돕기 위한 예시입니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
