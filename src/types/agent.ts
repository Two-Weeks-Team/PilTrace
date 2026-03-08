import type { EssayFocus, WritingStyle, SurveyQuestion, SurveyAnswer } from './essay'

// 파이프라인 Phase 번호
export type PhaseNumber = 1 | 2 | 3 | 4 | 5

// 개별 에이전트 결과
export interface AgentResult<T = unknown> {
  agentName: string
  phase: PhaseNumber
  data: T
  inputTokens: number
  outputTokens: number
  cachedTokens: number
  cost: number
  latencyMs: number
}

// Phase 1 결과: 설문 질문
export interface Phase1Result {
  questions: SurveyQuestion[]
}

// Phase 2 결과: 아웃라인 + 톤 가이드
export interface Phase2Result {
  outline: {
    structure: 'narrative' | 'question' | 'story' | 'descriptive'
    sections: {
      title: string
      purpose: string
      keyPoints: string[]
    }[]
    totalSections: number
  }
  toneGuide: {
    style: WritingStyle
    rhythm: string           // "short(10-20자)+long(40-60자) alternating"
    forbiddenWords: string[] // AI 냄새 금지어
    sentenceEnding: string   // 해요체
    closingPattern: string   // 여운 패턴
  }
}

// Phase 3 결과: 초고
export interface Phase3Result {
  draft: string    // 4000~5000자
  wordCount: number
}

// Phase 4 결과: 리뷰 피드백
export interface Phase4Result {
  flowCritique: {
    issues: string[]
    suggestions: string[]
    narrativeScore: number  // 1-10
  }
  styleCritique: {
    issues: string[]
    suggestions: string[]
    aiSmellWords: string[]  // 발견된 금지어
    styleScore: number      // 1-10
  }
}

// Phase 5 결과: 최종 에세이
export interface Phase5Result {
  essay: string    // 4000~5000자
  wordCount: number
}

// 전체 파이프라인 상태
export type PipelineStatus = 
  | 'idle'
  | 'phase1'      // 설문 생성 중
  | 'survey'      // 사용자 설문 응답 대기
  | 'phase2'      // 기획 중
  | 'phase3'      // 초고 작성 중 (스트리밍)
  | 'phase4'      // 교정 중
  | 'phase5'      // 퇴고 중 (스트리밍)
  | 'complete'    // 완료
  | 'error'       // 오류

export interface PipelineState {
  status: PipelineStatus
  essayId?: string
  phase1?: AgentResult<Phase1Result>
  phase2?: AgentResult<Phase2Result>
  phase3?: AgentResult<Phase3Result>
  phase4?: AgentResult<Phase4Result>
  phase5?: AgentResult<Phase5Result>
  streamingContent?: string   // 현재 스트리밍 중인 텍스트
  error?: string
}

// API에 전달하는 파이프라인 입력
export interface PipelineInput {
  diary: string
  focus: EssayFocus
  style: WritingStyle
  surveyAnswers?: SurveyAnswer[]
}
