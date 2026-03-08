# PilTrace 풀 비전 — AI 저널링 웹서비스 + 비즈니스 플랜

## TL;DR

> **Quick Summary**: 숭숭이(픽셀아트 원숭이) 마스코트와 함께하는 AI 기반 한국어 저널링 서비스. 사용자가 100~2000자의 일기를 쓰면 8개의 전문 AI 에이전트가 출판 프로세스를 거쳐 4000~5000자의 감성 에세이로 변환. 아날로그 스크랩북 미학의 모바일 퍼스트 웹앱.
>
> **Deliverables**:
> - Next.js 16 프로덕션 웹앱 (전체 유저플로우 작동)
> - 8-에이전트 AI 에세이 파이프라인 (GPT-5-mini + Vercel AI SDK 6)
> - Supabase CRUD (일기/에세이 저장, 게스트 접근, 개인 서랍)
> - 모바일 퍼스트 스크랩북 UI (PDF 디자인 완벽 재현)
> - 비즈니스 플랜 문서 (.sisyphus/plans/piltrace-business-plan.md)
> - 단계별 로드맵 (MAU 기반 서드파티 도입 계획)
>
> **Estimated Effort**: XL (30+ tasks)
> **Parallel Execution**: YES — 5 waves
> **Critical Path**: 프로젝트 스캐폴딩 → DB 스키마 → AI 파이프라인 → UI 통합 → QA

---

## Context

### Original Request
Next.js 16과 CRUD를 포함하여 PilTrace 레퍼런스 PDF의 디자인과 컨셉을 완벽하게 구현한 프로덕션 웹서비스. 멀티 에이전트 AI 에세이 생성, 비즈니스 플랜 포함. 풀 비전 스코프.

### Interview Summary
**Key Discussions**:
- AI 모델: GPT-5 시리즈만 사용 (GPT-5-mini 전 에이전트, 한국어 벤치마크 최고)
- 인증: Phase 1은 이메일 + 게스트(고유번호+PIN), 카카오는 Phase 2
- DB: Supabase Free → 단계별 업그레이드
- 결제: Phase 3에서 Toss Payments 도입 (MAU 5K+)
- 호스팅: Vercel Pro (이미 사용 중)
- 멀티에이전트: 출판 프로세스 모방, 최소 2개 이상 페르소나 에이전트가 다각도 검토
- 입력: 100~2000자 → 출력: 4000~5000자 에세이
- 필체: 질문형/나열형/단어형/스토리형 사용자 선택
- 설문: AI가 부족한 정보를 설문으로 보충
- 수정 루프: 1차 완성 후 수정 여부 → 설문 재진행 → 재생성
- 게스트: 고유번호(6자리 영숫자) + PIN(4자리)으로 로그인 없이 접근
- 오늘의 한마디: 완성 후 입력칸 제공
- Azure 완전 제거, OpenAI 직접 API만 사용
- 서드파티는 MAU별 단계적 도입

**Research Findings**:
- Next.js 16: proxy.ts, "use cache", React Compiler stable, View Transitions, async params
- DeepMind "Agents' Room" (ICLR 2025): 전문화 에이전트 분업 > 단일 LLM (학술 입증)
- 한국 수필 4대 구조: 기승전결, 질문형, 스토리형, 묘사형
- AI 냄새 제거 금지어: '흥미롭게도', '중요한 것은', '다양한' 등
- 프롬프트 캐싱: 53% 비용 절감 가능
- GPT-5-mini: $0.25/$2.00 per 1M, 400K context
- 비즈니스: 카카오 이모티콘 시장 ₩1.2조, 경쟁사 $30-60/yr 가격대
- Vercel AI SDK 6: ToolLoopAgent, createUIMessageStream, HTTP 라운드트립 패턴

### Metis Review
**Identified Gaps** (addressed):
- PIPA 개인정보 동의 → Phase 1에 AI 처리 동의 플로우 포함
- Drizzle + Supabase 3가지 이슈 → schemaFilter, SSL, migrate 워크어라운드 포함
- GPT-5-mini가 gpt-5-chat-latest보다 한국어 우수 → GPT-5-mini 확정
- 4-agent 파이프라인 31-42초 → 스트리밍으로 체감 5초 해결
- Supabase Free 1주 비활성 중지 → 개발 중 주기적 접근으로 해결, MAU 성장 시 Pro 전환
- 게스트 PIN 보안 → bcrypt 해싱 + 5회/15분 접근 제한

---

## Work Objectives

### Core Objective
100~2000자 일기 입력을 8-에이전트 출판 파이프라인으로 4000~5000자 감성 에세이로 변환하는 프로덕션 웹서비스 구축. 아날로그 스크랩북 미학, 모바일 퍼스트, 게스트/회원 모두 지원.

### Concrete Deliverables
- `/` — 랜딩/입력 페이지 (PDF Page 1 재현)
- `/write` — 일기 작성 + 스타일 선택 + 설문
- `/essay/[id]` — 에세이 결과 페이지 (PDF Page 3 재현)
- `/essay/[id]/edit` — 수정 요청 페이지
- `/drawer` — 개인 서랍 (저장된 에세이 목록)
- `/access` — 게스트 접근 (고유번호 + PIN)
- `/api/essay/*` — AI 에세이 생성 API (멀티에이전트)
- `/api/auth/*` — Supabase Auth 라우트
- `/api/diary/*` — CRUD API
- `.sisyphus/plans/piltrace-business-plan.md` — 비즈니스 플랜 문서

### Definition of Done
- [ ] 전체 유저플로우 작동: 입력 → 스타일선택 → 설문 → 생성 → 전달 → 수정루프 → 완성 → 저장
- [ ] AI 에세이 4000~5000자 생성 확인 (4가지 필체 모두)
- [ ] 게스트 접근 (고유번호+PIN) 작동
- [ ] 이메일 회원가입/로그인 작동
- [ ] 개인 서랍 CRUD 작동
- [ ] 모바일 375px에서 전체 UI 정상 렌더링
- [ ] PDF 디자인 3페이지 모두 재현
- [ ] 비즈니스 플랜 문서 완성

### Must Have
- 8-에이전트 출판 파이프라인 (호기심/깊이/설계사/톤조율사/작가/흐름편집자/문체감수관/퇴고)
- AI 설문 시스템 (부족한 정보를 질문으로 보충)
- 4가지 필체 선택 (질문형/나열형/단어형/스토리형)
- 2가지 초점 선택 (경험/느낌)
- 수정 루프 (설문 재진행 → 재생성)
- 오늘의 한마디 입력칸
- 편지봉투 전달 애니메이션
- 게스트 접근 (6자리 영숫자 고유번호 + 4자리 PIN)
- 개인 서랍 (로그인 사용자)
- 스크랩북 미학 UI (sage green, 픽셀아트, 마스킹테이프, 레이스)
- .env.example 환경변수 가이드

### Must NOT Have (Guardrails)
- ❌ 카카오 OAuth (Phase 2)
- ❌ Toss Payments / 결제 시스템 (Phase 3)
- ❌ 스티커샵 / IAP (Phase 3)
- ❌ 커뮤니티 / 공개 갤러리 (Phase 2)
- ❌ Azure OpenAI (완전 제거)
- ❌ Claude / Gemini 모델 사용
- ❌ 네이티브 모바일 앱
- ❌ 다국어 지원 (한국어 전용)
- ❌ 프리미엄/무료 티어 분리 (Phase 3)
- ❌ AI 프롬프트에 직접 감정 단어 (행복, 슬픔, 그리움) — 장면으로 표현
- ❌ AI 문체 금지어 (흥미롭게도, 중요한 것은, 다양한, 결론적으로)
- ❌ .env 파일 직접 수정 (사용자만 수정, .env.example만 생성)
- ❌ 프로덕션 서버(8080포트) 접근

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: NO (greenfield)
- **Automated tests**: Tests-after (핵심 경로만)
- **Framework**: bun test (Bun 런타임)

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Playwright — Navigate, interact, assert DOM, screenshot
- **API/Backend**: Bash (curl) — Send requests, assert status + response fields
- **AI Pipeline**: Bash (curl + streaming) — Assert first token latency, output length, Korean quality

---

## Execution Strategy

### Multi-Agent Essay Pipeline Architecture (8 agents, 5 phases)

```
사용자 입력 (100~2000자) + 초점(경험/느낌) + 필체(질문/나열/단어/스토리)
    │
    ▼
┌─────────────── Phase 1: 접수 (Editorial Meeting) ── PARALLEL ──┐
│  Agent A: 호기심 에이전트        Agent B: 깊이 에이전트          │
│  페르소나: "친한 친구"           페르소나: "상담사"               │
│  따뜻한 탐색 질문 생성           성찰적/감정적 질문 생성          │
└──────────────────────────┬─────────────────────────────────────┘
                           │ 질문 병합/중복제거 (2~6개)
                           ▼
                    [사용자 설문 응답]
                           │
    ▼
┌─────────────── Phase 2: 기획 (Planning) ── PARALLEL ───────────┐
│  Agent C: 설계사 에이전트        Agent D: 톤 조율사 에이전트     │
│  에세이 구조/아웃라인 설계       필체별 문체/리듬/문장패턴 설정   │
│  (기승전결/질문형/스토리형 등)    (해요체, 문장길이 교차 등)      │
└──────────────────────────┬─────────────────────────────────────┘
                           │ outline + tone guide
                           ▼
┌─────────────── Phase 3: 초고 (Drafting) ── STREAMING ──────────┐
│  Agent E: 작가 에이전트                                         │
│  아웃라인 + 톤가이드 기반 4000~5000자 에세이 집필               │
│  (실시간 스트리밍으로 사용자에게 전달)                            │
└──────────────────────────┬─────────────────────────────────────┘
                           │ full draft
                           ▼
┌─────────────── Phase 4: 교정 (Review) ── PARALLEL ─────────────┐
│  Agent F: 흐름 편집자            Agent G: 문체 감수관            │
│  서사 일관성, 논리적 흐름,       필체 일치성 검증,               │
│  감정 아크, 적절한 길이 검증     AI냄새 제거, 자연스러운 한국어   │
└──────────────────────────┬─────────────────────────────────────┘
                           │ critique feedback
                           ▼
┌─────────────── Phase 5: 퇴고 (Polish) ── STREAMING ────────────┐
│  Agent H: 퇴고 에이전트                                         │
│  편집자 피드백 반영 + 최종 다듬기 + 여운 있는 마무리             │
│  (실시간 스트리밍으로 최종본 전달)                                │
└──────────────────────────┬─────────────────────────────────────┘
                           │ final essay
                           ▼
              [1차 전달: 편지봉투 애니메이션]
              [수정 여부 → YES: Phase 1로 / NO: 완성]
              [오늘의 한마디 입력]
              [저장: 회원=서랍, 게스트=고유번호+PIN]
```

