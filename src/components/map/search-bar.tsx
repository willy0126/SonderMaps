"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { MAPBOX_TOKEN } from "@/lib/mapbox/config";

interface SearchResult {
  id: string;
  place_name: string;
  center: [number, number];
}

interface SearchBarProps {
  onSelect: (lng: number, lat: number) => void;
}

const SEOUL_BBOX = "126.55,37.28,127.39,37.85";
const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

async function fetchKakaoResults(query: string): Promise<SearchResult[]> {
  if (!KAKAO_KEY) return [];
  const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&rect=126.55,37.28,127.39,37.85&size=5`;
  const res = await fetch(url, { headers: { Authorization: `KakaoAK ${KAKAO_KEY}` } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.documents ?? []).map(
    (d: {
      id: string;
      place_name: string;
      road_address_name: string;
      address_name: string;
      x: string;
      y: string;
    }) => ({
      id: `kakao-${d.id}`,
      place_name: d.road_address_name
        ? `${d.place_name} · ${d.road_address_name}`
        : `${d.place_name} · ${d.address_name}`,
      center: [parseFloat(d.x), parseFloat(d.y)] as [number, number],
    })
  );
}

async function fetchMapboxResults(query: string): Promise<SearchResult[]> {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&bbox=${SEOUL_BBOX}&language=ko&limit=5&types=poi,address,neighborhood,locality`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.features ?? []).map(
    (f: { id: string; place_name: string; center: [number, number] }) => ({
      id: f.id,
      place_name: f.place_name,
      center: f.center,
    })
  );
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        const [kakao, mapbox] = await Promise.allSettled([
          fetchKakaoResults(query),
          fetchMapboxResults(query),
        ]);

        const kakaoItems = kakao.status === "fulfilled" ? kakao.value : [];
        const mapboxItems = mapbox.status === "fulfilled" ? mapbox.value : [];

        // 카카오 결과 우선, 중복 좌표 제거 후 최대 6개
        const seen = new Set<string>();
        const merged: SearchResult[] = [];
        for (const item of [...kakaoItems, ...mapboxItems]) {
          const key = `${item.center[0].toFixed(4)},${item.center[1].toFixed(4)}`;
          if (!seen.has(key)) {
            seen.add(key);
            merged.push(item);
          }
          if (merged.length >= 6) break;
        }

        setResults(merged);
        setOpen(true);
      } catch {
        // 네트워크 오류 시 검색 결과 미표시
      }
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(result: SearchResult) {
    onSelect(result.center[0], result.center[1]);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="absolute top-4 left-1/2 z-10 w-72 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/80 px-4 py-2 backdrop-blur-sm">
        <Search className="h-4 w-4 shrink-0 text-white/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            if (!val.trim()) {
              setResults([]);
              setOpen(false);
            }
          }}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="장소 검색..."
          className="w-full bg-transparent text-[13px] text-white/80 placeholder:text-white/30 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
            className="cursor-pointer text-white/30 hover:text-white/50"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="mt-1.5 overflow-hidden rounded-xl border border-white/10 bg-neutral-900/95 py-1 shadow-lg backdrop-blur-sm">
          {results.map((result) => (
            <li key={result.id}>
              <button
                type="button"
                onClick={() => handleSelect(result)}
                className="w-full cursor-pointer px-4 py-2.5 text-left text-[13px] leading-snug text-white/60 transition-colors hover:bg-white/5 hover:text-white/80"
              >
                {result.place_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
