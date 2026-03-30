"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import { loginSchema, type LoginFormData } from "@/lib/validations/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const AUTH_ERROR_MAP: Record<string, string> = {
  "Invalid login credentials": "이메일 또는 비밀번호가 올바르지 않습니다",
  "Email not confirmed": "이메일 인증이 필요합니다",
}

export function LoginForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [resetMode, setResetMode] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetStatus, setResetStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [resetError, setResetError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    setServerError(null)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setServerError(
        AUTH_ERROR_MAP[error.message] ??
          "오류가 발생했습니다. 다시 시도해 주세요"
      )
      return
    }

    router.push("/map")
    router.refresh()
  }

  async function handleResetPassword() {
    setResetError(null)
    if (!resetEmail.trim()) {
      setResetError("이메일을 입력해주세요")
      return
    }
    setResetStatus("sending")
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) {
      setResetError("발송에 실패했습니다. 이메일을 확인해주세요.")
      setResetStatus("idle")
      return
    }
    setResetStatus("sent")
  }

  if (resetMode) {
    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-[15px] font-medium text-white/80">비밀번호 찾기</h3>
          <p className="text-[13px] text-white/40">
            가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다.
          </p>
        </div>

        {resetStatus === "sent" ? (
          <div className="space-y-4">
            <p className="text-[13px] text-green-400">
              재설정 링크가 발송되었습니다. 이메일을 확인해주세요.
            </p>
            <Button
              type="button"
              onClick={() => { setResetMode(false); setResetStatus("idle"); setResetEmail("") }}
              className="w-full bg-neutral-200 text-neutral-950 hover:bg-neutral-300"
            >
              로그인으로 돌아가기
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-white/70">이메일</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="name@example.com"
                value={resetEmail}
                onChange={(e) => { setResetEmail(e.target.value); setResetError(null) }}
                className="border-white/10 bg-neutral-900 text-white placeholder:text-white/30"
              />
            </div>
            {resetError && (
              <p className="text-center text-sm text-red-400">{resetError}</p>
            )}
            <Button
              type="button"
              disabled={resetStatus === "sending"}
              onClick={handleResetPassword}
              className="w-full bg-neutral-200 text-neutral-950 hover:bg-neutral-300"
            >
              {resetStatus === "sending" ? "발송 중..." : "재설정 링크 발송"}
            </Button>
            <button
              type="button"
              onClick={() => { setResetMode(false); setResetError(null); setResetEmail("") }}
              className="w-full cursor-pointer text-center text-[13px] text-white/40 transition-colors hover:text-white/60"
            >
              로그인으로 돌아가기
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email" className="text-white/70">
          이메일
        </Label>
        <Input
          id="login-email"
          type="email"
          placeholder="name@example.com"
          className="border-white/10 bg-neutral-900 text-white placeholder:text-white/30"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password" className="text-white/70">
          비밀번호
        </Label>
        <Input
          id="login-password"
          type="password"
          placeholder="••••••••"
          className="border-white/10 bg-neutral-900 text-white placeholder:text-white/30"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      {serverError && (
        <p className="text-center text-sm text-red-400">{serverError}</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-neutral-200 text-neutral-950 hover:bg-neutral-300"
      >
        {isSubmitting ? "로그인 중..." : "로그인"}
      </Button>

      <button
        type="button"
        onClick={() => setResetMode(true)}
        className="w-full cursor-pointer text-center text-[13px] text-white/30 transition-colors hover:text-white/50"
      >
        비밀번호를 잊으셨나요?
      </button>
    </form>
  )
}
