"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"

export default function AuthPage() {
  return (
    <div>
      <div className="animate-fade-in-up text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          시작하기
        </h1>
        <p className="mt-2 text-sm text-white/50">
          계정을 만들거나 로그인하세요
        </p>
      </div>

      <Tabs defaultValue="login" className="animate-fade-in-up mt-8" style={{ animationDelay: "0.15s" }}>
        <TabsList className="grid w-full grid-cols-2 bg-neutral-900">
          <TabsTrigger
            value="login"
            className="text-white/60 data-[state=active]:bg-neutral-800 data-[state=active]:text-white"
          >
            로그인
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="text-white/60 data-[state=active]:bg-neutral-800 data-[state=active]:text-white"
          >
            회원가입
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="mt-6">
          <LoginForm />
        </TabsContent>

        <TabsContent value="signup" className="mt-6">
          <SignupForm />
        </TabsContent>
      </Tabs>

      <p className="animate-fade-in-up mt-6 text-center text-[12px] text-white/30" style={{ animationDelay: "0.3s" }}>
        계속 진행하면{" "}
        <a
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 underline underline-offset-2 transition-colors hover:text-white/70"
        >
          이용약관
        </a>
        {" "}및{" "}
        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 underline underline-offset-2 transition-colors hover:text-white/70"
        >
          개인정보처리방침
        </a>
        에 동의하는 것으로 간주됩니다.
      </p>
    </div>
  )
}
