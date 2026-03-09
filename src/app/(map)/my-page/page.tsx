"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, LogOut, Pencil, Check, X, Trash2 } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/types/profile"
import type { Story, StoryMood } from "@/types/story"

const MOOD_CONFIG: Record<StoryMood, { label: string; emoji: string; color: string }> = {
  happy: { label: "기쁨", emoji: "😊", color: "#f6c944" },
  sad: { label: "슬픔", emoji: "😢", color: "#7ab8e8" },
  nostalgic: { label: "그리움", emoji: "📷", color: "#c4a1e0" },
  longing: { label: "동경", emoji: "💭", color: "#7ae8c8" },
}

export default function MyPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  // 닉네임 편집
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState("")
  const [savingName, setSavingName] = useState(false)

  // 비밀번호 재설정
  const [showPwModal, setShowPwModal] = useState(false)
  const [newPw, setNewPw] = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSuccess, setPwSuccess] = useState(false)

  // 스토리 선택 삭제
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)

  // 로그아웃
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) {
        router.push("/auth")
        return
      }
      setUser(u)

      const { data: p } = await supabase
        .from("profiles")
        .select()
        .eq("id", u.id)
        .single()
      setProfile(p)
      setNameInput(p?.username ?? "")

      const { data: s } = await supabase
        .from("stories")
        .select()
        .eq("author_id", u.id)
        .order("created_at", { ascending: false })
      setStories(s ?? [])

      setLoading(false)
    }
    load()
  }, [])

  // — 핸들러 —

  async function saveName() {
    if (!user || !nameInput.trim()) return
    setSavingName(true)
    await supabase.from("profiles").update({ username: nameInput.trim() }).eq("id", user.id)
    setProfile((prev) => prev ? { ...prev, username: nameInput.trim() } : prev)
    setEditingName(false)
    setSavingName(false)
  }

  async function savePassword() {
    setPwError(null)
    if (newPw.length < 6) { setPwError("비밀번호는 최소 6자 이상이어야 합니다"); return }
    if (newPw !== confirmPw) { setPwError("비밀번호가 일치하지 않습니다"); return }
    setPwSaving(true)
    const { error } = await supabase.auth.updateUser({ password: newPw })
    setPwSaving(false)
    if (error) { setPwError("변경에 실패했습니다. 다시 시도해주세요."); return }
    setPwSuccess(true)
    setTimeout(() => { setShowPwModal(false); setPwSuccess(false); setNewPw(""); setConfirmPw("") }, 1500)
  }

  async function toggleAnonymous() {
    if (!user || !profile) return
    const next = !profile.is_anonymous
    await supabase.from("profiles").update({ is_anonymous: next }).eq("id", user.id)
    setProfile({ ...profile, is_anonymous: next })
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  async function deleteSelected() {
    if (selectedIds.size === 0) return
    setDeleting(true)
    const ids = Array.from(selectedIds)
    await supabase.from("stories").delete().in("id", ids)
    setStories((prev) => prev.filter((s) => !selectedIds.has(s.id)))
    setSelectedIds(new Set())
    setDeleting(false)
  }

  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.refresh()
    router.push("/auth")
  }

  // — 차트 데이터 —
  const moodCounts = stories.reduce<Record<string, number>>((acc, s) => {
    if (s.mood) acc[s.mood] = (acc[s.mood] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(moodCounts).map(([mood, count]) => ({
    name: MOOD_CONFIG[mood as StoryMood].label,
    value: count,
    color: MOOD_CONFIG[mood as StoryMood].color,
  }))

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-neutral-950">
        <p className="text-sm text-white/40">불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="h-dvh overflow-y-auto bg-neutral-950 px-6 py-8">
      <div className="mx-auto max-w-xl space-y-10 animate-fade-in-up" style={{ animationDuration: "0.5s" }}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/map" className="flex items-center gap-1.5 text-[13px] text-white/40 transition-colors hover:text-white/70">
            <ArrowLeft className="h-4 w-4" />
            지도로 돌아가기
          </Link>
          <p className="text-[13px] text-white/30">{user?.email}</p>
        </div>

        {/* 프로필 섹션 */}
        <section className="space-y-4">
          <h2 className="text-[13px] font-medium uppercase tracking-widest text-white/30">프로필</h2>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
            {/* 닉네임 */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-white/50">닉네임</span>
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    maxLength={20}
                    className="w-36 rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-[13px] text-white/80 focus:border-white/30 focus:outline-none"
                    autoFocus
                  />
                  <button type="button" onClick={saveName} disabled={savingName} className="cursor-pointer text-white/50 hover:text-white/80">
                    <Check className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => { setEditingName(false); setNameInput(profile?.username ?? "") }} className="cursor-pointer text-white/50 hover:text-white/80">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-white/80">{profile?.username || "미설정"}</span>
                  <button type="button" onClick={() => setEditingName(true)} className="cursor-pointer text-white/30 hover:text-white/60">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-white/50">비밀번호</span>
              <button
                type="button"
                onClick={() => setShowPwModal(true)}
                className="cursor-pointer text-[13px] text-white/50 underline underline-offset-2 transition-colors hover:text-white/70"
              >
                재설정
              </button>
            </div>

            {/* 가입일 */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-white/50">가입일</span>
              <span className="text-[13px] text-white/50">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString("ko-KR") : "—"}
              </span>
            </div>
          </div>
        </section>

        {/* 내 스토리 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-medium uppercase tracking-widest text-white/30">내 스토리</h2>
            {selectedIds.size > 0 && (
              <button
                type="button"
                disabled={deleting}
                onClick={deleteSelected}
                className="flex cursor-pointer items-center gap-1.5 text-[12px] text-red-400/70 transition-colors hover:text-red-400 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deleting ? "삭제 중..." : `${selectedIds.size}개 삭제`}
              </button>
            )}
          </div>

          {stories.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center">
              <p className="text-[13px] text-white/30">아직 남긴 이야기가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stories.map((story) => {
                const mood = story.mood && MOOD_CONFIG[story.mood]
                return (
                  <label
                    key={story.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                      selectedIds.has(story.id)
                        ? "border-white/20 bg-white/[0.06]"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(story.id)}
                      onChange={() => toggleSelect(story.id)}
                      className="mt-1 accent-white/50"
                    />
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        {mood && <span className="text-sm">{mood.emoji}</span>}
                        {mood && (
                          <span className="text-[11px] tracking-wide" style={{ color: mood.color }}>
                            {mood.label}
                          </span>
                        )}
                        <span className="ml-auto text-[11px] text-white/25">
                          {new Date(story.created_at).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                      <p className="truncate text-[13px] leading-relaxed text-white/60">
                        {story.content}
                      </p>
                    </div>
                  </label>
                )
              })}
            </div>
          )}
        </section>

        {/* 활동 통계 */}
        <section className="space-y-4">
          <h2 className="text-[13px] font-medium uppercase tracking-widest text-white/30">활동 통계</h2>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            {stories.length === 0 ? (
              <p className="py-6 text-center text-[13px] text-white/30">데이터가 없습니다</p>
            ) : (
              <div className="flex items-center gap-6">
                <div className="h-40 w-40 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={65}
                        paddingAngle={3}
                        stroke="none"
                      >
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2.5">
                  {chartData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-[13px] text-white/60">{entry.name}</span>
                      <span className="text-[13px] text-white/30">{entry.value}</span>
                    </div>
                  ))}
                  <p className="mt-2 text-[12px] text-white/25">총 {stories.length}개의 이야기</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 설정 */}
        <section className="space-y-4">
          <h2 className="text-[13px] font-medium uppercase tracking-widest text-white/30">설정</h2>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] text-white/70">익명 모드</p>
                <p className="mt-0.5 text-[12px] text-white/30">켜면 닉네임이 &apos;익명&apos;으로 표시됩니다</p>
              </div>
              <button
                type="button"
                onClick={toggleAnonymous}
                className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${
                  profile?.is_anonymous ? "bg-violet-500/60" : "bg-white/15"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    profile?.is_anonymous ? "translate-x-5.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* 로그아웃 */}
        <section className="pb-10">
          <button
            type="button"
            disabled={loggingOut}
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-[14px] text-red-400/70 transition-colors hover:bg-white/[0.06] hover:text-red-400 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? "로그아웃 중..." : "로그아웃"}
          </button>
        </section>
      </div>

      {/* 비밀번호 재설정 모달 */}
      {showPwModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" style={{ animationDuration: "0.3s" }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => { setShowPwModal(false); setPwError(null); setPwSuccess(false); setNewPw(""); setConfirmPw("") }} />
          <div className="relative w-80 animate-fade-in-up space-y-4 rounded-2xl border border-white/10 bg-neutral-900/95 px-7 py-6 shadow-2xl backdrop-blur-sm" style={{ animationDuration: "0.3s" }}>
            <h3 className="text-[15px] font-medium text-white/80">비밀번호 재설정</h3>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="새 비밀번호"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-white/80 placeholder:text-white/30 focus:border-white/20 focus:outline-none"
            />
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="비밀번호 확인"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-white/80 placeholder:text-white/30 focus:border-white/20 focus:outline-none"
            />
            {pwError && <p className="text-[12px] text-red-400">{pwError}</p>}
            {pwSuccess && <p className="text-[12px] text-green-400">변경되었습니다</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setShowPwModal(false); setPwError(null); setNewPw(""); setConfirmPw("") }}
                className="cursor-pointer rounded-full border border-white/10 px-4 py-1.5 text-[13px] text-white/50 transition-all hover:border-white/20 hover:text-white/70"
              >
                취소
              </button>
              <button
                type="button"
                disabled={pwSaving}
                onClick={savePassword}
                className="cursor-pointer rounded-full bg-white/15 px-4 py-1.5 text-[13px] font-medium text-white/80 transition-all hover:bg-white/25 disabled:opacity-50"
              >
                {pwSaving ? "변경 중..." : "변경"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