### Parallel Execution Waves

```
Wave 1 (Foundation — 즉시 시작):
├── T1:  프로젝트 스캐폴딩 + Next.js 16 설정 [quick]
├── T2:  환경변수 가이드 + .env.example [quick]
├── T3:  Supabase 프로젝트 + DB 스키마 (Drizzle) [quick]
├── T4:  TypeScript 타입 정의 (에세이/일기/설문/에이전트) [quick]
├── T5:  디자인 시스템 (색상/폰트/텍스처 토큰) [quick]
├── T6:  PDF 에셋 추출 + 픽셀아트 에셋 준비 [quick]
└── T7:  비즈니스 플랜 문서 작성 [writing]

Wave 2 (Core Modules — Wave 1 후):
├── T8:  Supabase Auth (이메일 가입/로그인) [unspecified-high]
├── T9:  게스트 접근 시스템 (고유번호+PIN) [unspecified-high]
├── T10: AI 에이전트 Phase 1 — 호기심+깊이 에이전트 (설문생성) [deep]
├── T11: AI 에이전트 Phase 2 — 설계사+톤조율사 (기획) [deep]
├── T12: AI 에이전트 Phase 3 — 작가 에이전트 (초고 스트리밍) [deep]
├── T13: CRUD API — 일기/에세이 저장/수정/삭제/목록 [unspecified-high]
└── T14: 스크랩북 배경 컴포넌트 (별패턴/클로버패턴/레이스) [visual-engineering]

Wave 3 (Integration — Wave 2 후):
├── T15: AI 에이전트 Phase 4+5 — 교정+퇴고 (리뷰/폴리시) [deep]
├── T16: AI 파이프라인 오케스트레이션 (전체 5-phase 연결) [deep]
├── T17: 설문 UI + 응답 수집 플로우 [visual-engineering]
├── T18: 일기 입력 페이지 — PDF Page 1 재현 [visual-engineering]
├── T19: 스타일 선택 페이지 — PDF Page 2 재현 [visual-engineering]
├── T20: 개인 서랍 페이지 (저장된 에세이 목록) [visual-engineering]
└── T21: 수정 루프 시스템 (설문 재진행 → 재생성) [unspecified-high]

Wave 4 (Polish & UX — Wave 3 후):
├── T22: 에세이 결과 페이지 — PDF Page 3 재현 + 봉투 애니메이션 [visual-engineering]
├── T23: 오늘의 한마디 + 에세이 완성 플로우 [visual-engineering]
├── T24: 전체 플로우 통합 (입력→생성→전달→저장) [deep]
├── T25: 모바일 반응형 최적화 (375px~) [visual-engineering]
├── T26: 한국어 폰트 최적화 + 성능 튜닝 [quick]
├── T27: AI 프롬프트 캐싱 + 비용 최적화 [unspecified-high]
└── T28: PIPA 개인정보 동의 + AI 처리 동의 플로우 [unspecified-high]

Wave FINAL (Verification — ALL 완료 후):
├── F1: 플랜 준수 감사 (oracle)
├── F2: 코드 품질 리뷰 (unspecified-high)
├── F3: 전체 플로우 QA — Playwright (unspecified-high)
└── F4: 스코프 충실도 점검 (deep)

Critical Path: T1 → T3 → T10 → T12 → T16 → T24 → F1-F4
Parallel Speedup: ~65% faster than sequential
Max Concurrent: 7 (Wave 1)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| T1 | — | T2-T7, ALL | 1 |
| T2 | T1 | T8-T13 | 1 |
| T3 | T1 | T8, T9, T13 | 1 |
| T4 | T1 | T10-T13 | 1 |
| T5 | T1 | T14, T17-T20, T22-T25 | 1 |
| T6 | T1 | T14, T18, T19, T22 | 1 |
| T7 | T1 | — (독립) | 1 |
| T8 | T3 | T20, T24 | 2 |
| T9 | T3 | T24 | 2 |
| T10 | T4 | T16, T17 | 2 |
| T11 | T4 | T16 | 2 |
| T12 | T4 | T15, T16 | 2 |
| T13 | T3, T4 | T20, T21, T24 | 2 |
| T14 | T5, T6 | T18, T19, T22 | 2 |
| T15 | T12 | T16 | 3 |
| T16 | T10, T11, T12, T15 | T21, T24 | 3 |
| T17 | T5, T10 | T24 | 3 |
| T18 | T5, T6, T14 | T24 | 3 |
| T19 | T5, T6, T14 | T24 | 3 |
| T20 | T5, T8, T13 | T24 | 3 |
| T21 | T13, T16 | T24 | 3 |
| T22 | T5, T6, T14 | T24 | 4 |
| T23 | T5 | T24 | 4 |
| T24 | T8, T9, T16-T23 | F1-F4 | 4 |
| T25 | T18-T23 | F3 | 4 |
| T26 | T5 | F2 | 4 |
| T27 | T16 | F2 | 4 |
| T28 | T8 | F3 | 4 |
| F1-F4 | T24 | — | FINAL |

### Agent Dispatch Summary

| Wave | Tasks | Categories |
|------|-------|-----------|
| 1 | 7 | T1-T4,T6 → `quick`, T5 → `quick`, T7 → `writing` |
| 2 | 7 | T10-T12 → `deep`, T8-T9,T13 → `unspecified-high`, T14 → `visual-engineering` |
| 3 | 7 | T15-T16 → `deep`, T21 → `unspecified-high`, T17-T20 → `visual-engineering` |
| 4 | 7 | T22-T23,T25 → `visual-engineering`, T24 → `deep`, T26 → `quick`, T27-T28 → `unspecified-high` |
| FINAL | 4 | F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep` |

---

## TODOs

> Implementation + Test = ONE Task.
> EVERY task has: Agent Profile + Parallelization + QA Scenarios.


### Wave 1: Foundation (T1~T7)

- [ ] 1. **프로젝트 스캐폴딩 + Next.js 16 설정**

  **What to do**:
  - `bunx create-next-app@latest piltrace --typescript --app --tailwind --src-dir`
  - Next.js 16 설정: `next.config.ts`에 React Compiler 활성화, View Transitions 설정
  - Drizzle ORM 설치 + 설정 (`drizzle.config.ts` with `schemaFilter: ['public']`)
  - Vercel AI SDK 6 설치 (`ai`, `@ai-sdk/openai`)
  - Bun 런타임 확인, `bun run dev` 정상 동작
  - `.gitignore` 설정 (.env.local, node_modules, .next)
  - ESLint + Prettier 설정

  **Must NOT do**: .env 파일 직접 수정 금지 (템플릿만 생성)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (Wave 1 첫 번째, 모든 태스크의 기반)
  - **Blocks**: T2-T7, ALL
  - **Blocked By**: None

  **References**:
  - Next.js 16 공식 문서: `use cache`, async params, View Transitions API
  - Drizzle ORM + Supabase: `schemaFilter: ['public']`, pooler URL (port 6543), `migrate` 사용 (`push` 대신)
  - Vercel AI SDK 6: ToolLoopAgent, createUIMessageStream

  **QA Scenarios**:
  ```
  Scenario: 개발서버 정상 기동
    Tool: Bash
    Steps:
      1. bun run dev
      2. curl http://localhost:3000 -o /dev/null -w "%{http_code}"
    Expected: 200
    Evidence: .sisyphus/evidence/task-1-dev-server.txt

  Scenario: 빌드 성공
    Tool: Bash
    Steps:
      1. bun run build
    Expected: Exit code 0, no errors
    Evidence: .sisyphus/evidence/task-1-build.txt
  ```

  **Commit**: YES
  - Message: `chore(init): scaffold Next.js 16 project with Drizzle and AI SDK`
  - Pre-commit: `bun run build`

- [ ] 2. **환경변수 가이드 + .env.example**

  **What to do**:
  - `.env.example` 생성 (Phase 1 필수 키: OPENAI_API_KEY, SUPABASE 키들, APP_URL)
  - `.env.test` 템플릿 생성 (사용자 규칙 준수)
  - `.gitignore`에 `.env.local`, `.env.test` 추가 확인
  - `lib/env.ts` 환경변수 검증 유틸리티 (zod 스키마로 검증)
  - 각 키별 주석으로 발급 URL/방법 안내

  **Must NOT do**: .env 파일에 실제 키값 입력 금지. 템플릿만 생성.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 1, T1 완료 후)
  - **Blocks**: T8-T13
  - **Blocked By**: T1

  **References**:
  - Phase 1 필수 키: `OPENAI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_APP_URL`
  - Phase 2 추가: `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`
  - Phase 3 추가: `TOSS_CLIENT_KEY`, `TOSS_SECRET_KEY`

  **QA Scenarios**:
  ```
  Scenario: 환경변수 검증 실패 시 에러
    Tool: Bash
    Steps:
      1. OPENAI_API_KEY 없이 bun run dev 실행
    Expected: 명확한 에러 메시지 출력 ("Missing OPENAI_API_KEY")
    Evidence: .sisyphus/evidence/task-2-env-validation.txt
  ```

  **Commit**: YES (T1과 함께)
  - Message: `chore(init): scaffold Next.js 16 project with env guide`

- [ ] 3. **Supabase DB 스키마 (Drizzle ORM)**

  **What to do**:
  - Drizzle 스키마 정의 (`db/schema.ts`):
    - `users` 테이블 (Supabase Auth 확장)
    - `diaries` 테이블 (id, user_id nullable, content 100~2000자, created_at)
    - `essays` 테이블 (id, diary_id, user_id nullable, unique_code 6자리, pin_hash, content 4000~5000자, focus enum, style enum, todays_word, survey_data jsonb, revision_count, agent_metadata jsonb)
    - `survey_responses` 테이블 (id, essay_id, questions jsonb, answers jsonb)
  - Drizzle 마이그레이션 생성: `drizzle-kit generate` + `drizzle-kit migrate`
  - RLS (Row Level Security) 정책 SQL 작성
  - DB 커넥션 헬퍼 (`db/index.ts`)

  **Must NOT do**: `drizzle-kit push` 사용 금지 (타임아웃 이슈). `migrate` 사용.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 1, T1 완료 후)
  - **Blocks**: T8, T9, T13
  - **Blocked By**: T1

  **References**:
  - Drizzle + Supabase 워크어라운드: `schemaFilter: ['public']`, pooler URL, SSL 설정
  - 게스트 접근: `unique_code` VARCHAR(6) UNIQUE + `pin_hash` bcrypt
  - RLS: user_id 기반 행 수준 보안

  **QA Scenarios**:
  ```
  Scenario: 마이그레이션 성공
    Tool: Bash
    Steps:
      1. bunx drizzle-kit generate
      2. bunx drizzle-kit migrate
    Expected: 마이그레이션 성공, 테이블 생성 확인
    Evidence: .sisyphus/evidence/task-3-migration.txt

  Scenario: RLS 검증
    Tool: Bash (curl)
    Steps:
      1. Service role key로 데이터 삽입
      2. Anon key로 다른 사용자 데이터 조회 시도
    Expected: 빈 결과 (RLS 차단)
    Evidence: .sisyphus/evidence/task-3-rls.txt
  ```

  **Commit**: YES
  - Message: `feat(db): Supabase schema with Drizzle ORM and RLS`

