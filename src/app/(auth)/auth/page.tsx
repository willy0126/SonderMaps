"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function AuthPage() {
  return (
    <div>
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          시작하기
        </h1>
        <p className="mt-2 text-sm text-white/50">
          계정을 만들거나 로그인하세요
        </p>
      </div>

      <Tabs defaultValue="login" className="mt-8">
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

        {/* Login */}
        <TabsContent value="login" className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email" className="text-white/70">
              이메일
            </Label>
            <Input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              className="border-white/10 bg-neutral-900 text-white placeholder:text-white/30"
            />
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
            />
          </div>
          <Button className="w-full bg-neutral-200 text-neutral-950 hover:bg-neutral-300">
            로그인
          </Button>
        </TabsContent>

        {/* Signup */}
        <TabsContent value="signup" className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-white/70">
              이메일
            </Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="name@example.com"
              className="border-white/10 bg-neutral-900 text-white placeholder:text-white/30"
            />
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
            />
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
            />
          </div>
          <Button className="w-full bg-neutral-200 text-neutral-950 hover:bg-neutral-300">
            회원가입
          </Button>
        </TabsContent>
      </Tabs>

      <p className="mt-6 text-center text-[12px] text-white/30">
        계속 진행하면{" "}
        <span className="text-white/50 underline underline-offset-2">이용약관</span>
        {" "}및{" "}
        <span className="text-white/50 underline underline-offset-2">개인정보처리방침</span>
        에 동의하는 것으로 간주됩니다.
      </p>
    </div>
  )
}
