export interface LandingEmotion {
  label: string
  emoji: string
  color: string
}

export interface LandingPin {
  id: string
  coords: [number, number]
  emotion: LandingEmotion
  location: string
  content: string
  resonance: number
  markerLabel: string
}

export const LANDING_EMOTIONS = {
  happy: { label: "기쁨", emoji: "😊", color: "#f6c944" },
  sad: { label: "슬픔", emoji: "😢", color: "#7ab8e8" },
  nostalgic: { label: "그리움", emoji: "📷", color: "#c4a1e0" },
  longing: { label: "동경", emoji: "💭", color: "#7ae8c8" },
} as const

export const LANDING_PINS: LandingPin[] = [
  // — 한강공원 반포지구 —
  {
    id: "pin-a1",
    coords: [126.9307, 37.5245],
    emotion: LANDING_EMOTIONS.happy,
    location: "한강공원 반포지구",
    content:
      "여기서 처음으로 손을 잡았다.\n아무 말도 필요 없었던 밤이었어.",
    resonance: 247,
    markerLabel: "",
  },
  {
    id: "pin-a2",
    coords: [126.9325, 37.5235],
    emotion: LANDING_EMOTIONS.sad,
    location: "한강공원 반포지구",
    content:
      "같은 벤치에 혼자 앉았다.\n옆자리가 이렇게 넓었나.",
    resonance: 162,
    markerLabel: "",
  },

  // — 홍대 걷고싶은거리 —
  {
    id: "pin-b1",
    coords: [126.9236, 37.5493],
    emotion: LANDING_EMOTIONS.nostalgic,
    location: "홍대 걷고싶은거리",
    content:
      "5년 전 매일 걷던 골목.\n그 사람은 이제 여기 없지만 나는 또 왔다.",
    resonance: 183,
    markerLabel: "",
  },
  {
    id: "pin-b2",
    coords: [126.9221, 37.5503],
    emotion: LANDING_EMOTIONS.happy,
    location: "홍대 걷고싶은거리",
    content:
      "처음 버스킹을 본 날.\n모르는 사람들과 같이 박수쳤던 게 아직도 좋다.",
    resonance: 211,
    markerLabel: "",
  },

  // — 을지로 3가 —
  {
    id: "pin-c1",
    coords: [126.9996, 37.5665],
    emotion: LANDING_EMOTIONS.sad,
    location: "을지로 3가",
    content:
      "오래된 골목 끝에서 갑자기 울고 싶어졌다.\n이유는 모르겠다.",
    resonance: 94,
    markerLabel: "",
  },
  {
    id: "pin-c2",
    coords: [127.0012, 37.5655],
    emotion: LANDING_EMOTIONS.longing,
    location: "을지로 3가",
    content:
      "할아버지 공방이 이 근처였는데.\n골목 냄새가 아직 그때 같다.",
    resonance: 78,
    markerLabel: "",
  },

  // — 강남역 사거리 —
  {
    id: "pin-d1",
    coords: [127.0276, 37.4979],
    emotion: LANDING_EMOTIONS.longing,
    location: "강남역 사거리",
    content:
      "수만 명이 지나가는 교차로에서\n아무도 나를 모른다는 게 오히려 편했다.",
    resonance: 126,
    markerLabel: "",
  },
  {
    id: "pin-d2",
    coords: [127.0289, 37.4988],
    emotion: LANDING_EMOTIONS.nostalgic,
    location: "강남역 사거리",
    content:
      "학원 끝나고 친구들이랑 먹던 떡볶이집.\n건물은 바뀌었는데 골목은 그대로다.",
    resonance: 145,
    markerLabel: "",
  },

  // — 광화문 광장 —
  {
    id: "pin-e1",
    coords: [126.977, 37.5759],
    emotion: LANDING_EMOTIONS.nostalgic,
    location: "광화문 광장",
    content:
      "고3 겨울, 시험 끝나고 친구들이랑 여기서 사진 찍었다.\n그때는 몰랐지 그게 마지막인 줄.",
    resonance: 198,
    markerLabel: "",
  },
  {
    id: "pin-e2",
    coords: [126.9782, 37.5768],
    emotion: LANDING_EMOTIONS.longing,
    location: "광화문 광장",
    content:
      "밤에 혼자 걸으면 광장이 이렇게 조용해지는 줄 몰랐다.\n도시 한가운데서 혼자인 느낌.",
    resonance: 87,
    markerLabel: "",
  },

  // — 성수동 카페거리 —
  {
    id: "pin-f1",
    coords: [127.0568, 37.5445],
    emotion: LANDING_EMOTIONS.happy,
    location: "성수동 카페거리",
    content:
      "오랜만에 만난 친구가 여기서 울었다.\n근데 웃으면서 울어서 나도 같이 웃었다.",
    resonance: 134,
    markerLabel: "",
  },
  {
    id: "pin-f2",
    coords: [127.0555, 37.5452],
    emotion: LANDING_EMOTIONS.sad,
    location: "성수동 카페거리",
    content:
      "이 카페에서 이별 통보를 받았다.\n커피가 식을 때까지 아무 말도 못 했다.",
    resonance: 203,
    markerLabel: "",
  },

  // — 여의도 한강공원 —
  {
    id: "pin-g1",
    coords: [126.9218, 37.5284],
    emotion: LANDING_EMOTIONS.happy,
    location: "여의도 한강공원",
    content:
      "벚꽃 날리는 날 자전거 타다가 넘어졌다.\n모르는 아저씨가 웃으면서 일으켜줬다.",
    resonance: 176,
    markerLabel: "",
  },
  {
    id: "pin-g2",
    coords: [126.9205, 37.5291],
    emotion: LANDING_EMOTIONS.longing,
    location: "여의도 한강공원",
    content:
      "퇴근 후 매일 여기서 달렸다.\n숨이 찰 때만 머릿속이 조용해져서.",
    resonance: 112,
    markerLabel: "",
  },
]

export const LANDING_MAP_VIEW = {
  longitude: 126.978,
  latitude: 37.545,
  zoom: 10.8,
} as const

// 서울특별시 영역 제한 (SW, NE)
export const SEOUL_BOUNDS: [[number, number], [number, number]] = [
  [126.75, 37.42],
  [127.19, 37.71],
]

// --- 위치 그룹 (캐러셀 팝업용) ---

export interface LocationGroup {
  location: string
  coords: [number, number]
  pins: LandingPin[]
}

function groupPins(): LocationGroup[] {
  const map = new Map<string, LandingPin[]>()
  for (const pin of LANDING_PINS) {
    const group = map.get(pin.location) ?? []
    group.push(pin)
    map.set(pin.location, group)
  }
  return Array.from(map.entries()).map(([location, pins]) => ({
    location,
    coords: pins[0].coords,
    pins,
  }))
}

export const LANDING_GROUPS = groupPins()
