import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import type { WritingStyle } from '@/types/essay'
import type { FlowCritique } from './flow-editor-agent'
import type { StyleCritique } from './style-auditor-agent'

export function runPolisherAgent(
  draft: string,
  flowCritique: FlowCritique,
  styleCritique: StyleCritique,
  style: WritingStyle
) {
  const flowIssues = flowCritique.issues
    .map(i => `- ${i.location}: ${i.suggestion}`)
    .join('\n')
  
  const styleIssues = styleCritique.aiSmellIssues
    .map(i => `- "${i.original}" → "${i.replacement}"`)
    .join('\n')

  return streamText({
    model: openai('gpt-4o-mini'),
    system: `당신은 한국어 에세이 퇴고 전문가입니다. 편집자 피드백을 반영하여 최종 에세이를 완성합니다.
규칙:
- 반드시 4000~5000자 유지
- 원문의 핵심 의미 보존
- 여운 있는 마무리 (순환형/질문형/절제형 중 자연스러운 선택)
- 금지어: 흥미롭게도, 중요한 것은, 다양한, 결론적으로, 존재합니다`,
    prompt: `필체: ${style}

원본 에세이:
${draft}

흐름 수정 사항:
${flowIssues}

문체 수정 사항:
${styleIssues}

위 피드백을 반영하여 최종 에세이를 완성해주세요.`,
  })
}