- [ ] 4. **TypeScript 타입 정의**

  **What to do**:
  - `types/essay.ts`: Essay, Diary, SurveyQuestion, SurveyResponse, EssayFocus, WritingStyle
  - `types/agent.ts`: AgentPhase, AgentResult, PipelineState, PipelineProgress
  - `types/auth.ts`: User, GuestAccess, AuthSession
  - `types/api.ts`: API 요청/응답 타입 (GenerateEssayRequest, etc.)
  - Zod 스키마와 타입 동기화 (`z.infer<typeof schema>`)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 1)
  - **Blocks**: T10-T13
  - **Blocked By**: T1

  **QA Scenarios**:
  ```
  Scenario: 타입 체크 통과
    Tool: Bash
    Steps: bunx tsc --noEmit
    Expected: Exit code 0
    Evidence: .sisyphus/evidence/task-4-typecheck.txt
  ```

  **Commit**: YES (T3과 함께)
  - Message: `feat(db): Supabase schema and TypeScript types`

- [ ] 5. **디자인 시스템 (색상/폰트/텍스처 토큰)**

  **What to do**:
  - Tailwind CSS 설정: 커스텀 색상 (sage-green, cream, earthy-brown, soft-pink)
  - CSS 변수: `--sage-green: #9CAF88`, `--cream: #F5F0E8`, `--star-brown: #4A3728`
  - 한국어 폰트 설정: `next/font/google`로 Nanum Pen Script + Noto Sans KR + Gaegu
  - `font-display: swap` + Apple SD Gothic Neo 펴백
  - 텍스처 CSS 클래스: `.paper-lined`, `.paper-grid`, `.paper-kraft`
  - `image-rendering: pixelated` 글로벌 설정
  - SVG 노이즈 필터 (종이 질감)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 1)
  - **Blocks**: T14, T17-T25
  - **Blocked By**: T1

  **QA Scenarios**:
  ```
  Scenario: 폰트 로딩 확인
    Tool: Playwright
    Steps:
      1. http://localhost:3000 접속
      2. document.fonts.ready 대기
      3. Nanum Pen Script 폰트 로딩 확인
    Expected: 한글 폰트 정상 렌더링
    Evidence: .sisyphus/evidence/task-5-fonts.png
  ```

  **Commit**: YES (T6과 함께)
  - Message: `feat(design): design system tokens and pixel art assets`

- [ ] 6. **PDF 에셋 추출 + 픽셀아트 에셋 준비**

  **What to do**:
  - PDF에서 핵심 이미지 추출:
    - 숭숭이 픽셀아트 (키보드 앞, 봉투 안, 원숭이 자세 3종)
    - 픽셀 마우스 (친구 캐릭터)
    - 픽셀 공룡 (감성 캐릭터)
    - 카페 일러스트, 하트 젬, 꽃다발
  - AI 생성 에셋 (필요시):
    - 추가 숭숭이 포즈/표정
    - UI 아이콘 (star, clover, button, tape)
  - `public/assets/` 디렉토리 구조:
    - `characters/` (sungsungi, mouse, dinosaur)
    - `decorations/` (star, clover, tape, ribbon, clip)
    - `backgrounds/` (star-pattern, clover-pattern)
  - 모든 픽셀아트: PNG with transparent background

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 1)
  - **Blocks**: T14, T18, T19, T22
  - **Blocked By**: T1

  **References**:
  - PDF 파일: `/Users/kimsejun/Downloads/PilTrace_Reference_20260308.pdf`
  - Page 1: 숭숭이+키보드, 노트, 별패턴배경, 레이스, 별스티커, 마스킹테이프
  - Page 2: 마우스+카페, 공룡+하트+꽃, 보튼, 리봄, 별
  - Page 3: 숭숭이+봉투+꽃, 클로버, 그리드노트, 깅엄테이프

  **QA Scenarios**:
  ```
  Scenario: 에셋 파일 존재 확인
    Tool: Bash
    Steps: ls -la public/assets/characters/ public/assets/decorations/ public/assets/backgrounds/
    Expected: 각 디렉토리에 PNG 파일 존재
    Evidence: .sisyphus/evidence/task-6-assets.txt
  ```

  **Commit**: YES (T5와 함께)

- [ ] 7. **비즈니스 플랜 문서**

  **What to do**:
  - `.sisyphus/plans/piltrace-business-plan.md` 작성:
    - Executive Summary
    - 시장 분석: 카카오 이모티콘 ₩1.2조, AI 저널링 시장 성장세
    - 경쟁사 분석: Daylio, Reflectly, Day One 가격/기능
    - 제품 설명: 8-에이전트 파이프라인, 스크랩북 미학, 숭숭이 IP
    - 수익 모델: ₩4,900/월 or ₩39,900/년 + 스티커 IAP ₩1,500-2,500
    - 단위 경제: AI 비용 ~₩28/에세이, LTV ₩98,000, CAC ₩32,667 목표
    - MAU별 로드맵: Phase 1-4 서드파티 도입 계획
    - 재무 예측: 보수/기본/낙관 3가지 시나리오
    - 성장 전략: 카카오톡 이모티콘 등록, 인스타그램 일기계정, TikTok 콘텐츠

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 1, 독립)
  - **Blocks**: 없음
  - **Blocked By**: T1

  **References**:
  - 리서치: 카카오 이모티콘 시장 ₩1.2조, 2.5M 결제 사용자
  - 경쟁사: Day One $34.99/yr, Daylio $35.99/yr, Reflectly $59.99/yr
  - MZ세대: AI 구독 299% 성장, 월 디지털 구독 ~₩40,000 기준선
  - 전환율: 다운로드→결제 1.75% (기본), 트라이얼→결제 50%

  **QA Scenarios**:
  ```
  Scenario: 비즈니스 플랜 문서 필수 섹션 확인
    Tool: Bash (grep)
    Steps:
      1. grep -c 'Executive Summary\|\uc2dc\uc7a5 \ubd84\uc11d\|\uacbd\uc7c1\uc0ac\|\uc218\uc775 \ubaa8\ub378\|\uc7ac\ubb34 \uc608\uce21' .sisyphus/plans/piltrace-business-plan.md
    Expected: >= 5 (모든 핵심 섹션 존재)
    Evidence: .sisyphus/evidence/task-7-business-plan.txt
  ```

  **Commit**: YES
  - Message: `docs(business): comprehensive business plan with financial projections`

---

### Wave 2: Core Modules (T8~T14)

- [ ] 8. **Supabase Auth (이메일 가입/로그인)**

  **What to do**:
  - Supabase Auth 클라이언트 설정 (`lib/supabase/client.ts`, `lib/supabase/server.ts`)
  - `proxy.ts` 에서 auth 세션 관리 (Next.js 16 — middleware 대신 proxy.ts 사용)
  - 회원가입 페이지 (`app/signup/page.tsx`): 이메일 + 비밀번호 + 닉네임
  - 로그인 페이지 (`app/login/page.tsx`): 이메일 + 비밀번호
  - 로그아웃 API (`app/api/auth/logout/route.ts`)
  - 인증 상태 컨텍스트 (`lib/auth-context.tsx`)
  - 보호된 라우트 가드 헬퍼 (`lib/auth-guard.ts`)
  - Supabase Auth 이메일 확인 비활성화 (개발 편의) 또는 리다이렉트 설정

  **Must NOT do**:
  - ❌ 카카오 OAuth 구현 (Phase 2)
  - ❌ 구글 OAuth 구현 (Phase 4)
  - ❌ .env 파일 직접 수정

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  - Reason: Auth 설정은 Supabase + Next.js 16 proxy.ts 통합이 핵심. 표준 패턴이지만 proxy.ts가 새로운 접근.

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 2, T9와 병렬)
  - **Blocks**: T20, T24
  - **Blocked By**: T3 (DB 스키마)

  **References**:
  - **Pattern**: Supabase Auth + Next.js App Router SSR 패턴 — `createServerClient()` 사용
  - **API**: Supabase Auth API — `signUp()`, `signInWithPassword()`, `signOut()`, `getUser()`
  - **New in Next.js 16**: `proxy.ts` replaces middleware — 세션 쿠키 리프레시 여기서 처리
  - **Type**: `types/auth.ts:User, AuthSession` — T4에서 정의한 타입 사용
  - **DB**: `db/schema.ts:users` — Supabase Auth `auth.users`와 public.users 연동

  **Acceptance Criteria**:
  - [ ] 이메일 회원가입 → 로그인 → 보호된 페이지 접근 가능
  - [ ] 미인증 사용자 → 보호된 페이지 접근 시 로그인으로 리다이렉트

  **QA Scenarios**:
  ```
  Scenario: 이메일 회원가입 + 로그인 플로우
    Tool: Playwright
    Steps:
      1. http://localhost:3000/signup 접속
      2. input[name="email"] 에 "test@piltrace.com" 입력
      3. input[name="password"] 에 "Test1234!" 입력
      4. input[name="nickname"] 에 "테스터" 입력
      5. button[type="submit"] 클릭
      6. /login으로 리다이렉트 확인
      7. 동일 이메일/비밀번호로 로그인
      8. /drawer 페이지 접근 가능 확인
    Expected: 회원가입 성공 → 로그인 성공 → /drawer 접근 가능
    Evidence: .sisyphus/evidence/task-8-auth-signup.png

  Scenario: 미인증 접근 차단
    Tool: Playwright
    Steps:
      1. 새 시크릿 세션으로 http://localhost:3000/drawer 직접 접속
      2. 리다이렉트 URL 확인
    Expected: /login으로 리다이렉트 (또는 로그인 모달)
    Evidence: .sisyphus/evidence/task-8-auth-guard.png
  ```

  **Commit**: YES (T9과 함께)
  - Message: `feat(auth): email auth + guest access with PIN`
  - Pre-commit: `bun run build`


