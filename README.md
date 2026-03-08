<div align="center">

# PilTrace (필트레이스)

**AI가 당신의 일기를 에세이로 바꿰드립니다**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--5-412991?logo=openai&logoColor=white)](https://openai.com)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-6-000?logo=vercel&logoColor=white)](https://sdk.vercel.ai)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![E2E Tests](https://img.shields.io/badge/E2E_Tests-36%2F36_passing-brightgreen)](#e2e-테스트)

<br />

100~2000자 일기를 쓰면, **8개 AI 에이전트**가 출판 프로세스를 거쳐<br />
풍부한 **에세이**로 변환해주는 한국어 저널링 웹서비스입니다.

[시작하기](#시작하기) · [기술 스택](#기술-스택) · [AI 파이프라인](#ai-멀티-에이전트-파이프라인) · [프로젝트 구조](#프로젝트-구조)

</div>

---

✨ **핵심 기능**

| 기능 | 설명 |
|---|---|
| **AI 에세이 변환** | 짧은 일기 → 8개 에이전트가 5단계 파이프라인을 거쳐 에세이로 변환 |
| **스크랩북 UI** | 아날로그 감성의 스크랩북 미학, 모바일 퍼스트 디자인 |
| **실시간 스트리밍** | Phase 3(초고 작성) & Phase 5(최종 다듬기) 실시간 텍스트 스트리밍 |
| **게스트 공유** | 6자리 고유번호 + 4자리 PIN으로 비회원도 에세이 열람 가능 |
| **일기 서랍** | 작성한 일기와 에세이를 보관하는 개인 서랍 |

---

## AI 멀티 에이전트 파이프라인

```
일기 입력 (100~2000자)
    │
    ▼
┌─────────────────────────────────────────────┐
│  Phase 1: 설문 생성                          │
│  ├─ Curiosity Agent (호기심 질문 생성)        │
│  └─ Depth Agent (깊이 있는 질문 생성)         │
├─────────────────────────────────────────────┤
│  Phase 2: 에세이 설계                        │
│  ├─ Architect Agent (구조/아웃라인 설계)      │
│  └─ Tone Calibrator Agent (톤/분위기 조율)   │
├─────────────────────────────────────────────┤
│  Phase 3: 초고 작성 (스트리밍)                │
│  └─ Writer Agent (에세이 초고 집필)           │
├─────────────────────────────────────────────┤
│  Phase 4: 리뷰                              │
│  ├─ Flow Editor Agent (흐름/구성 평가)        │
│  └─ Style Auditor Agent (문체/스타일 감수)    │
├─────────────────────────────────────────────┤
│  Phase 5: 최종 다듬기 (스트리밍)              │
│  └─ Polisher Agent (최종 퇴고 및 완성)        │
└─────────────────────────────────────────────┘
    │
    ▼
  에세이 완성
```

---

## 기술 스택

| 레이어 | 기술 |
|---|---|
| **프레임워크** | Next.js 16.1 (App Router, React 19, React Compiler) |
| **언어** | TypeScript 5 |
| **스타일** | Tailwind CSS 4 |
| **AI** | OpenAI GPT-5 시리즈 + Vercel AI SDK 6 |
| **인증** | Supabase Auth (@supabase/ssr) |
| **데이터베이스** | Supabase PostgreSQL + Drizzle ORM |
| **배포** | Vercel Pro |
| **런타임** | Bun |

---

## 시작하기

### 사전 요구사항

- [Bun](https://bun.sh) (v1.0+)
- [Supabase](https://supabase.com) 프로젝트
- [OpenAI API Key](https://platform.openai.com/api-keys)

### 설치

```bash
# 1. 저장소 클론
git clone https://github.com/Two-Weeks-Team/PilTrace.git
cd PilTrace

# 2. 의존성 설치
bun install

# 3. 환경변수 설정
cp .env.example .env.local
# .env.local 파일에 실제 값 입력

# 4. DB 마이그레이션
node scripts/run-migration.mjs

# 5. 개발 서버 실행
bun run dev
```

→ http://localhost:3000

### 환경변수

| 변수 | 설명 |
|---|---|
| `OPENAI_API_KEY` | OpenAI API 키 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Publishable Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key |
| `DATABASE_URL` | Supabase Session Pooler URL |
| `DIRECT_URL` | Supabase Direct DB URL |
| `NEXT_PUBLIC_APP_URL` | 앱 URL (기본: `http://localhost:3000`) |

자세한 내용은 [.env.example](.env.example) 참조.

---

## 프로젝트 구조

```
PilTrace/
├── src/
│   ├── app/                    # Next.js App Router 페이지
│   │   ├── api/                # API 라우트
│   │   │   ├── diary/          #   일기 CRUD
│   │   │   ├── essay/          #   에세이 CRUD + AI Phase 1~5
│   │   │   ├── access/         #   게스트 열람
│   │   │   └── auth/           #   인증 (로그아웃)
│   │   ├── write/              # 일기 작성 → 스타일 → 설문 → 생성
│   │   ├── essay/              # 에세이 결과/상세/편집
│   │   ├── drawer/             # 내 서랍 (에세이 목록)
│   │   ├── access/             # 게스트 열람 페이지
│   │   ├── login/              # 로그인
│   │   └── signup/             # 회원가입
│   ├── lib/
│   │   ├── agents/             # 8개 AI 에이전트 + 3개 Phase 핸들러
│   │   ├── pipeline/           # 파이프라인 오케스트레이터
│   │   ├── supabase/           # Supabase 클라이언트 (SSR 패턴)
│   │   └── ...                 # auth, guest-access, fonts, env
│   ├── db/                     # Drizzle ORM 스키마 + 연결
│   ├── components/scrapbook/   # 스크랩북 UI 컴포넌트
│   └── types/                  # TypeScript 타입 정의
├── public/assets/              # SVG 에셋 (캐릭터 4, 데코 9, 배경 2)
├── supabase/migrations/        # DB 마이그레이션 SQL
├── scripts/                    # E2E 테스트, 마이그레이션 러너
└── .env.example                # 환경변수 템플릿
```

---

## E2E 테스트

36개 시나리오를 커버하는 E2E 테스트 스크립트가 포함되어 있습니다.

```bash
# 개발 서버 실행 상태에서
node scripts/e2e-test.mjs
```

| 카테고리 | 테스트 수 | 내용 |
|---|---|---|
| Page Rendering | 6 | 각 페이지 HTTP 200, 인증 리다이렉트 |
| Auth | 3 | 가입, 로그인, 로그아웃 |
| Diary CRUD | 5 | 생성, 조회, 목록, 삭제, 삭제확인 |
| AI Pipeline | 5 | Phase 1~5 전체 파이프라인 |
| Essay CRUD + Guest | 7 | 저장, 조회, 수정, PIN, 게스트 열람 |
| Edge Cases | 10 | 입력 길이 검증, 잘못된 형식, 존재하지 않는 리소스 |

---

## 로드맵

| 단계 | MAU | 기능 |
|---|---|---|
| **Phase 1** (현재) | 0~1K | 이메일 인증, AI 에세이 변환, 게스트 공유 |
| **Phase 2** | 1K~5K | 카카오 OAuth, 에세이 길이 최적화, 커뮤니티 |
| **Phase 3** | 5K+ | Toss 결제, 프리미엄 플랜, 인쇄 서비스 |

---

## 라이선스

MIT License

---

<div align="center">

**Two Weeks Team** · Built with Next.js 16, React 19, and GPT-5

</div>
