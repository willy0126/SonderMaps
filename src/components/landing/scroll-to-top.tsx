"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"

export function ScrollToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > window.innerHeight * 0.8)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-6 bottom-14 z-50 cursor-pointer rounded-full border border-white/15 bg-white/5 p-3 text-white/50 backdrop-blur-sm transition-all duration-500 hover:border-white/30 hover:bg-white/10 hover:text-white/80 ${
        show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
      aria-label="맨 위로 스크롤"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  )
}
