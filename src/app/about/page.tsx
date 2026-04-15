"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Github } from "lucide-react";

function useReveal(): [React.RefCallback<HTMLDivElement>, boolean] {
  const [visible, setVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref: React.RefCallback<HTMLDivElement> = (el) => {
    if (!el) return;
    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    observerRef.current = observer;
  };

  return [ref, visible];
}

const TECH_STACK = [
  {
    category: "Frontend",
    items: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "shadcn/ui", "Mapbox GL JS"],
  },
  {
    category: "State",
    items: ["Zustand", "TanStack Query"],
  },
  {
    category: "Backend",
    items: ["Supabase Auth", "Supabase + PostGIS", "Supabase Realtime", "Supabase RLS"],
  },
  {
    category: "Infra",
    items: ["Vercel", "Sentry", "Vitest"],
  },
];

const FEATURES = [
  {
    title: "익명 위치 기반 스토리텔링",
    description:
      "지도 위 실제 장소에 자신의 이야기를 익명으로 남기고, 같은 공간에서 다른 사람들이 남긴 이야기를 발견합니다.",
  },
  {
    title: "감정 기반 마커 시스템",
    description:
      "기쁨, 슬픔, 그리움, 동경 — 네 가지 감정으로 이야기를 분류하고, 지도 위에서 감정의 지형도를 탐색합니다.",
  },
  {
    title: "실시간 공간 쿼리",
    description:
      "PostGIS 기반 공간 인덱싱으로 현재 지도 뷰포트 내의 이야기만 효율적으로 로드합니다.",
  },
  {
    title: "서울 경계 마스킹",
    description:
      "서울특별시 행정경계를 활용한 지도 마스킹으로, 서비스 영역을 직관적으로 표현합니다. 필요시 변경 가능하도록 설계되었습니다.",
  },
];

