"use client"

import { useRef, useState, useEffect } from "react"

export function ResonanceSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -15% 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative flex min-h-dvh items-center justify-center bg-neutral-950 px-6">
      {/* Bottom gradient — bleeds into CTA */}
      <div className="absolute bottom-0 left-0 h-80 w-full bg-linear-to-b from-transparent via-transparent to-[#111113]" />

      <div ref={sectionRef} className="relative max-w-3xl text-center">
        {/* Eyebrow */}
        <p
          className={`font-(family-name:--font-noto-serif) text-[16px] font-extralight uppercase tracking-[0.4em] text-violet-400 ${
            visible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDuration: "1s" }}
        >
          resonance
        </p>

        {/* Body — part 1 */}
        <p
          className={`mt-14 font-(family-name:--font-noto-serif) text-2xl font-light leading-relaxed tracking-wide text-white/90 md:text-4xl ${
            visible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDuration: "1.2s", animationDelay: "0.8s" }}
        >
          혼자인 줄 알았는데,
          <br />
          같은 자리에서 같은 생각을 한
          <br />
          사람이 있었습니다.
        </p>

        {/* Body — part 2 (highlighted) */}
        <p
          className={`mt-10 font-(family-name:--font-noto-serif) text-2xl font-light leading-relaxed tracking-wide text-white/90 md:text-4xl ${
            visible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDuration: "1.2s", animationDelay: "1.6s" }}
        >
          <span className="text-violet-400">
            당신의 이야기도
            <br />
            누군가에게 닿을 수 있습니다.
          </span>
        </p>

        {/* Divider */}
        <div
          className={`mx-auto mt-16 h-px w-12 bg-white/20 ${
            visible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDuration: "1.2s", animationDelay: "2.4s" }}
        />
      </div>
    </section>
  )
}
