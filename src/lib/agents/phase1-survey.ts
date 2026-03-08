import { runCuriosityAgent } from './curiosity-agent'
import { runDepthAgent } from './depth-agent'
import type { EssayFocus, WritingStyle } from '@/types/essay'

export interface Phase1Result {
  questions: string[]
}

export async function runPhase1Survey(
  diary: string,
  focus: EssayFocus,
  style: WritingStyle
): Promise<Phase1Result> {
  const [curiosityQs, depthQs] = await Promise.all([
    runCuriosityAgent(diary, focus, style),
    runDepthAgent(diary, focus, style),
  ])

  // Merge and deduplicate
  const allQuestions = [...curiosityQs, ...depthQs]
  const unique = allQuestions.filter((q, i) => {
    return !allQuestions.slice(0, i).some(prev => 
      prev.slice(0, 10) === q.slice(0, 10)
    )
  })

  // Limit to 6
  return { questions: unique.slice(0, 6) }
}
