'use client'

import { useState, useCallback } from 'react'
import {
  initialPipelineState,
  runPipelinePhase1,
  runPipelinePhase2,
  runPipelinePhase3,
  runPipelinePhase4,
  runPipelinePhase5,
  type PipelineState,
  type PipelineInput,
} from './orchestrator'

export function usePipeline() {
  const [state, setState] = useState<PipelineState>(initialPipelineState)

  const updateState = useCallback((updates: Partial<PipelineState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const startPhase1 = useCallback(async (input: PipelineInput) => {
    updateState({ phase: 'phase1', error: null })
    try {
      const questions = await runPipelinePhase1(input)
      updateState({ phase: 'survey', questions })
      return questions
    } catch (err) {
      updateState({ phase: 'error', error: String(err) })
      throw err
    }
  }, [updateState])

  const submitSurvey = useCallback(async (
    input: PipelineInput,
    surveyAnswers: string[]
  ) => {
    updateState({ phase: 'phase2', surveyAnswers })
    try {
      const { outline, toneGuide } = await runPipelinePhase2(input, surveyAnswers)
      updateState({ phase: 'phase3', outline, toneGuide })
      
      // Phase 3: Stream draft
      updateState({ isStreaming: true, draft: '' })
      let draftAccum = ''
      const draft = await runPipelinePhase3(
        input,
        surveyAnswers,
        outline,
        toneGuide,
        (chunk) => {
          draftAccum += chunk
          updateState({ draft: draftAccum })
        }
      )
      updateState({ isStreaming: false, draft })
      
      // Phase 4: Review
      updateState({ phase: 'phase4' })
      const { flowCritique, styleCritique } = await runPipelinePhase4(draft, input.style)
      updateState({ flowCritique, styleCritique })
      
      // Phase 5: Polish
      updateState({ phase: 'phase5', isStreaming: true, finalEssay: '' })
      let finalAccum = ''
      const finalEssay = await runPipelinePhase5(
        draft,
        flowCritique,
        styleCritique,
        input.style,
        (chunk) => {
          finalAccum += chunk
          updateState({ finalEssay: finalAccum })
        }
      )
      updateState({ phase: 'complete', isStreaming: false, finalEssay })
      return finalEssay
    } catch (err) {
      updateState({ phase: 'error', error: String(err), isStreaming: false })
      throw err
    }
  }, [updateState])

  const reset = useCallback(() => {
    setState(initialPipelineState)
  }, [])

  return { state, startPhase1, submitSurvey, reset }
}
