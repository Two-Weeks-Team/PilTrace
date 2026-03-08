import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import type { EssayFocus, WritingStyle } from '@/types/essay'
import type { EssayOutline } from './architect-agent'
import type { ToneGuide } from './tone-calibrator-agent'

export async function runWriterAgent(
  diary: string,
  surveyAnswers: string[],
  outline: EssayOutline,
  toneGuide: ToneGuide,
  focus: EssayFocus,
  style: WritingStyle
) {
  const outlineText = outline.sections
    .map((s, i) => `${i + 1}. ${s.title}: ${s.keyPoints.join(', ')}`)
    .join('\n')

  return streamText({
    model: openai('gpt-4o-mini'),
    system: `당신은 한국어 에세이 작가입니다. 4000~5000자의 감성 에세이를 씁니다.
규칙:
- 반드시 4000~5000자 (한국어 기준)
- 사용자 일기의 단어와 표현을 자연스럽게 포함
- 장면 표현: "행복했다" → "입꼬리가 올라갔다"
- 금지어: 흥미롭게도, 중요한 것은, 다양한, 결론적으로, 존재합니다
- 마지막 문단: 여운 있는 마무리
- ${toneGuide.rhythmGuide}`,
    prompt: `일기: ${diary}
설문 응답: ${surveyAnswers.join('\n')}
아웃라인:
${outlineText}
문체 가이드: ${toneGuide.styleNotes}

위 내용을 바탕으로 4000~5000자의 한국어 에세이를 써주세요.`,
  })
}
