import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// 안전한 내부 경로인지 확인 (Open Redirect 방지)
function getSafeRedirectPath(next: string | null): string {
  if (!next) return "/map"
  if (next.startsWith("/") && !next.startsWith("//")) return next
  return "/map"
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next")

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${getSafeRedirectPath(next)}`)
    }
  }

  // 인증 실패 시 로그인 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/auth`)
}