- [ ] 9. **게스트 접근 시스템 (고유번호+PIN)**

  **What to do**:
  - 고유번호 생성 유틸 (`lib/guest-access.ts`): 6자리 영숫자 조합 (ex: `AB12C3`), 유니크 보장
  - PIN 해싱: bcrypt로 4자리 PIN 해싱 저장, 복호화 불가
  - 접근 제한: 5회/15분 레이트 리미트 (brute-force 방지)
  - 게스트 접근 페이지 (`app/access/page.tsx`): 고유번호 6자리 입력 + PIN 4자리 입력
  - 게스트 API (`app/api/access/route.ts`): POST — 고유번호+PIN 검증 → 에세이 반환
  - 에세이 저장 시 고유번호 자동생성 + PIN 설정 UI
  - 게스트 에세이 1년 보관 정책 (DB TTL 또는 cron)

  **Must NOT do**:
  - ❌ PIN을 평문으로 저장
  - ❌ 고유번호에 혼동되는 문자 사용 (O/0, I/l/1)
  - ❌ 레이트 리미트 없이 무제한 시도 허용

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  - Reason: 보안(bcrypt, rate limit) + CRUD + UI 통합 필요

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 2, T8과 병렬)
  - **Blocks**: T24
  - **Blocked By**: T3 (DB 스키마)

  **References**:
  - **DB**: `db/schema.ts:essays` — `unique_code` VARCHAR(6) UNIQUE, `pin_hash` TEXT
  - **Security**: bcrypt 해싱 (saltRounds=10), rate limiter (sliding window 5/15min)
  - **UX**: PDF Page 3 — 결과 전달 후 고유번호 표시 → 카피 버튼 + PIN 설정 UI
  - **혼동문자 제거**: 0, O, I, l, 1 제외한 charset = `ABCDEFGHJKMNPQRSTUVWXYZ23456789`

  **QA Scenarios**:
  ```
  Scenario: 게스트 에세이 저장 + 조회
    Tool: Bash (curl)
    Steps:
      1. POST /api/essay/generate (content: "오늘 수족관에 갔다", guest: true)
      2. 응답에서 unique_code 추출
      3. PIN "1234" 설정 API 호출
      4. POST /api/access {code: "<unique_code>", pin: "1234"}
    Expected: 200 + 에세이 데이터 반환
    Evidence: .sisyphus/evidence/task-9-guest-access.txt

  Scenario: PIN 5회 오류 시 레이트 리미트
    Tool: Bash (curl)
    Steps:
      1. 5회 연속 잘못된 PIN으로 POST /api/access
      2. 6번째 올바른 PIN으로 시도
    Expected: 429 Too Many Requests (올바른 PIN이어도 차단)
    Evidence: .sisyphus/evidence/task-9-rate-limit.txt
  ```

  **Commit**: YES (T8과 함께)
  - Message: `feat(auth): email auth + guest access with PIN`

- [ ] 10. **AI 에이전트 Phase 1 — 호기심+깊이 에이전트 (설문생성)**

  **What to do**:
  - Agent A 호기심 에이전트 (`lib/agents/curiosity-agent.ts`):
    - 페르소나: "친한 친구" — 따뜻하고 호기심 많은 탐색 질문
    - 시스템프롬프트: 사용자 입력 분석 + 경험적 부족정보 식별
    - 출력: 1~3개 따뜻한 단답형 질문
  - Agent B 깊이 에이전트 (`lib/agents/depth-agent.ts`):
    - 페르소나: "상담사" — 성찰적이고 감정적인 탐색 질문
    - 시스템프롬프트: 감정/느낌 부족정보 식별
    - 출력: 1~3개 성찰 유도 질문
  - 병렬 실행 로직 (`lib/agents/phase1-survey.ts`):
    - Promise.all([curiosity, depth]) 병렬 실행
    - 질문 병합/중복제거 로직 (GPT-5-mini로 중복 감지)
    - 최종 2~6개 질문 출력 (초점/필체에 따라 조정)
  - Vercel AI SDK 6 사용: `generateText()` + structured output (Zod schema)

  **Must NOT do**:
  - ❌ 직접적 감정 단어 질문 ("행복했나요?") → 장면 기반 질문 ("그때 어디에 있었나요?")
  - ❌ 6개 초과 질문 생성
  - ❌ 두 에이전트가 동일한 질문 생성 (중복제거 필수)

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []
  - Reason: AI 에이전트 프롬프트 엔지니어링 + Vercel AI SDK 통합 + 질문 품질 보장 — 논리 집약적

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 2, T11-T12와 병렬)
  - **Blocks**: T16, T17
  - **Blocked By**: T4 (타입 정의)

  **References**:
  - **Vercel AI SDK 6**: `generateText()` with structured output (Zod schema) — 질문 배열 출력
  - **Type**: `types/agent.ts:AgentPhase, AgentResult` — 각 에이전트 입출력 타입
  - **질문 품질**: 초점(experience)이면 경험적 질문 우선, 초점(feeling)이면 감정적 질문 우선
  - **프롬프트 캐싱**: 시스템 프롬프트(정적) → 페르소나(정적) → 사용자 입력(동적) 순서 필수
  - **Cost**: ~$0.002/call (Phase 1 두 에이전트 합치)

  **QA Scenarios**:
  ```
  Scenario: 설문 생성 — 경험 초점
    Tool: Bash (curl)
    Steps:
      1. POST /api/essay/phase1 {content: "오늘 수족관에 갔다. 만터터치 풀에서 가오리를 만졌다.", focus: "experience", style: "story"}
      2. 응답 JSON에서 questions 배열 확인
    Expected: 2~6개 질문, 경험적 질문 포함 ("어떤 동물을...", "누구와 함께...")
    Evidence: .sisyphus/evidence/task-10-phase1-experience.json

  Scenario: 설문 생성 — 100자 최소 입력
    Tool: Bash (curl)
    Steps:
      1. POST /api/essay/phase1 {content: "오늘 비가 왔다. 카페에서 커피를 마셨다.", focus: "feeling", style: "question"}
    Expected: 4~6개 질문 (짧은 입력이므로 더 많은 질문), 감정적 질문 포함
    Evidence: .sisyphus/evidence/task-10-phase1-minimal.json
  ```

  **Commit**: YES (T11-T12와 함께)
  - Message: `feat(ai): multi-agent essay pipeline phases 1-3`

- [ ] 11. **AI 에이전트 Phase 2 — 설계사+톤조율사 (기획)**

  **What to do**:
  - Agent C 설계사 에이전트 (`lib/agents/architect-agent.ts`):
    - 에세이 구조/아웃라인 설계 (기승전결, 질문형, 스토리형, 묘사형 중 필체에 따라)
    - 각 섹션별 핵심 소재 배치, 문단 수 (8~12단락)
    - 사용자 입력 + 설문 응답을 구조에 매핑
  - Agent D 톤 조율사 에이전트 (`lib/agents/tone-calibrator-agent.ts`):
    - 필체별 문체 설정:
      - 질문형: 독자에게 질문을 던지며 전개
      - 나열형: 장면과 감각을 나열하며 전개
      - 단어형: 핵심 단어를 중심으로 연상 전개
      - 스토리형: 서사적 기승전결 전개
    - 한국어 리듬: 짧은문장(10-20자) + 긴문장(40-60자) 교차 패턴
    - 해요체 기본, 문단당 3~5문장
  - 병렬 실행 + 결과 병합 (`lib/agents/phase2-planning.ts`)

  **Must NOT do**:
  - ❌ AI냄새 금지어 톤 가이드에 포함 (흥미롭게도, 중요한 것은, 다양한, 결론적으로, 존재합니다)
  - ❌ 구조가 필체와 무관하게 일율적

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []
  - Reason: 한국어 수필 구조 이해 + AI 프롬프트 설계 — 논리 집약적

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 2, T10과 병렬)
  - **Blocks**: T16
  - **Blocked By**: T4 (타입 정의)

  **References**:
  - **한국 수필 4대 구조**: 기승전결 / 질문형 / 스토리형 / 뭘사형 — Draft 문서 참조
  - **한국어 리듬**: 10-20자 짧은문장 + 40-60자 긴문장 교차, 3-5문장/문단
  - **AI냄새 금지어 목록**: 흥미롭게도, 중요한 것은, 다양한, 결론적으로, 존재합니다, ~에 의해
  - **Type**: `types/agent.ts:AgentPhase` — outline + toneGuide 출력 타입

  **QA Scenarios**:
  ```
  Scenario: 아웃라인 생성 — 스토리형 필체
    Tool: Bash (curl)
    Steps:
      1. POST /api/essay/phase2 {diary: "...", survey_answers: [...], focus: "experience", style: "story"}
      2. 응답에서 outline.sections 확인
      3. tone_guide에 "기승전결" 패턴 포함 확인
    Expected: 8~12 섹션 아웃라인 + 스토리형 톤 가이드
    Evidence: .sisyphus/evidence/task-11-phase2-story.json

  Scenario: AI냄새 금지어 미포함 확인
    Tool: Bash (curl + grep)
    Steps:
      1. Phase 2 응답 전체에서 금지어 검색: grep -c "흥미롭\|중요한 것은\|다양한\|결론적으로"
    Expected: 0 (No 금지어 발견)
    Evidence: .sisyphus/evidence/task-11-no-ai-smell.txt
  ```

  **Commit**: YES (T10, T12와 함께)
  - Message: `feat(ai): multi-agent essay pipeline phases 1-3`


- [ ] 12. **AI 에이전트 Phase 3 — 작가 에이전트 (초고 스트리밍)**

  **What to do**:
  - Agent E 작가 에이전트 (`lib/agents/writer-agent.ts`):
    - 아웃라인(Phase 2) + 톤 가이드(Phase 2) 기반 4000~5000자 에세이 집필
    - Vercel AI SDK `streamText()` 사용 — 실시간 스트리밍 출력
    - 사용자 입력의 단어/표현을 자연스럽게 포함 (AI가 완전히 새로 쓰지 않음)
    - 마지막 문단: 여운 있는 마무리 (순환형/질문형/절제형 중 자연스러운 선택)
  - API 라우트 (`app/api/essay/phase3/route.ts`):
    - POST — outline + toneGuide + diary + surveyAnswers 입력
    - `createUIMessageStream()` + `writer.write()` 로 진행상황 스트리밍
    - 출력 길이 검증 (4000~5000자, 미달 시 자동 보충 요청)

  **Must NOT do**:
  - ❌ 사용자 입력을 무시하고 완전히 새로운 글 생성
  - ❌ AI냄새 금지어 사용
  - ❌ 5000자 초과 또는 4000자 미만 출력
  - ❌ 프롬프트에 직접적 감정 단어 (행복, 슬픔, 그리움) — 장면으로 표현

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []
  - Reason: AI 스트리밍 + 프롬프트 엔지니어링 + 길이 제어 로직 — 복잡도 높음

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 2, T10-T11과 병렬)
  - **Blocks**: T15, T16
  - **Blocked By**: T4 (타입 정의)

  **References**:
  - **Vercel AI SDK 6**: `streamText()` + `createUIMessageStream()` — Draft 에서 정리한 패턴
  - **프롬프트 캐싱**: system prompt(정적) → persona(정적) → outline+tone(동적) → diary(동적) 순서
  - **길이 제어**: GPT-5-mini 400K context — 출력 제어를 위해 max_tokens + 프롬프트에 "반드시 4000~5000자" 명시
  - **장면 표현 예시**: "행복했다" → "입꼬리가 올라갔다", "슬퍼다" → "목이 먹먹해졌다"

  **QA Scenarios**:
  ```
  Scenario: 에세이 스트리밍 생성 + 길이 검증
    Tool: Bash (curl)
    Steps:
      1. POST /api/essay/phase3 {outline: {...}, toneGuide: {...}, diary: "오늘 수족관에 갔다...", surveyAnswers: [...]}
      2. 스트리밍 응답 수신 (SSE)
      3. 최종 텍스트 길이 측정: echo -n "$ESSAY" | wc -c
    Expected: 4000~5000자 범위, 첫 토큰 ~3초 이내
    Evidence: .sisyphus/evidence/task-12-phase3-stream.json

  Scenario: AI냄새 금지어 + 길이 범위 검증
    Tool: Bash
    Steps:
      1. 생성된 에세이에서 금지어 검색
      2. 길이 4000자 이상 확인
      3. 사용자 입력의 핵심 표현이 에세이에 자연스럽게 녹아들어갔는지 확인
    Expected: 금지어 0개, 길이 4000~5000자, 사용자 표현 포함
    Evidence: .sisyphus/evidence/task-12-quality.txt
  ```

  **Commit**: YES (T10-T11과 함께)
  - Message: `feat(ai): multi-agent essay pipeline phases 1-3`

