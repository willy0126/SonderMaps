"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PASSWORD_RULES, validatePassword } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="animate-fade-in text-center">
          <p className="text-sm text-white/40">인증 확인 중...</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const [expired, setExpired] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const code = searchParams.get("code");

    async function init() {
      if (code) {
        // PKCE code를 SSR 브라우저 클라이언트로 교환 (쿠키의 code_verifier 사용)
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          setReady(true);
          return;
        }
        console.error("Code exchange failed:", error.message);
      }

      // code 없거나 교환 실패 → 기존 세션 확인
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setReady(true);
      } else {
        setExpired(true);
      }
    }

    init();
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const ruleError = validatePassword(newPw);
    if (ruleError) {
      setError(`비밀번호 요구사항을 충족해주세요: ${ruleError}`);
      return;
    }
    if (newPw !== confirmPw) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password: newPw });
    setSaving(false);

    if (updateError) {
      setError("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/auth");
      router.refresh();
    }, 1500);
  }

  if (expired) {
    return (
      <div className="animate-fade-in-up space-y-4 text-center">
        <p className="text-[15px] text-white/60">링크가 만료되었거나 유효하지 않습니다.</p>
        <Button
          onClick={() => router.push("/auth")}
          className="bg-neutral-200 text-neutral-950 hover:bg-neutral-300"
        >
          로그인으로 돌아가기
        </Button>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="animate-fade-in text-center">
        <p className="text-sm text-white/40">인증 확인 중...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="animate-fade-in-up text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white">비밀번호 재설정</h1>
        <p className="mt-2 text-sm text-white/50">새로운 비밀번호를 입력해주세요</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="animate-fade-in-up mt-8 space-y-4"
        style={{ animationDelay: "0.15s" }}
      >
        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-white/70">
            새 비밀번호
          </Label>
          <Input
            id="new-password"
            type="password"
            placeholder="••••••••"
            value={newPw}
            onChange={(e) => {
              setNewPw(e.target.value);
              setError(null);
            }}
            className="border-white/10 bg-neutral-900 text-white placeholder:text-white/30"
          />
          {newPw.length > 0 && (
            <ul className="space-y-1 pt-1">
              {PASSWORD_RULES.map((rule) => {
                const passed = rule.test(newPw);
                return (
                  <li key={rule.label} className="flex items-center gap-1.5 text-[11px]">
                    <span className={passed ? "text-emerald-400" : "text-white/25"}>
                      {passed ? "✓" : "○"}
                    </span>
                    <span className={passed ? "text-white/50" : "text-white/25"}>{rule.label}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-white/70">
            비밀번호 확인
          </Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPw}
            onChange={(e) => {
              setConfirmPw(e.target.value);
              setError(null);
            }}
            className="border-white/10 bg-neutral-900 text-white placeholder:text-white/30"
          />
        </div>

        {error && <p className="text-center text-sm text-red-400">{error}</p>}

        {success ? (
          <p className="text-center text-sm text-green-400">
            비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다.
          </p>
        ) : (
          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-neutral-200 text-neutral-950 hover:bg-neutral-300"
          >
            {saving ? "변경 중..." : "비밀번호 변경"}
          </Button>
        )}
      </form>
    </div>
  );
}
