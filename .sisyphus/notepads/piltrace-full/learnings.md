# Learnings — PilTrace Full

## Project Context
- Greenfield Next.js 16 project at `/Users/kimsejun/GitHub/PilTrace`
- Git initialized, single branch `master`
- `.env.local` already exists with OPENAI_API_KEY
- PDF reference at `/Users/kimsejun/GitHub/PilTrace/PilTrace_Reference_20260308.pdf`
- Supabase credentials NOT yet configured (TODO: user must add)

## Tech Stack
- Next.js 16 (App Router, `use cache`, View Transitions, proxy.ts)
- GPT-5-mini via OpenAI direct API (`@ai-sdk/openai`)
- Vercel AI SDK 6 (`ai` package)
- Supabase Free (PostgreSQL + Auth)
- Drizzle ORM — MUST use `schemaFilter: ['public']`, `migrate` not `push`
- Bun runtime
- Tailwind CSS v4

## Critical Conventions
- Scaffold with: `bunx create-next-app@latest . --typescript --app --tailwind --src-dir` (dot = current dir)
- Drizzle: pooler URL port 6543 + SSL workaround; schemaFilter: ['public']; `drizzle-kit migrate` ONLY
- Guest PIN: bcrypt hash, 5 attempts / 15 min rate limit, charset excludes 0/O/I/l/1
- AI forbidden words: 흥미롭게도, 중요한 것은, 다양한, 결론적으로, 존재합니다
- Vercel maxDuration: 300s (Pro plan)
- All agents use GPT-5-mini ONLY. Never Claude, Gemini, Azure.
- NO Kakao OAuth, NO Toss Payments in Phase 1
- `.env` file must NOT be modified directly — only `.env.example` and `.env.local`

## [T1 완료] 스캐폴딩
- Next.js 버전: 16.1.6
- Tailwind 버전: 4.2.1
- 패키지 매니저: bun (v1.3.10)
- React Compiler: 활성화 (babel-plugin-react-compiler 설치 필요)
- 특이사항: 
  - `bunx create-next-app`은 대문자 디렉토리명 불가 → 임시 디렉토리에서 생성 후 이동
  - React Compiler는 `experimental.reactCompiler` 아님, 최상위 `reactCompiler` 옵션 사용
  - babel-plugin-react-compiler 필수 설치
  - 빌드 성공 (exit code 0)

## [T2 완료] 환경변수
- zod 버전: 3.24.1 (이미 설치됨)
- src/lib/env.ts: Zod 기반 환경변수 검증, OPENAI_API_KEY 필수
- Supabase 키들은 아직 없음 (optional로 처리)
- .env.example: Phase 1 필수 키 + 발급 URL 주석 포함
- .env.test: 테스트용 빈 템플릿
- TypeScript 검증: ✓ 통과 (npx tsc --noEmit)
- 주의: Zod error.issues 사용 (error.errors 아님)
