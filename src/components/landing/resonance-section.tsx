"use client"

import { useRef, useState, useEffect } from "react"

const QUOTES = [
  {
    emoji: "😊",
    label: "기쁨",
    color: "#f6c944",
    text: "여기서 그녀와 처음으로 손을 잡았다.",
    location: "한강공원 반포지구",
  },
  {
    emoji: "😢",
    label: "슬픔",
    color: "#7ab8e8",
    text: "같은 벤치에 혼자 앉았다. 옆자리가 이렇게 넓었나.",
    location: "한강공원 반포지구",
  },
  {
    emoji: "📷",
    label: "그리움",
    color: "#c4a1e0",
    text: "대학 때 친구들이랑 숨어들던 인쇄소 골목. 간판은 바뀌었는데 계단 삐걱거리는 소리는 그대로다.",
    location: "을지로 3가",
  },
  {
    emoji: "💭",
    label: "동경",
    color: "#7ae8c8",
    text: "할아버지 공방이 이 근처였는데. 골목 냄새가 아직 그때 같다.",
    location: "을지로 3가",
  },
]

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
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-neutral-950 px-6 py-24">
      {/* Ambient glow orbs */}
      <div
        className="pointer-events-none absolute top-1/4 -right-16 h-70 w-70 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(122, 184, 232, 0.08)" }}
      />
      <div
        className="pointer-events-none absolute bottom-1/4 -left-20 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(196, 161, 224, 0.06)" }}
      />

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

        {/* Quote cards */}
        <div
          className={`mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 ${
            visible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDuration: "1.2s", animationDelay: "1.6s" }}
        >
          {QUOTES.map((quote) => (
            <div
              key={quote.text}
              className="flex flex-col rounded-xl border border-white/10 bg-white/3 p-5 text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{quote.emoji}</span>
                <span
                  className="text-[12px] font-medium tracking-wide"
                  style={{ color: quote.color }}
                >
                  {quote.label}
                </span>
              </div>
              <p className="mt-3 font-(family-name:--font-noto-serif) text-[15px] leading-[1.8] tracking-wide text-white/60 italic">
                &ldquo;{quote.text}&rdquo;
              </p>
              <p className="mt-auto pt-3 text-right text-[13px] tracking-wide text-white/30">
                {quote.location}
              </p>
            </div>
          ))}
        </div>

        {/* Body — part 2 (highlighted) */}
        <p
          className={`mt-16 font-(family-name:--font-noto-serif) text-2xl font-light leading-relaxed tracking-wide text-white/90 md:text-4xl ${
            visible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDuration: "1.2s", animationDelay: "2.4s" }}
        >
          <span className="text-violet-400">
            당신의 이야기도
            <br />
            누군가에게 닿을 수 있습니다.
          </span>
        </p>

        {/* Closing line */}
        <p
          className={`mt-8 text-[15px] tracking-wide text-white/50 ${
            visible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDuration: "1.2s", animationDelay: "3.0s" }}
        >
          SonderMaps는 그 닿음을 가능하게 합니다.
        </p>

        {/* Divider */}
        <div
          className={`mx-auto mt-16 h-px w-12 bg-white/20 ${
            visible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDuration: "1.2s", animationDelay: "3.6s" }}
        />
      </div>
    </section>
  )
}
