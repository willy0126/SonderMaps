"use client"

import Image from "next/image"
import Link from "next/link"

export function Navbar() {
  return (
    <nav className="absolute top-0 left-0 z-20 flex w-full items-center justify-between px-6 py-5 md:px-10">
      {/* 로고 */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/images/logo-main.png"
          alt="SonderMaps"
          width={64}
          height={64}
          className="h-16 w-16"
        />
      </Link>

      {/* 우측 메뉴 */}
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          로그인
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-violet-500/80 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
        >
          시작하기
        </Link>
      </div>
    </nav>
  )
}