- [ ] 13. **CRUD API — 일기/에세이 저장/수정/삭제/목록**

  **What to do**:
  - 일기 CRUD (`app/api/diary/route.ts`):
    - POST: 새 일기 저장 (user_id nullable — 게스트 가능)
    - GET: 내 일기 목록 (user_id 기반)
    - DELETE: 일기 삭제 (user_id 확인)
  - 에세이 CRUD (`app/api/essay/route.ts`, `app/api/essay/[id]/route.ts`):
    - POST: 에세이 저장 (diary_id 연결, agent_metadata jsonb)
    - GET: 에세이 목록 / 단건 조회
    - PATCH: 오늘의 한마디 수정, revision_count 업데이트
    - DELETE: 에세이 삭제 (user_id 확인)
  - Drizzle ORM 사용 (타입 안전)
  - Zod 입력 검증 (content 길이 100~2000자, etc.)

  **Must NOT do**:
  - ❌ RLS 우회하는 쿼리
  - ❌ 다른 사용자 데이터 접근 허용

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  - Reason: 표준 CRUD + Drizzle ORM + Zod 검증 — 복잡하지 않지만 여러 라우트

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 2)
  - **Blocks**: T20, T21, T24
  - **Blocked By**: T3, T4 (DB 스키마 + 타입)

  **References**:
  - **DB**: `db/schema.ts` — diaries, essays 테이블 스키마
  - **Type**: `types/essay.ts`, `types/api.ts` — 요청/응답 타입
  - **Validation**: Zod 스키마 — content 100~2000자, focus enum, style enum

  **QA Scenarios**:
  ```
  Scenario: 에세이 CRUD 전체 플로우
    Tool: Bash (curl)
    Steps:
      1. POST /api/diary {content: "오늘 테스트 일기입니다..." (200자)}
      2. 응답에서 diary_id 추출
      3. POST /api/essay {diary_id, content: "에세이 내용...", focus: "experience", style: "story"}
      4. GET /api/essay?user_id=xxx — 목록 확인
      5. PATCH /api/essay/{id} {todays_word: "오늘의 한마디"}
      6. DELETE /api/essay/{id}
      7. GET /api/essay/{id} — 404 확인
    Expected: 각 단계 200/201/204/404 정상 응답
    Evidence: .sisyphus/evidence/task-13-crud.txt

  Scenario: 입력 검증 실패
    Tool: Bash (curl)
    Steps:
      1. POST /api/diary {content: "aa"} (2자 — 100자 미만)
      2. POST /api/diary {content: "a".repeat(3000)} (3000자 — 2000자 초과)
    Expected: 400 Bad Request + 명확한 오류 메시지
    Evidence: .sisyphus/evidence/task-13-validation.txt
  ```

  **Commit**: YES
  - Message: `feat(crud): diary and essay CRUD operations`

- [ ] 14. **스크랩북 배경 컴포넌트 (별패턴/클로버패턴/레이스)**

  **What to do**:
  - 별패턴 배경 컴포넌트 (`components/scrapbook/StarBackground.tsx`):
    - PDF Page 1 재현: sage green + dark star 패턴
    - CSS 반복 패턴 또는 SVG 타일링
  - 클로버패턴 배경 (`components/scrapbook/CloverBackground.tsx`):
    - PDF Page 3 재현: white/cream + green clover 패턴
  - 레이스 리본 컴포넌트 (`components/scrapbook/LaceRibbon.tsx`):
    - 상단/사이드 장식용 brown lace 패턴
  - 마스킹테이프 컴포넌트 (`components/scrapbook/MaskingTape.tsx`):
    - green masking tape + gingham 패턴 테이프
  - 페이퍼 노트 컴포넌트 (`components/scrapbook/PaperNote.tsx`):
    - lined/grid/kraft 변형 지원
    - gold binder clip, star sticker 장식 옵션
  - 픽셀아트 랜더링: `image-rendering: pixelated` 적용

  **Must NOT do**:
  - ❌ 실제 이미지 대신 CSS로 재현 가능한 것은 CSS 우선 (성능)
  - ❌ 애니메이션 과도 (에세이 읽기에 방해)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
  - Reason: 시각적 컴포넌트 제작 + CSS 패턴/텍스처 — 디자인 집약적

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 2)
  - **Blocks**: T18, T19, T22
  - **Blocked By**: T5 (디자인 시스템), T6 (에셋)

  **References**:
  - **PDF Page 1**: sage green + dark star 패턴, brown lace, gold clip, green masking tape, lined notepad
  - **PDF Page 2**: same star 배경, kraft paper tag, twine bows
  - **PDF Page 3**: clover 패턴, gingham tape, grid notepad, satin bow
  - **디자인 토큰**: `--sage-green: #9CAF88`, `--cream: #F5F0E8`, `--star-brown: #4A3728`
  - **에셋**: `public/assets/` 디렉토리 (T6에서 준비)

  **QA Scenarios**:
  ```
  Scenario: 스크랩북 컴포넌트 렌더링
    Tool: Playwright
    Steps:
      1. 테스트 페이지에서 별패턴 배경 렌더링
      2. 레이스 리본, 마스킹테이프, 페이퍼노트 컴포넌트 각각 렌더링
      3. 픽셀아트 image-rendering 스타일 확인
    Expected: PDF 디자인과 일치하는 시각적 출력
    Evidence: .sisyphus/evidence/task-14-scrapbook.png

  Scenario: 모바일 375px 렌더링
    Tool: Playwright
    Steps:
      1. viewport 375x812 설정
      2. 별패턴 배경 + 레이스 + 페이퍼노트 렌더링 확인
    Expected: 오버플로우 없이 정상 표시
    Evidence: .sisyphus/evidence/task-14-mobile.png
  ```

  **Commit**: YES
  - Message: `feat(ui): scrapbook background components`

---

### Wave 3: Integration (T15~T21)

- [ ] 15. **AI 에이전트 Phase 4+5 — 교정+퇴고 (리뷰/폴리시)**

  **What to do**:
  - Agent F 흐름 편집자 (`lib/agents/flow-editor-agent.ts`):
    - 서사 일관성 검증: 시간 순서, 인과관계, 감정 아크 점검
    - 논리적 흐름: 문단 전환 자연스러움, 반복 제거
    - 길이 검증: 4000~5000자 범위 유지
    - 출력: 구체적 수정 지시사항 (JSON structured)
  - Agent G 문체 감수관 (`lib/agents/style-auditor-agent.ts`):
    - 필체 일치성: 선택한 필체(story/question/list/word)와 실제 문체 일치 검증
    - AI냄새 제거: 금지어 목록 대조 + 부자연스러운 표현 감지
    - 한국어 자연스러움: 해요체 일관성, 문장 리듬 검증
    - 출력: 대체 표현 제안 (JSON structured)
  - 병렬 실행 + 피드백 병합 (`lib/agents/phase4-review.ts`)
  - Agent H 퇴고 에이전트 (`lib/agents/polisher-agent.ts`):
    - Phase 4 피드백 반영 + 최종 다듬기
    - 여운 있는 마무리 (순환형/질문형/절제형)
    - Vercel AI SDK `streamText()` 사용 — 최종본 실시간 스트리밍
  - API 라우트 (`app/api/essay/phase4/route.ts`, `app/api/essay/phase5/route.ts`)

  **Must NOT do**:
  - ❌ 원문의 핵심 의미 변경 (문체만 조정)
  - ❌ 최종 길이가 4000자 미만으로 축소
  - ❌ AI냄새 금지어를 새로 삽입

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []
  - Reason: 리뷰 피드백 생성 + 피드백 반영 폴리시 + 스트리밍 — 고도 논리

  **Parallelization**:
  - **Can Run In Parallel**: NO (T12 완료 필요)
  - **Blocks**: T16
  - **Blocked By**: T12 (Phase 3 작가 에이전트)

  **References**:
  - **AI냄새 금지어**: 흥미롭게도, 중요한 것은, 다양한, 결론적으로, 존재합니다, ~에 의해
  - **한국어 리듬**: 짧은(10-20자) + 긴(40-60자) 교차, 3-5문장/문단
  - **여운 패턴**: 순환형(첫 장면 회귀), 질문형(독자에게 뒤짒는 열린 끝), 절제형(한 문장 마무리)
  - **Vercel AI SDK**: `streamText()` for Phase 5 streaming

  **QA Scenarios**:
  ```
  Scenario: 전체 Phase 4+5 작동
    Tool: Bash (curl)
    Steps:
      1. Phase 3 결과로 POST /api/essay/phase4 {draft: "...", style: "story"}
      2. 리뷰 피드백 수신 (flow_critique + style_critique)
      3. POST /api/essay/phase5 {draft: "...", flow_critique: {...}, style_critique: {...}}
      4. 스트리밍 응답 수신
      5. 최종 길이 4000~5000자 확인
    Expected: 피드백 적용된 최종본, AI냄새 없음, 길이 유지
    Evidence: .sisyphus/evidence/task-15-phase45.json

  Scenario: AI냄새 제거 검증
    Tool: Bash
    Steps:
      1. 최종 에세이에서 금지어 6개 검색
    Expected: 0개 발견
    Evidence: .sisyphus/evidence/task-15-no-ai-smell.txt
  ```

  **Commit**: YES (T16과 함께)
  - Message: `feat(ai): complete 8-agent pipeline with orchestration`

