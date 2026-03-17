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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
    </form>
  )
}
