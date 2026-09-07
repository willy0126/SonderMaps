# SonderMaps 🌍

> **타인의 삶을 스쳐가는 지도**
>
> 실제 장소에 얽힌 감정과 이야기를 익명으로 남기고 발견하는 위치 기반 스토리텔링 플랫폼입니다.

SonderMaps는 같은 공간을 지나간 서로 다른 사람들의 이야기를 지도 위에서 연결합니다. 사용자는 서울 지도에서 주변 이야기를 탐색하고, 감정을 선택해 자신의 이야기를 남기며, 다른 사용자의 이야기에 공명할 수 있습니다.

## 주요 기능

- **익명 위치 기반 스토리**
  - 지도 위 원하는 위치에 감정과 함께 이야기를 작성
  - 로그인하지 않아도 지도와 공개 스토리를 탐색 가능
  - 스토리 작성, 공명, 마이페이지는 인증 사용자에게 제공

- **지도 탐색**
  - Mapbox 기반 서울 지도 및 서울 경계 마스킹
  - 현재 지도 중심과 줌 레벨을 기준으로 주변 스토리 조회
  - 감정별 필터, 현재 위치 이동, 줌 인디케이터 제공

- **스토리 발견**
  - 지도 마커 클러스터링
  - 동일 좌표의 여러 스토리 목록 확인
  - 작성자별 스토리 모아보기
  - Mapbox·Kakao Local API 기반 장소 검색

- **사용자 기능**
  - 이메일 회원가입·로그인·로그아웃
  - 비밀번호 재설정
  - 닉네임 및 익명 공개 설정
  - 내 스토리 조회·선택 삭제
  - 스토리에 대한 공명 추가·취소

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| Framework | Next.js 16, React 19, TypeScript |
| Styling/UI | Tailwind CSS v4, shadcn/ui, Radix UI, Lucide |
| Map | Mapbox GL JS, react-map-gl, Supercluster |
| State | Zustand, TanStack Query |
| Backend | Supabase Auth, Supabase Database, PostGIS RPC |
| Form | React Hook Form, Zod |
| Search | Kakao Local API, Mapbox Geocoding API |
| Tooling | ESLint, Prettier, Husky, lint-staged, GitHub Actions |

## 시작하기

### 사전 요구 사항

- Node.js 20 이상
- npm
- Supabase 프로젝트
- Mapbox 액세스 토큰
- 선택 사항: Kakao Developers REST API 키

### 설치

```bash
git clone https://github.com/willy0126/SonderMaps.git
cd SonderMaps
npm ci
```

### 환경 변수

프로젝트 루트에 `.env.local` 파일을 만들고 아래 값을 설정합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_KAKAO_REST_API_KEY=
```

| 변수 | 설명 | 필수 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 예 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 공개 Anon 키 | 예 |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox 지도·지오코딩 액세스 토큰 | 예 |
| `NEXT_PUBLIC_KAKAO_REST_API_KEY` | Kakao 키워드 장소 검색 API 키 | 아니오 |

Kakao 키가 없으면 Kakao 검색 결과는 제외되고 Mapbox 검색만 사용합니다.

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

### 프로덕션 모드 확인

```bash
npm run build
npm run start
```

## 주요 명령어

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버 실행
npm run lint         # ESLint 검사
npm run lint:fix     # ESLint 자동 수정
npm run type-check   # TypeScript 타입 검사
```

## 프로젝트 구조

```text
src/
├── app/
│   ├── (auth)/              # 로그인, 회원가입, 비밀번호 재설정
│   ├── (map)/               # 지도, 마이페이지
│   ├── about/               # 서비스 소개
│   ├── privacy/             # 개인정보 처리방침
│   └── terms/               # 이용약관
├── components/
│   ├── auth/                # 인증 폼
│   ├── landing/             # 랜딩 페이지 섹션
│   ├── map/                 # 지도, 마커, 팝업, 검색 UI
│   └── ui/                  # shadcn/ui 기반 공용 컴포넌트
├── hooks/                   # 위치, 주변 스토리, 공명, 클러스터 훅
├── lib/
│   ├── mapbox/              # 지도 설정
│   ├── supabase/            # 브라우저·서버 Supabase 클라이언트
│   └── validations/         # 폼 검증 스키마
├── stores/                  # Zustand 지도 상태
└── types/                   # 도메인 타입
```

## Supabase 구성

이 레포는 Supabase 클라이언트 코드와 RPC 호출을 포함하지만, 데이터베이스 마이그레이션 및 RLS 정책 파일은 포함하지 않습니다. 실행 전 Supabase 프로젝트에 아래 리소스가 구성되어 있어야 합니다.

- 테이블: `profiles`, `stories`, `story_resonances`
- RPC: `get_nearby_stories`, `check_email_exists`
- Auth 이메일 로그인 및 비밀번호 재설정 설정
- 사용자별 프로필·스토리·공명 접근을 제어하는 RLS 정책
- 위치 기반 주변 스토리 조회를 위한 PostGIS 구성

## 라우트

| 경로 | 설명 |
| --- | --- |
| `/` | 랜딩 페이지 |
| `/map` | 지도와 스토리 탐색 |
| `/auth` | 통합 로그인·회원가입 |
| `/login` | 로그인 |
| `/signup` | 회원가입 |
| `/auth/reset-password` | 비밀번호 재설정 |
| `/my-page` | 내 프로필과 내 스토리 관리 |
| `/about` | 서비스 소개 |
| `/terms` | 이용약관 |
| `/privacy` | 개인정보 처리방침 |

`/my-page`는 인증이 필요하며, 비인증 사용자는 `/auth`로 이동합니다.

## 품질 관리 및 CI

GitHub Actions는 다음을 수행합니다.

- `feature` 브랜치 푸시: 린트 및 타입 검사
- `dev`, `main` 대상 Pull Request: 린트, 타입 검사, 프로덕션 빌드

현재 자동화된 테스트 스위트는 아직 구성되어 있지 않습니다. 기능 변경 시에는 린트, 타입 검사, 프로덕션 빌드를 실행해 검증합니다.

## 배포

Next.js 애플리케이션이므로 Vercel을 포함한 Node.js 호스팅 환경에 배포할 수 있습니다. 배포 환경에는 로컬과 동일한 환경 변수를 설정해야 합니다.

## License

이 프로젝트는 [MIT License](./LICENSE)를 따릅니다.