- [ ] 16. **AI 파이프라인 오케스트레이션 (전체 5-phase 연결)**

  **What to do**:
  - 오케스트레이터 (`lib/pipeline/orchestrator.ts`):
    - 전체 5-phase 실행 조율: Phase1 → [user survey] → Phase2 → Phase3 → Phase4 → Phase5
    - HTTP 라운드트립 패턴: 각 phase가 별도 API 호출, 사용자 인터렉션 가능
    - PipelineState 관리 (진행상황 추적)
    - 에러 핸들링: 개별 phase 실패 시 재시도 (1회) + 사용자 알림
  - 클라이언트 파이프라인 훅 (`lib/pipeline/usePipeline.ts`):
    - React 훅: 파이프라인 상태 관리, 스트리밍 수신, 진행률 표시
    - `createUIMessageStream` 통합 — Phase 3/5 실시간 스트리밍
  - 컨텍스트 압축 (`lib/pipeline/context-compress.ts`):
    - phase간 컨텍스트 전달 시 토큰 절감
    - 핵심 정보만 추출하여 다음 phase에 전달

  **Must NOT do**:
  - ❌ 모든 phase를 하나의 API 호출로 처리 (반드시 HTTP 라운드트립)
  - ❌ 컨텍스트 압축 없이 전체 대화를 누적

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []
  - Reason: 복잡한 상태 기계 + 스트리밍 + 에러 핸들링 — 고도 논리

  **Parallelization**:
  - **Can Run In Parallel**: NO (T15 완료 필요)
  - **Blocks**: T21, T24
  - **Blocked By**: T10, T11, T12, T15 (모든 AI 에이전트)

  **References**:
  - **Vercel AI SDK 6**: HTTP 라운드트립 + createUIMessageStream + writer.write()
  - **Phase 입출력**: T10 Phase1 → questions[], T11 Phase2 → outline+toneGuide, T12 Phase3 → draft, T15 Phase4+5 → final
  - **컨텍스트 압축**: 프롬프트 캐싱 53% 절감 — static→dynamic 순서

  **QA Scenarios**:
  ```
  Scenario: 전체 파이프라인 E2E (API 레벨)
    Tool: Bash (curl)
    Steps:
      1. POST /api/essay/phase1 {content: "오늘 친구와 카페에 갔다", focus: "experience", style: "story"}
      2. 질문 수신 → POST /api/essay/phase2 {diary, survey_answers, focus, style}
      3. 아웃라인 수신 → POST /api/essay/phase3 {outline, toneGuide, diary, surveyAnswers}
      4. 초고 수신 → POST /api/essay/phase4 {draft, style}
      5. 피드백 수신 → POST /api/essay/phase5 {draft, flow_critique, style_critique}
      6. 최종 에세이 길이 확인
    Expected: 전체 파이프라인 성공, 4000~5000자 최종 에세이
    Evidence: .sisyphus/evidence/task-16-e2e-pipeline.json

  Scenario: Phase 실패 시 재시도
    Tool: Bash (curl)
    Steps:
      1. 잘못된 입력으로 Phase 3 호출 (빈 outline)
      2. 에러 응답 확인
    Expected: 명확한 에러 메시지 + 4xx 상태코드
    Evidence: .sisyphus/evidence/task-16-error-handling.txt
  ```

  **Commit**: YES (T15와 함께)
  - Message: `feat(ai): complete 8-agent pipeline with orchestration`

- [ ] 17. **설문 UI + 응답 수집 플로우**

  **What to do**:
  - 설문 페이지 (`app/write/survey/page.tsx`):
    - Phase 1 결과의 2~6개 질문을 카드형 UI로 표시
    - 각 질문에 대한 자유형 텍스트 입력 (스크랩북 스타일 입력칸)
    - 스킵 가능 (선택적 응답)
    - 진행률 표시 ("2/5 질문 응답 완료")
    - 숨솭이 반응 애니메이션 (질문마다 다른 포즈)
    - 제출 버튼 → Phase 2 API 호출

  **Must NOT do**:
  - ❌ 6개 초과 질문 표시
  - ❌ 필수 응답 강제 (모든 질문 스킵 가능)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
  - Reason: 설문 카드 UI + 애니메이션 + 스크랩북 스타일 — 디자인 집약

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 3, T18-T21과 병렬)
  - **Blocks**: T24
  - **Blocked By**: T5 (디자인), T10 (Phase 1 API)

  **References**:
  - **Phase 1 출력**: `types/agent.ts:SurveyQuestion[]` — question, type, agent_source
  - **디자인**: 스크랩북 카드형, 숨솭이 일러스트 포함
  - **컴포넌트**: `components/scrapbook/PaperNote.tsx` (T14) 활용

  **QA Scenarios**:
  ```
  Scenario: 설문 UI 렌더링 + 응답
    Tool: Playwright
    Steps:
      1. /write/survey?questions=[...] 접속
      2. 질문 카드 2~6개 표시 확인
      3. 첫 번째 질문에 텍스트 입력
      4. 두 번째 질문 스킵
      5. 제출 버튼 클릭
    Expected: 제출 성공, 스킵된 질문은 빈값으로 전달
    Evidence: .sisyphus/evidence/task-17-survey-ui.png
  ```

  **Commit**: YES (T18-T21과 함께)
  - Message: `feat(pages): all user-facing pages and flows`

- [ ] 18. **일기 입력 페이지 — PDF Page 1 재현**

  **What to do**:
  - 입력 페이지 (`app/write/page.tsx`):
    - 별패턴 배경 (sage green + dark stars)
    - 상단 브라운 레이스 리본 보더
    - 중앙-좌: 크림색 줄노트 + 골드 바인더클립 + 그린 별스티커 + 그린 마스킹테이프
    - textarea: 줄노트 위에 자연스럽게 배치, 필기체 폰트 (Gaegu/Nanum Pen Script)
    - 글자수 카운터 (0/2000), 100자 미만 시 안내 메시지
    - 중앙-우: 숨솭이 픽셀아트 + 레트로 키보드 + 말풍선
    - 말풍선: "오늘은 어떤 일이 있으셨나요? 숨솭이에게 말해주세요!"
    - 다음 버튼 → /write/style 이동

  **Must NOT do**:
  - ❌ PDF 디자인과 다른 레이아웃
  - ❌ 문자 수 제한 없이 무제한 입력 허용

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
  - Reason: PDF 디자인 재현 — 시각적 정확성 중요

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 3, T17/T19/T20과 병렬)
  - **Blocks**: T24
  - **Blocked By**: T5 (디자인), T6 (에셋), T14 (스크랩북 컴포넌트)

  **References**:
  - **PDF Page 1**: 정확한 레이아웃 참조 (sage green 별배경, 레이스, 노트, 숨솭이)
  - **컴포넌트**: StarBackground, LaceRibbon, PaperNote, MaskingTape (T14)
  - **에셋**: `public/assets/characters/sungsungi-keyboard.png`

  **QA Scenarios**:
  ```
  Scenario: 입력 페이지 PDF 재현 확인
    Tool: Playwright
    Steps:
      1. http://localhost:3000/write 접속
      2. 별패턴 배경 확인 (#9CAF88 sage green)
      3. 줄노트 textarea 존재 확인
      4. 숨솭이 이미지 표시 확인
      5. 200자 텍스트 입력
      6. 글자수 카운터 "200/2000" 표시 확인
    Expected: PDF Page 1과 일치하는 레이아웃
    Evidence: .sisyphus/evidence/task-18-input-page.png

  Scenario: 문자수 제한 검증
    Tool: Playwright
    Steps:
      1. 50자 입력 → "다음" 버튼 비활성화 또는 경고
      2. 100자 입력 → "다음" 버튼 활성화
      3. 2001자 입력 시도 → 2000자에서 절단
    Expected: 100~2000자 범위만 제출 가능
    Evidence: .sisyphus/evidence/task-18-char-limit.png
  ```

  **Commit**: YES (T17-T21과 함께)
  - Message: `feat(pages): all user-facing pages and flows`

- [ ] 19. **스타일 선택 페이지 — PDF Page 2 재현**

  **What to do**:
  - 스타일 페이지 (`app/write/style/page.tsx`):
    - 별패턴 배경 (PDF Page 2와 동일)
    - 초점 선택 2장 카드:
      - LEFT: "경험과 방문한 곳을 위주로" + 픽셀마우스 + 카페 일러스트
      - RIGHT: "내가 보고 느낌것 위주로" + 픽셀공룡 + 핑크하트 + 꽃다발
    - 필체 선택 4개 버튼: 질문형/나열형/단어형/스토리형
    - 숨솭이 말풍선: "어떤 스타일로 글을 작성할까요?"
    - 태그 노트 (크래프트 페이퍼 + 리본): "이걸 선택하시면 --님의 감정을 더 자세히..."
    - 에니메이션: 카드 선택 시 플립/바운스 효과
    - 다음 버튼 → Phase 1 API 호출 → /write/survey

  **Must NOT do**:
  - ❌ 초점과 필체 별도 페이지 (한 페이지에서 모두 선택)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
  - Reason: PDF Page 2 재현 + 카드 선택 애니메이션

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 3)
  - **Blocks**: T24
  - **Blocked By**: T5, T6, T14

  **References**:
  - **PDF Page 2**: 정확한 레이아웃 (2장 카드, 태그노트, 트와인 리본, 버튼)
  - **에셋**: `public/assets/characters/mouse-cafe.png`, `dinosaur-heart.png`
  - **필체 enum**: `types/essay.ts:WritingStyle` — question/list/word/story

  **QA Scenarios**:
  ```
  Scenario: 스타일 선택 페이지 렌더링
    Tool: Playwright
    Steps:
      1. http://localhost:3000/write/style 접속
      2. 2장 초점 카드 표시 확인 (experience/feeling)
      3. 4개 필체 버튼 표시 확인
      4. "경험" 카드 클릭 + "스토리형" 클릭
      5. "다음" 버튼 클릭
    Expected: 선택 애니메이션 + /write/survey로 이동
    Evidence: .sisyphus/evidence/task-19-style-page.png
  ```

  **Commit**: YES (T17-T21과 함께)

