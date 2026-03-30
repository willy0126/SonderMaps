"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import { signupSchema, type SignupFormData } from "@/lib/validations/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const AUTH_ERROR_MAP: Record<string, string> = {
  "User already registered": "이미 등록된 이메일입니다",
  "Email not confirmed": "이메일 인증이 필요합니다",
}

// 간단한 이메일 형식 체크
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function SignupForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [sentEmail, setSentEmail] = useState<string | null>(null)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [emailStatus, setEmailStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle")
  const emailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current)
      if (emailTimerRef.current) clearTimeout(emailTimerRef.current)
    }
  }, [])

  // 이메일 입력 시 debounce로 중복 체크
  function handleEmailChange(value: string) {
    if (emailTimerRef.current) clearTimeout(emailTimerRef.current)

    if (!value.trim()) {
      setEmailStatus("idle")
      return
    }
    if (!isValidEmail(value)) {
      setEmailStatus("invalid")
      return
    }

    setEmailStatus("checking")
    emailTimerRef.current = setTimeout(async () => {
      const supabase = createClient()
      const { data, error } = await supabase.rpc("check_email_exists", { email_input: value })
      if (error) {
        setEmailStatus("idle")
        return
      }
      setEmailStatus(data ? "taken" : "available")
    }, 500)
  }

  function startCooldown() {
    setCooldown(60)
    if (cooldownRef.current) clearInterval(cooldownRef.current)
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!)
          cooldownRef.current = null
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const watchPassword = watch("password", "")

  async function onSubmit(data: SignupFormData) {
    setServerError(null)
    const supabase = createClient()

    // 제출 시점에도 이메일 중복 체크 (클라이언트 우회 방어)
    const { data: exists } = await supabase.rpc("check_email_exists", { email_input: data.email })
    if (exists) {
      setServerError("이미 가입된 이메일입니다.")
      setEmailStatus("taken")
      return
    }

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setServerError(
        AUTH_ERROR_MAP[error.message] ??
          "오류가 발생했습니다. 다시 시도해 주세요"
      )
      return
    }

    setSentEmail(data.email)
  }

  if (sentEmail) {
    return (
      <div className="animate-fade-in-up space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl">
          ✉️
        </div>
        <h2 className="text-lg font-medium text-white">
          이메일을 확인해주세요
        </h2>
        <p className="text-sm leading-relaxed text-white/50">
          <span className="text-white/70">{sentEmail}</span>
          으로
          <br />
          인증 링크를 보냈습니다.
        </p>
        <p className="text-xs text-white/30">
          메일이 오지 않았다면 스팸함을 확인해주세요.
        </p>
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            disabled={resending || cooldown > 0}
            onClick={async () => {
              setResending(true)
              setResent(false)
              const supabase = createClient()
              await supabase.auth.resend({
                type: "signup",
                email: sentEmail,
                options: {
                  emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
              })
              setResending(false)
              setResent(true)
              startCooldown()
            }}
            className="text-sm text-white/40 underline underline-offset-2 transition-colors hover:text-white/60 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resending
              ? "전송 중..."
              : cooldown > 0
                ? `재전송 (${cooldown}초)`
                : "인증 이메일 재전송"}
          </button>
          {resent && (
            <p className="text-xs text-green-400">이메일을 다시 보냈습니다.</p>
          )}
          <button
            type="button"
            onClick={() => {
              setSentEmail(null)
              setResent(false)
            }}
            className="text-sm text-white/40 underline underline-offset-2 transition-colors hover:text-white/60"
          >
            다른 이메일로 가입하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-white/70">
          이메일
        </Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="name@example.com"
          className="border-white/10 bg-neutral-900 text-white placeholder:text-white/30"
          {...register("email", {
            onChange: (e) => handleEmailChange(e.target.value),
          })}
        />
        {errors.email ? (
          <p className="text-xs text-red-400">{errors.email.message}</p>
        ) : emailStatus === "checking" ? (
          <p className="text-xs text-white/30">확인 중...</p>
        ) : emailStatus === "invalid" ? (
          <p className="text-xs text-red-400">올바르지 않은 이메일 형식입니다.</p>
        ) : emailStatus === "taken" ? (
          <p className="text-xs text-red-400">이미 가입된 이메일입니다.</p>
        ) : emailStatus === "available" ? (
          <p className="text-xs text-emerald-400">사용 가능한 이메일입니다.</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-white/70">
          비밀번호
        </Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="••••••••"
          className="border-white/10 bg-neutral-900 text-white placeholder:text-white/30"
          {...register("password")}
        />
        {watchPassword.length > 0 && (
          <ul className="space-y-1 pt-1">
            {[
              { test: watchPassword.length >= 8, label: "8자 이상" },
              { test: /[a-z]/.test(watchPassword), label: "소문자 포함" },
              { test: /[0-9]/.test(watchPassword), label: "숫자 포함" },
              { test: /[^a-zA-Z0-9]/.test(watchPassword), label: "특수문자 포함" },
            ].map((rule) => (
              <li key={rule.label} className="flex items-center gap-1.5 text-[11px]">
                <span className={rule.test ? "text-emerald-400" : "text-white/25"}>
                  {rule.test ? "✓" : "○"}
                </span>
                <span className={rule.test ? "text-white/50" : "text-white/25"}>
                  {rule.label}
                </span>
              </li>
            ))}
          </ul>
        )}
        {errors.password && (
          <p className="text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-confirm" className="text-white/70">
          비밀번호 확인
        </Label>
        <Input
          id="signup-confirm"
          type="password"
          placeholder="••••••••"
          className="border-white/10 bg-neutral-900 text-white placeholder:text-white/30"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-400">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="text-center text-sm text-red-400">{serverError}</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || emailStatus === "taken" || emailStatus === "invalid"}
        className="w-full bg-neutral-200 text-neutral-950 hover:bg-neutral-300"
      >
        {isSubmitting ? "가입 중..." : "회원가입"}
      </Button>
    </form>
  )
}
