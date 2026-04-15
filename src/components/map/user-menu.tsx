"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { User as UserIcon, LogOut, LogIn } from "lucide-react"
import type { User } from "@supabase/supabase-js"

export function UserMenu() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth")
    router.refresh()
  }

  return (
    <div className="absolute top-4 right-4 z-10">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-neutral-900/80 text-white/70 backdrop-blur-sm transition-colors hover:bg-neutral-800 hover:text-white"
        aria-label="사용자 메뉴"
      >
        <UserIcon className="h-4.5 w-4.5" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-11 right-0 z-20 min-w-[140px] overflow-hidden rounded-lg border border-white/10 bg-neutral-900/90 p-1 shadow-lg backdrop-blur-sm">
            {user ? (
              <>
                <Link
                  href="/my-page"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <UserIcon className="h-3.5 w-3.5" />
                  마이페이지
                </Link>
                <button
                  type="button"
                  disabled={loggingOut}
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400/70 transition-colors hover:bg-white/10 hover:text-red-400 disabled:opacity-50"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {loggingOut ? "로그아웃 중..." : "로그아웃"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => router.push("/auth")}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <LogIn className="h-3.5 w-3.5" />
                로그인
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