- [ ] 20. **개인 서랍 페이지 (저장된 에세이 목록)**

  **What to do**:
  - 서랍 페이지 (`app/drawer/page.tsx`):
    - 인증 필요 (T8 auth guard)
    - 에세이 목록: 카드형 그리드 (2열)
    - 각 카드: 날짜 + 제목 (에세이 첫 문장) + 초점/필체 태그 + 오늘의한마디
    - 정렬: 최신순 (기본)
    - 삭제: 스와이프 또는 드롭다운 메뉴
    - 빈 서랍: 숨솭이 일러스트 + "아직 작성한 에세이가 없어요" 메시지
    - 카드 클릭 → /essay/[id]로 이동

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
  - Reason: 에세이 카드 그리드 + 삭제 UX + 빈 상태 UI

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 3)
  - **Blocks**: T24
  - **Blocked By**: T5, T8 (Auth), T13 (CRUD API)

  **References**:
  - **API**: `GET /api/essay?user_id=xxx` — T13에서 구현
  - **디자인**: 스크랩북 카드 스타일, 크림색 배경
  - **숨솭이 에셋**: `public/assets/characters/sungsungi-*.png`

  **QA Scenarios**:
  ```
  Scenario: 서랍 에세이 목록 + 삭제
    Tool: Playwright
    Steps:
      1. 로그인 → /drawer 접속
      2. 에세이 카드 목록 확인
      3. 첫 번째 카드 클릭 → /essay/[id] 이동 확인
      4. 뒤로가기 → 서랍에서 에세이 삭제
      5. 삭제 확인 모달 → 확인 클릭
      6. 목록에서 사라진 것 확인
    Expected: 목록 표시 + 에세이 조회 + 삭제 성공
    Evidence: .sisyphus/evidence/task-20-drawer.png

  Scenario: 빈 서랍 상태
    Tool: Playwright
    Steps:
      1. 새 계정으로 로그인 → /drawer 접속
    Expected: 숨솭이 일러스트 + "아직 작성한 에세이가 없어요" 표시
    Evidence: .sisyphus/evidence/task-20-empty-drawer.png
  ```

  **Commit**: YES (T17-T21과 함께)

- [ ] 21. **수정 루프 시스템 (설문 재진행 → 재생성)**

  **What to do**:
  - 수정 요청 페이지 (`app/essay/[id]/edit/page.tsx`):
    - "수정할래요" 버튼 클릭 시 이동
    - Phase 1 다시 실행 (추가 설문 생성)
    - 이전 설문 응답 + 새 설문 응답 병합
    - Phase 2~5 재실행 (전체 파이프라인 재돌림)
    - revision_count +1 업데이트
  - 수정 API (`app/api/essay/[id]/revise/route.ts`):
    - POST: essay_id + 추가 설문 응답으로 재생성 트리거
    - 기존 에세이 보존 (revision history)
  - Phase 1 재실행 시 이전 컨텍스트 포함 (호기심/깊이 에이전트가 이전 답변 알고 새 질문 생성)

  **Must NOT do**:
  - ❌ 수정 횟수 제한 (Phase 1에서는 무제한)
  - ❌ 이전 에세이 덮어쓰기 (이전본 보존)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  - Reason: 파이프라인 재실행 + 컨텍스트 병합 + 이력 관리

  **Parallelization**:
  - **Can Run In Parallel**: NO (파이프라인 완성 필요)
  - **Blocks**: T24
  - **Blocked By**: T13, T16 (CRUD + 파이프라인)

  **References**:
  - **파이프라인**: `lib/pipeline/orchestrator.ts` (T16)
  - **CRUD**: `PATCH /api/essay/[id]` (T13) — revision_count 업데이트
  - **컨텍스트 병합**: 이전 설문응답 + 새 설문응답을 합쳐서 재생성

  **QA Scenarios**:
  ```
  Scenario: 수정 루프 전체 플로우
    Tool: Playwright + curl
    Steps:
      1. 에세이 생성 완료 후 "수정할래요" 클릭
      2. 새 설문 2~6개 표시 확인
      3. 새 설문 응답
      4. 재생성 스트리밍 확인
      5. 수정된 에세이 4000~5000자 확인
      6. revision_count = 1 확인
    Expected: 수정된 에세이 생성, 이전본 보존
    Evidence: .sisyphus/evidence/task-21-revision.json
  ```

  **Commit**: YES (T17-T21과 함께)
  - Message: `feat(pages): all user-facing pages and flows`

---

### Wave 4: Polish & UX (T22~T28)

- [ ] 22. **에세이 결과 페이지 — PDF Page 3 재현 + 봉투 애니메이션**

  **What to do**:
  - 결과 페이지 (`app/essay/[id]/page.tsx`):
    - 클로버 패턴 배경 (white/cream + green clover)
    - 좌: 레이스 리본, 그린 사틴 보우, 네잎클로버
    - 중앙-좌: 숨솭이 + 열린 봉투 + 꽃다발
    - 말풍선: "띐동~ --님! 숨솭이가 에세이를 가져왔어요!"
    - 우: 그리드노트 + 깅엄테이프 + 별스티커 (에세이 표시 영역)
  - 봉투 애니메이션:
    - View Transitions API 사용 (Next.js 16 네이티브 지원)
    - 편지봉투 닫힌 상태 → 열림 → 에세이 등장 시퀀스
    - CSS @keyframes + View Transitions 조합
    - 숨솭이가 봉투 들고 나타나는 애니메이션
  - 버튼: "수정할래요" / "이대로 완성!"
  - 에세이 텍스트: 필기체 폰트, 단락 구분 명확

  **Must NOT do**:
  - ❌ 애니메이션이 에세이 읽기 방해
  - ❌ 애니메이션 스킵 불가 (accessibility)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
  - Reason: PDF Page 3 재현 + 봉투 애니메이션 + View Transitions — 시각적 UX 집약

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 4, T23과 병렬)
  - **Blocks**: T24
  - **Blocked By**: T5, T6, T14

  **References**:
  - **PDF Page 3**: 정확한 레이아웃 (clover 배경, 봉투, 그리드노트)
  - **View Transitions**: Next.js 16 네이티브 지원 — `startViewTransition()` API
  - **에셋**: `public/assets/characters/sungsungi-envelope.png`

  **QA Scenarios**:
  ```
  Scenario: 봉투 애니메이션 + 에세이 표시
    Tool: Playwright
    Steps:
      1. 에세이 생성 완료 후 /essay/[id] 페이지 로드
      2. 봉투 애니메이션 재생 확인 (2~3초)
      3. 에세이 텍스트 표시 확인
      4. "수정할래요" / "이대로 완성!" 버튼 표시 확인
    Expected: 봉투 애니메이션 → 에세이 표시 → 버튼 작동
    Evidence: .sisyphus/evidence/task-22-envelope.png
  ```

  **Commit**: YES (T23과 함께)
  - Message: `feat(ux): envelope animation + today's word`

- [ ] 23. **오늘의 한마디 + 에세이 완성 플로우**

  **What to do**:
  - 완성 플로우 (`app/essay/[id]/complete/page.tsx`):
    - "이대로 완성!" 클릭 후 이동
    - "오늘의 한마디" 입력칸 (textarea, 선택적)
    - 숨솭이 응원 메시지: "잘 쓰셨어요! 오늘의 한마디를 남기실래요?"
    - 저장 분기:
      - 로그인 사용자: "서랍에 저장" 버튼 → /drawer로 이동
      - 게스트: 고유번호 생성 + PIN 설정 UI → 고유번호 표시 (카피 버튼)
    - PATCH /api/essay/[id] {todays_word: "..."} 호출

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
  - Reason: 완성 UX + 게스트 PIN 설정 UI

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 4, T22와 병렬)
  - **Blocks**: T24
  - **Blocked By**: T5

  **QA Scenarios**:
  ```
  Scenario: 오늘의 한마디 + 게스트 저장
    Tool: Playwright
    Steps:
      1. 에세이 완성 후 /essay/[id]/complete 이동
      2. "오늘의 한마디" 입력칸에 "감사한 하루" 입력
      3. 게스트 저장 플로우: PIN 4자리 입력
      4. 고유번호 표시 확인 (6자리 영숫자)
      5. 카피 버튼 클릭 → 클립보드 확인
    Expected: 한마디 저장 + 고유번호 생성 + PIN 설정 성공
    Evidence: .sisyphus/evidence/task-23-complete-guest.png
  ```

  **Commit**: YES (T22와 함께)
  - Message: `feat(ux): envelope animation + today's word`

- [ ] 24. **전체 플로우 통합 (입력→생성→전달→저장)**

  **What to do**:
  - 플로우 오케스트레이션 (`app/write/layout.tsx` + 페이지 네비게이션):
    - /write → /write/style → /write/survey → /essay/generating → /essay/[id] → /essay/[id]/complete
    - 각 단계간 상태 전달 (React Context 또는 URL params)
    - PIPA 동의 체크 (최초 1회)
    - 로딩 상태 UI (숨솭이 애니메이션 + 진행률 바)
  - 에러 바운더리:
    - API 실패 시 사용자 친화적 에러 페이지
    - 재시도 버튼
  - 네비게이션:
    - 헤더: 로고 + 홈/서랍/로그아웃 링크
    - 푸터: 약관 + 개인정보처리방침

  **Must NOT do**:
  - ❌ 페이지간 상태 손실 (일기 입력 → 스타일 선택 이동 시 입력 유지)
  - ❌ AI 동의 없이 에세이 생성 시작

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: [`frontend-ui-ux`]
  - Reason: 전체 플로우 통합 + 상태 관리 + 에러 핸들링 — 복잡도 높음

  **Parallelization**:
  - **Can Run In Parallel**: NO (모든 페이지 완성 후)
  - **Blocks**: F1-F4
  - **Blocked By**: T8, T9, T16-T23 (모든 페이지 + 파이프라인)

  **References**:
  - **모든 페이지**: T18 (write), T19 (style), T17 (survey), T22 (result), T23 (complete), T20 (drawer)
  - **파이프라인**: T16 orchestrator — `usePipeline()` 훅
  - **Auth**: T8 (email), T9 (guest) — 인증 상태에 따른 분기

  **QA Scenarios**:
  ```
  Scenario: 전체 E2E 플로우 (회원)
    Tool: Playwright
    Steps:
      1. /signup에서 회원가입
      2. /login에서 로그인
      3. /write에서 500자 일기 입력
      4. /write/style에서 경험+스토리형 선택
      5. /write/survey에서 설문 응답 (2개)
      6. AI 생성 스트리밍 확인
      7. /essay/[id]에서 봉투 애니메이션 + 에세이 확인
      8. "이대로 완성!" 클릭
      9. 오늘의 한마디 입력
      10. /drawer에서 저장된 에세이 확인
    Expected: 전체 플로우 에러 없이 완료
    Evidence: .sisyphus/evidence/task-24-e2e-member.png

  Scenario: 전체 E2E 플로우 (게스트)
    Tool: Playwright
    Steps:
      1. 로그인 없이 /write 접속
      2. 200자 일기 입력
      3. 스타일 선택 → 설문 응답 → 생성 → 완성
      4. PIN 설정 → 고유번호 확인
      5. 새 세션에서 /access로 고유번호+PIN 입력 → 에세이 조회
    Expected: 게스트 전체 플로우 완료
    Evidence: .sisyphus/evidence/task-24-e2e-guest.png
  ```

  **Commit**: YES
  - Message: `feat(integration): complete user flow end-to-end`

