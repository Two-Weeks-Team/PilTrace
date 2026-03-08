import { runArchitectAgent, type EssayOutline } from './architect-agent'
import { runToneCalibratorAgent, type ToneGuide } from './tone-calibrator-agent'
import type { EssayFocus, WritingStyle } from '@/types/essay'

export interface Phase2Result {
  outline: EssayOutline
  toneGuide: ToneGuide
}

export async function runPhase2Planning(
  diary: string,
  surveyAnswers: string[],
  focus: EssayFocus,
  style: WritingStyle
): Promise<Phase2Result> {
  const [outline, toneGuide] = await Promise.all([
    runArchitectAgent(diary, surveyAnswers, focus, style),
    runToneCalibratorAgent(style, diary),
  ])
  return { outline, toneGuide }
}
