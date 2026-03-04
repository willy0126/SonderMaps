"use client"

import { useRef, useState, useEffect } from "react"

export function SonderSection() {
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
    <section className="flex min-h-dvh items-center justify-center bg-neutral-950 px-6">
      <div ref={sectionRef} className="max-w-3xl text-center">
        <p
          className={`font-(family-name:--font-noto-serif) text-l font-normal uppercase tracking-[0.4em] text-violet-400 ${
            visible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDuration: "1s" }}
        >
          Sonder
        </p>
        <blockquote
          className={`mt-14 font-(family-name:--font-noto-serif) text-2xl font-light leading-snug tracking-wide text-white/90 md:text-4xl ${
            visible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDuration: "1.2s", animationDelay: "0.8s", animationTimingFunction: "ease" }}
        >
          스쳐 지나가는 모든 사람에게도
          <br />
          <span className="text-violet-400">당신만큼 복잡하고 아름다운</span>
          <br />
          삶이 있다는 것을
          <br />
          문득 깨닫는 순간
        </blockquote>
        <p
          className={`mt-20 text-right font-(family-name:--font-noto-serif) text-[12px] italic tracking-wide text-white/40 ${
            visible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDuration: "1.2s", animationDelay: "1.6s", animationTimingFunction: "ease" }}
        >
          — The Dictionary of Obscure Sorrows, John Koenig
        </p>
      </div>
    </section>
  )
}
