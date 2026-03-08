import type { EssayFocus, WritingStyle, SurveyAnswer } from './essay'

// === 에세이 생성 API ===
export interface GenerateEssayPhase1Request {
  diaryContent: string    // 100~2000자
  focus: EssayFocus
  style: WritingStyle
}

export interface GenerateEssayPhase2Request {
  diaryContent: string
  focus: EssayFocus
  style: WritingStyle
  surveyAnswers: SurveyAnswer[]
}

export interface GenerateEssayPhase3Request {
  diaryContent: string
  focus: EssayFocus
  style: WritingStyle
  surveyAnswers: SurveyAnswer[]
  outline: unknown      // Phase2Result.outline
  toneGuide: unknown    // Phase2Result.toneGuide
}

// === CRUD API ===
export interface CreateDiaryRequest {
  content: string   // 100~2000자 검증
}

export interface CreateEssayRequest {
  diaryId: string
  content: string
  focus: EssayFocus
  style: WritingStyle
  surveyData?: unknown
  agentMetadata?: unknown
  isGuest?: boolean
}

export interface UpdateEssayRequest {
  todaysWord?: string
  revisionCount?: number
}

// === 게스트 접근 API ===
export interface GuestAccessRequest {
  code: string    // 6자리 영숫자
  pin: string     // 4자리 숫자
}

// === 공통 응답 ===
export interface ApiError {
  error: string
  code?: string
}

export interface ApiSuccess<T = void> {
  data: T
  message?: string
}
