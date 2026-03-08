import type { EssayFocus, WritingStyle } from '@/types/essay'

export type PipelinePhase = 
  | 'idle'
  | 'phase1'
  | 'survey'
  | 'phase2'
  | 'phase3'
  | 'phase4'
  | 'phase5'
  | 'complete'
  | 'error'

export interface PipelineState {
  phase: PipelinePhase
  questions: string[]
  surveyAnswers: string[]
  outline: unknown | null
  toneGuide: unknown | null
  draft: string
  flowCritique: unknown | null
  styleCritique: unknown | null
  finalEssay: string
  error: string | null
  isStreaming: boolean
}

export const initialPipelineState: PipelineState = {
  phase: 'idle',
  questions: [],
  surveyAnswers: [],
  outline: null,
  toneGuide: null,
  draft: '',
  flowCritique: null,
  styleCritique: null,
  finalEssay: '',
  error: null,
  isStreaming: false,
}

export interface PipelineInput {
  diary: string
  focus: EssayFocus
  style: WritingStyle
}

// Phase 1: Generate survey questions
export async function runPipelinePhase1(input: PipelineInput): Promise<string[]> {
  const response = await fetch('/api/essay/phase1', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: input.diary,
      focus: input.focus,
      style: input.style,
    }),
  })
  if (!response.ok) throw new Error('Phase 1 failed')
  const data = await response.json()
  return data.questions
}

// Phase 2: Generate outline + tone guide
export async function runPipelinePhase2(
  input: PipelineInput,
  surveyAnswers: string[]
): Promise<{ outline: unknown; toneGuide: unknown }> {
  const response = await fetch('/api/essay/phase2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      diary: input.diary,
      survey_answers: surveyAnswers,
      focus: input.focus,
      style: input.style,
    }),
  })
  if (!response.ok) throw new Error('Phase 2 failed')
  return response.json()
}

// Phase 3: Stream draft essay
export async function runPipelinePhase3(
  input: PipelineInput,
  surveyAnswers: string[],
  outline: unknown,
  toneGuide: unknown,
  onChunk: (chunk: string) => void
): Promise<string> {
  const response = await fetch('/api/essay/phase3', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      diary: input.diary,
      survey_answers: surveyAnswers,
      outline,
      tone_guide: toneGuide,
      focus: input.focus,
      style: input.style,
    }),
  })
  if (!response.ok) throw new Error('Phase 3 failed')
  
  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response body')
  
  const decoder = new TextDecoder()
  let fullText = ''
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    fullText += chunk
    onChunk(chunk)
  }
  
  return fullText
}

// Phase 4: Review draft
export async function runPipelinePhase4(
  draft: string,
  style: WritingStyle
): Promise<{ flowCritique: unknown; styleCritique: unknown }> {
  const response = await fetch('/api/essay/phase4', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ draft, style }),
  })
  if (!response.ok) throw new Error('Phase 4 failed')
  return response.json()
}

// Phase 5: Stream final essay
export async function runPipelinePhase5(
  draft: string,
  flowCritique: unknown,
  styleCritique: unknown,
  style: WritingStyle,
  onChunk: (chunk: string) => void
): Promise<string> {
  const response = await fetch('/api/essay/phase5', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      draft,
      flow_critique: flowCritique,
      style_critique: styleCritique,
      style,
    }),
  })
  if (!response.ok) throw new Error('Phase 5 failed')
  
  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response body')
  
  const decoder = new TextDecoder()
  let fullText = ''
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    fullText += chunk
    onChunk(chunk)
  }
  
  return fullText
}