export default function AboutPage() {
  const [heroRef, heroVisible] = useReveal();
  const [motivationRef, motivationVisible] = useReveal();
  const [techRef, techVisible] = useReveal();
  const [featuresRef, featuresVisible] = useReveal();
  const [developerRef, developerVisible] = useReveal();

  return (
    <main className="noise-overlay min-h-dvh bg-neutral-950">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute top-[20%] -left-20 h-80 w-80 rounded-full bg-violet-500/8 blur-3xl" />
      <div
        className="pointer-events-none absolute top-[60%] -right-16 h-70 w-70 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(122, 232, 200, 0.04)" }}
      />

      {/* Back link */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/"
          className="text-[13px] tracking-wide text-white/60 transition-colors duration-500 hover:text-white/90"
        >
          &larr; Home
        </Link>
      </div>

      {/* Hero */}
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-6">
        <div ref={heroRef} className="max-w-3xl text-center">
          <p
            className={`font-(family-name:--font-noto-serif) text-[16px] font-extralight uppercase tracking-[0.4em] text-violet-400 ${
              heroVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDuration: "1s" }}
          >
            About
          </p>
          <h1
            className={`mt-5 font-(family-name:--font-noto-serif) text-3xl font-light leading-relaxed tracking-wide text-white/90 md:text-6xl ${
              heroVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDuration: "1.2s", animationDelay: "0.4s" }}
          >
            SonderMaps
          </h1>
          <p
            className={`mt-6 text-[15px] leading-relaxed tracking-wide text-white/50 ${
              heroVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDuration: "1.2s", animationDelay: "0.8s" }}
          >
            타인의 삶을 스쳐가는 지도 — 익명 위치 기반 스토리텔링 플랫폼
          </p>
        </div>
      </section>

      {/* Motivation */}
      <section className="flex justify-center px-6 py-24">
        <div ref={motivationRef} className="max-w-2xl">
          <h2
            className={`font-(family-name:--font-noto-serif) text-xl font-light tracking-wide text-white/90 md:text-2xl ${
              motivationVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDuration: "1s" }}
          >
            만들게 된 <span className="text-violet-400">계기</span>
          </h2>

          <div
            className={`mt-10 space-y-6 text-[15px] leading-[1.9] tracking-wide text-white/60 ${
              motivationVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDuration: "1.2s", animationDelay: "0.6s" }}
          >
            <blockquote className="rounded-xl border-l-2 border-violet-400/40 bg-white/3 px-6 py-5">
              <p className="font-(family-name:--font-noto-serif) text-[17px] leading-[1.9] tracking-wide text-white/85">
                <span className="text-violet-400 font-medium">Sonder</span> — 스쳐 지나가는 모든
                사람에게도 나만큼 <span className="text-violet-400">복잡하고 아름다운</span> 삶이
                있다는 것을 문득 깨닫는 순간.
              </p>
            </blockquote>
            <p>
              같은 카페에서 누군가는 합격 소식을 들었고, 누군가는 이별을 결심했을 수 있습니다. 같은
              공간이지만 모두가 같은 순간을 사는 것은 아닙니다.
            </p>
            <p>
              SonderMaps는 이런 생각에서 출발했습니다. 장소에 얽힌 개인의 이야기를 익명으로 남기고,
              같은 자리에서 다른 누군가의 이야기를 발견할 수 있는 지도. 혼자인 줄 알았던 감정이
              사실은 누군가와 닿아 있었음을 느끼게 해주는 경험을 만들고 싶었습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="flex justify-center px-6 py-24">
        <div ref={techRef} className="w-full max-w-3xl">
          <h2
            className={`text-center font-(family-name:--font-noto-serif) text-xl font-light tracking-wide text-white/90 md:text-2xl ${
              techVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDuration: "1s" }}
          >
            기술 <span className="text-violet-400">스택</span>
          </h2>

          <div
            className={`mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 ${
              techVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDuration: "1.2s", animationDelay: "0.6s" }}
          >
            {TECH_STACK.map((group) => (
              <div
                key={group.category}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-violet-400">
                  {group.category}
                </p>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="text-[14px] tracking-wide text-white/60">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="flex justify-center px-6 py-24">
        <div ref={featuresRef} className="w-full max-w-3xl">
          <h2
            className={`text-center font-(family-name:--font-noto-serif) text-xl font-light tracking-wide text-white/90 md:text-2xl ${
              featuresVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDuration: "1s" }}
          >
            주요 <span className="text-violet-400">기능</span>
          </h2>

          <div
            className={`mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 ${
              featuresVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDuration: "1.2s", animationDelay: "0.6s" }}
          >
            {FEATURES.map((feature) => (
              <div key={feature.title} className="space-y-3">
                <h3 className="text-[15px] font-medium tracking-wide text-white/85">
                  {feature.title}
                </h3>
                <p className="text-[13px] leading-[1.8] tracking-wide text-white/45">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer */}
      <section className="flex justify-center px-6 py-24 pb-32">
        <div ref={developerRef} className="max-w-2xl text-center">
          <h2
            className={`font-(family-name:--font-noto-serif) text-xl font-light tracking-wide text-white/90 md:text-2xl ${
              developerVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDuration: "1s" }}
          >
            개발자
          </h2>

          <div
            className={`mt-10 ${developerVisible ? "animate-fade-in-up" : "opacity-0"}`}
            style={{ animationDuration: "1.2s", animationDelay: "0.6s" }}
          >
            <p className="text-[18px] font-medium tracking-wide text-white/90">
              박지원 | Jiwon Park
            </p>
            <p className="mt-3 text-[14px] leading-[1.8] tracking-wide text-white/40">
              사용자의 경험과 보이지 않는 디테일을 소중히 여기는 프론트엔드 개발자입니다.
              <br></br>
              <br></br>
              일상의 사소한 부분에서 영감을 받아, 기술로 구현하는 것을 즐깁니다. <b>SonderMaps</b>는
              그런 영감에서
              <br></br>
              출발한 프로젝트로, 개인의 이야기가 모여 공감과 연결을 만들어내는 경험을 목표로
              개발했습니다.
            </p>
            <div className="mt-6 flex justify-center">
              <a
                href="https://github.com/willy0126"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 p-3 text-white/40 transition-all duration-300 hover:border-white/40 hover:text-white/80"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Divider */}
          <div
            className={`mx-auto mt-20 h-px w-12 bg-white/15 ${
              developerVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDuration: "1.2s", animationDelay: "1.2s" }}
          />

          <p className="mt-8 text-[11px] tracking-wide text-white/25">&copy; 2026 SonderMaps</p>
        </div>
      </section>
    </main>
  );
}
