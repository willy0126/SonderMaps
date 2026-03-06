"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"

export function CtaSection() {
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
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-linear-to-b from-[#111113] to-[#141418] px-6">
      {/* Ambient glow orbs */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 h-100 w-100 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 -left-12 h-50 w-50 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(246, 201, 68, 0.05)" }}
      />

      <div ref={sectionRef} className="relative max-w-3xl text-center">
        {/* Copy */}
        <p
          className={`font-(family-name:--font-noto-serif) text-2xl font-light leading-relaxed tracking-wide text-white/90 md:text-4xl ${
            visible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDuration: "1.2s" }}
        >
          지금, 당신의 장소에
          <br />
          이야기를 남겨보세요
        </p>

        {/* CTA Button */}
        <Link
          href="/auth"
          className={`mt-12 inline-block rounded-full bg-neutral-200 px-8 py-3 text-sm font-medium text-neutral-950 transition-colors duration-300 hover:bg-neutral-300 md:text-base ${
            visible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDuration: "1s", animationDelay: "0.8s" }}
        >
          시작하기
        </Link>
      </div>

      {/* Footer */}
      <footer
        className={`absolute bottom-8 flex flex-col items-center gap-3 ${
          visible ? "animate-fade-in-up" : "opacity-0"
        }`}
        style={{ animationDuration: "1s", animationDelay: "1.4s" }}
      >
        <div className="flex gap-4 text-[12px] tracking-wide text-white/50">
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white/70"
          >
            이용약관
          </a>
          <span className="text-white/50">·</span>
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white/70"
          >
            개인정보처리방침
          </a>
        </div>
        <p className="text-[11px] tracking-wide text-white/25">
          © 2026 SonderMaps · Built by{" "}
          <a
            href="https://github.com/willy0126"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 transition-colors duration-1000 hover:text-white/100"
          >
            Jiwon Park
          </a>
        </p>
      </footer>

      {/* Demo disclaimer */}
      <p className="absolute bottom-8 right-8 text-[10px] tracking-wide text-white/20">
        이 사이트의 일부 콘텐츠는 데모 목적으로 구성되었습니다.
      </p>
    </section>
  )
}
