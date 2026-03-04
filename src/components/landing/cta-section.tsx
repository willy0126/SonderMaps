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
    <section className="relative flex min-h-dvh flex-col items-center justify-center bg-linear-to-b from-[#111113] to-[#141418] px-6">
      <div ref={sectionRef} className="max-w-3xl text-center">
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
          <span>이용약관</span>
          <span className="text-white/50">·</span>
          <span>개인정보처리방침</span>
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
