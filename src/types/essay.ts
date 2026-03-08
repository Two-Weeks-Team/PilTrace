// 에세이 초점 (PDF Page 2 선택 카드)
export type EssayFocus = 'experience' | 'feeling'

// 필체 (PDF Page 2 버튼)
export type WritingStyle = 'question' | 'list' | 'word' | 'story'

// 설문 질문
export interface SurveyQuestion {
  id: string
  text: string
  type: 'open'           // 자유형 텍스트
  agentSource: 'curiosity' | 'depth'  // 어느 에이전트가 생성했는지
  order: number
}

// 설문 응답
export interface SurveyAnswer {
  questionId: string
  text: string
  skipped: boolean
}

// 에이전트 메타데이터 (비용 추적)
export interface AgentMetadata {
  totalTokens: number
  totalCost: number   // USD
  cachedTokens: number
  phases: {
    phase: number
    agentName: string
    inputTokens: number
    outputTokens: number
    cachedTokens: number
    cost: number
  }[]
}

// 에세이 도메인 타입
export interface Essay {
  id: string
  diaryId: string
  userId: string | null       // null = 게스트
  uniqueCode: string | null   // 게스트 접근 코드
  content: string             // 4000~5000자
  focus: EssayFocus
  style: WritingStyle
  todaysWord: string | null
  surveyData: { questions: SurveyQuestion[]; answers: SurveyAnswer[] } | null
  revisionCount: number
  agentMetadata: AgentMetadata | null
  createdAt: Date
  updatedAt: Date
}

// 일기 도메인 타입
export interface Diary {
  id: string
  userId: string | null
  content: string   // 100~2000자
  createdAt: Date
}