- [ ] 25. **모바일 반응형 최적화 (375px~)**

  **What to do**:
  - 전체 페이지 375px (iPhone SE) ~ 430px (iPhone 15 Pro Max) 테스트
  - 터치 타겟 최적화: 버튼 44px 최소, 입력칸 적절한 높이
  - 스크랩북 컴포넌트 반응형 조정 (lace, tape, note 크기)
  - 폰트 크기 조정 (textarea, 에세이 본문)
  - 서랍 그리드 2열 → 1열 (375px 이하)
  - 봉투 애니메이션 모바일 적응
  - Safe area 대응 (env(safe-area-inset-bottom))

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
  - Reason: 모바일 우선 반응형 — 시각적 튜닝

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 4)
  - **Blocks**: F3
  - **Blocked By**: T18-T23 (모든 페이지)

  **QA Scenarios**:
  ```
  Scenario: iPhone SE (375px) 전체 페이지 확인
    Tool: Playwright (viewport: 375x667)
    Steps:
      1. /write, /write/style, /write/survey, /essay/[id], /drawer 각각 접속
      2. 각 페이지에서 수평 스크롤 없음 확인
      3. 터치 타겟 크기 확인 (>= 44px)
    Expected: 모든 페이지 수평 오버플로우 없음
    Evidence: .sisyphus/evidence/task-25-mobile-375.png
  ```

  **Commit**: YES (T26-T28과 함께)
  - Message: `fix(polish): responsive, fonts, caching, privacy`

- [ ] 26. **한국어 폰트 최적화 + 성능 튜닝**

  **What to do**:
  - `next/font/google` 설정 확인 + 서브셋 최적화
  - Nanum Pen Script + Gaegu: `font-display: swap`, preload 설정
  - Noto Sans KR: 한글 자동 슬라이싱 (Next.js 16 네이티브)
  - Fallback: Apple SD Gothic Neo → Malgun Gothic → sans-serif
  - 이미지 최적화: next/image 사용, 픽셀아트 PNG quality 조정
  - Core Web Vitals 확인: LCP < 2.5s, CLS < 0.1
  - 번들 분석: `@next/bundle-analyzer`

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - Reason: 폰트 설정 + 이미지 최적화 — 표준 팩턴

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 4)
  - **Blocks**: F2
  - **Blocked By**: T5 (디자인 시스템)

  **QA Scenarios**:
  ```
  Scenario: 폰트 로딩 + 성능
    Tool: Playwright + Bash
    Steps:
      1. http://localhost:3000 접속
      2. document.fonts.check("16px 'Nanum Pen Script'") === true 확인
      3. bun run build && bun run start 후 Lighthouse 성능 점수
    Expected: 폰트 로딩 성공, LCP < 2.5s
    Evidence: .sisyphus/evidence/task-26-performance.txt
  ```

  **Commit**: YES (T25-T28과 함께)

- [ ] 27. **AI 프롬프트 캐싱 + 비용 최적화**

  **What to do**:
  - 프롬프트 캐싱 구조 적용:
    - 모든 에이전트: system prompt(정적, 캐시 가능) → persona(정적) → style guide(정적) → user input(동적) 순서
    - OpenAI API의 `cached_tokens` 응답 필드 모니터링
  - 비용 추적 미들웨어 (`lib/pipeline/cost-tracker.ts`):
    - 에세이당 입력/출력 토큰 수 기록
    - 캐시 히트율 추적
    - DB에 cost_metadata 저장 (agent_metadata jsonb 필드 활용)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  - Reason: 프롬프트 캐싱 구조 + 비용 추적 로직

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 4)
  - **Blocks**: F2
  - **Blocked By**: T16 (파이프라인 오케스트레이션)

  **QA Scenarios**:
  ```
  Scenario: 캐싱 히트율 확인
    Tool: Bash (curl)
    Steps:
      1. 동일 스타일로 2번 에세이 생성
      2. 2번째 요청의 agent_metadata에서 cached_tokens 확인
    Expected: cached_tokens > 0 (2번째 요청에서 캐시 히트)
    Evidence: .sisyphus/evidence/task-27-caching.json
  ```

  **Commit**: YES (T25-T28과 함께)

- [ ] 28. **PIPA 개인정보 동의 + AI 처리 동의 플로우**

  **What to do**:
  - PIPA 동의 컴포넌트 (`components/consent/PIPAConsent.tsx`):
    - 필수 동의 모달: AI 처리 동의 ("OpenAI Inc., USA"에 일기 내용 전달)
    - 동의 항목:
      - 개인정보 수집 동의 (일기 내용)
      - AI 처리 동의 (GPT-5-mini로 에세이 생성)
      - 해외 전송 동의 (OpenAI 서버, 미국)
    - 동의 상태 localStorage + DB 저장
    - 최초 1회만 표시 (이후 스킵)
  - 동의 체크 API (`app/api/consent/route.ts`):
    - POST: 동의 상태 저장
    - GET: 동의 여부 확인

  **Must NOT do**:
  - ❌ 동의 없이 AI API 호출
  - ❌ 동의 철회 불가능한 구조

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  - Reason: PIPA 준수 + 동의 플로우 — 법적 요구사항

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 4)
  - **Blocks**: F3
  - **Blocked By**: T8 (Auth)

  **QA Scenarios**:
  ```
  Scenario: PIPA 동의 플로우
    Tool: Playwright
    Steps:
      1. 새 사용자로 /write 접속
      2. PIPA 동의 모달 표시 확인
      3. "OpenAI Inc., USA" 텍스트 포함 확인
      4. 동의 클릭
      5. 입력 페이지 정상 접근 확인
      6. 페이지 새로고침 → 동의 모달 안나옴 확인 (이미 동의)
    Expected: 동의 필수, 동의 후 진행, 재방문시 스킵
    Evidence: .sisyphus/evidence/task-28-pipa.png

  Scenario: 동의 없이 API 호출 차단
    Tool: Bash (curl)
    Steps:
      1. 동의 없이 POST /api/essay/phase1 호출
    Expected: 403 Forbidden + "PIPA consent required"
    Evidence: .sisyphus/evidence/task-28-pipa-block.txt
  ```

  **Commit**: YES (T25-T28과 함께)
  - Message: `fix(polish): responsive, fonts, caching, privacy`
## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE.

- [ ] F1. **플랜 준수 감사** — `oracle`
  플랜의 모든 "Must Have" 항목을 코드에서 검증. 모든 "Must NOT Have" 위반 검색. evidence 파일 존재 확인. 8-에이전트 파이프라인 전체 작동 검증.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **코드 품질 리뷰** — `unspecified-high`
  `tsc --noEmit` + linter. as any, @ts-ignore, console.log in prod, 빈 catch, 주석처리 코드, 미사용 import 검사. AI 슬랍: 과도한 주석, 추상화, 제네릭 이름 검사.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | VERDICT`

- [ ] F3. **전체 플로우 QA** — `unspecified-high` + `playwright` skill
  클린 상태에서 시작. 모든 QA 시나리오 실행. 크로스-태스크 통합 테스트. 엣지 케이스: 빈 입력, 100자 최소입력, 2000자 최대입력, 잘못된 고유번호. `.sisyphus/evidence/final-qa/`에 저장.
  Output: `Scenarios [N/N pass] | Integration [N/N] | VERDICT`

- [ ] F4. **스코프 충실도 점검** — `deep`
  각 태스크: "What to do" vs 실제 diff 1:1 검증. Must NOT do 준수 확인. 태스크간 오염 검출. 미계획 변경 플래그.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | VERDICT`

---

## Commit Strategy

| Group | Message | Files |
|-------|---------|-------|
| T1-T2 | `chore(init): scaffold Next.js 16 project with env guide` | config files, .env.example |
| T3-T4 | `feat(db): add Supabase schema and TypeScript types` | drizzle/, types/ |
| T5-T6 | `feat(design): design system tokens and pixel art assets` | styles/, public/assets/ |
| T7 | `docs(business): add business plan document` | .sisyphus/plans/ |
| T8-T9 | `feat(auth): email auth + guest access with PIN` | app/api/auth/, app/access/ |
| T10-T12 | `feat(ai): multi-agent essay pipeline phases 1-3` | lib/agents/, app/api/essay/ |
| T13 | `feat(crud): diary and essay CRUD operations` | app/api/diary/, app/api/essay/ |
| T14 | `feat(ui): scrapbook background components` | components/scrapbook/ |
| T15-T16 | `feat(ai): complete 8-agent pipeline with orchestration` | lib/agents/, lib/pipeline/ |
| T17-T21 | `feat(pages): all user-facing pages and flows` | app/write/, app/essay/, app/drawer/ |
| T22-T23 | `feat(ux): envelope animation + today's word` | components/envelope/, app/essay/ |
| T24 | `feat(integration): complete user flow end-to-end` | app/ |
| T25-T28 | `fix(polish): responsive, fonts, caching, privacy` | various |

---

## MAU-Based Roadmap (서드파티 도입 계획)

| Phase | MAU | 서드파티 도입 | 월 비용 |
|-------|-----|-------------|---------|
| 1. 론칭 | 0~1K | OpenAI API + Supabase Free + Vercel Pro | ~$50-200 (AI만) |
| 2. 성장 | 1K~5K | + 카카오 OAuth | ~$200-500 |
| 3. 수익화 | 5K~10K | + Toss Payments + Supabase Pro | ~$545-800 + 구독수익 |
| 4. 확장 | 10K+ | + 구글 OAuth + 분석 + 크리에이터 | Pro 유지 + 수익 성장 |

---

## Success Criteria

### Verification Commands
```bash
# 빌드 성공
bun run build  # Expected: no errors

# 타입 체크
bunx tsc --noEmit  # Expected: no errors

# AI 에세이 생성 (curl)
curl -X POST http://localhost:3000/api/essay/generate \
  -H "Content-Type: application/json" \
  -d '{"content":"오늘 수족관에 갔다","focus":"experience","style":"story"}' \
  | jq '.essay | length'
# Expected: > 2000 (4000-5000자 = ~2000-3000 tokens)

# 게스트 접근
curl -X POST http://localhost:3000/api/access \
  -H "Content-Type: application/json" \
  -d '{"code":"AB12C3","pin":"1234"}'
# Expected: 200 + essay data

# 모바일 뷰포트
npx playwright test --project=mobile-chrome
# Expected: all pass
```

### Final Checklist
- [ ] 전체 유저플로우 E2E 작동
- [ ] AI 에세이 4가지 필체 모두 생성 확인
- [ ] 게스트 접근 (고유번호+PIN) 작동
- [ ] 개인 서랍 CRUD 작동
- [ ] PDF 디자인 3페이지 재현
- [ ] 모바일 375px 정상 렌더링
- [ ] 비즈니스 플랜 문서 완성
- [ ] .env.example 가이드 포함
- [ ] Must NOT Have 항목 모두 준수
