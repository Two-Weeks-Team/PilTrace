import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CloverBackground } from '@/components/scrapbook'
import { PaperNote } from '@/components/scrapbook'
import { MaskingTape } from '@/components/scrapbook'
import { ShareButton } from '@/components/scrapbook/ShareButton'
// LaceRibbon removed

const STYLE_LABELS: Record<string, string> = {
  story: '스토리형',
  question: '질문형',
  list: '나열형',
  word: '단어형',
}

const FOCUS_LABELS: Record<string, string> = {
  experience: '경험',
  feeling: '감정',
}

interface Essay {
  id: string
  content: string
  focus: string
  style: string
  todays_word: string | null
  unique_code: string | null
  revision_count: number
  created_at: string
  diary_id: string | null
  user_id: string | null
}

async function getEssay(id: string): Promise<Essay | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/essay/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    const json = await res.json()
    return json.data
  } catch {
    return null
  }
}
export default async function EssayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const essay = await getEssay(id)

  if (!essay) {
    notFound()
  }

  const createdDate = new Date(essay.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const paragraphs = essay.content.split('\n').filter(p => p.trim())

  return (
    <CloverBackground>
      {/* top decoration removed */}

      <div className="min-h-screen p-4 py-12">
        {/* Header */}
        <div className="max-w-lg mx-auto mb-6">
          <MaskingTape variant="gingham" rotation={1} className="inline-block mb-3">
            <span className="text-xs font-handwriting" style={{ color: 'var(--star-brown)' }}>
              {createdDate}
            </span>
          </MaskingTape>

          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{ backgroundColor: 'var(--sage-green)', color: 'var(--cream)' }}
            >
              {STYLE_LABELS[essay.style] || essay.style}
            </span>
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{ backgroundColor: 'var(--clover-green)', color: 'var(--cream)' }}
            >
              {FOCUS_LABELS[essay.focus] || essay.focus}
            </span>
            {essay.revision_count > 0 && (
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: 'var(--earthy-brown)', color: 'var(--cream)' }}
              >
                수정 {essay.revision_count}회
              </span>
            )}
          </div>
        </div>

        {/* Essay Content */}
        <PaperNote variant="grid" className="max-w-lg mx-auto p-6 mb-6">
          <div className="space-y-4">
            {paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className="text-sm leading-relaxed"
                style={{ color: 'var(--earthy-brown)' }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Today's word */}
          {essay.todays_word && (
            <div
              className="mt-6 pt-4 border-t"
              style={{ borderColor: 'var(--earthy-brown)', opacity: 0.4 }}
            >
              <p className="text-xs font-handwriting mb-1" style={{ color: 'var(--star-brown)' }}>
                오늘의 한마디
              </p>
              <p
                className="text-sm italic font-handwriting"
                style={{ color: 'var(--earthy-brown)' }}
              >
                &ldquo;{essay.todays_word}&rdquo;
              </p>
            </div>
          )}
        </PaperNote>

        {/* Guest unique code */}
        {essay.unique_code && (
          <div className="max-w-lg mx-auto mb-4">
            <PaperNote variant="kraft" className="p-4 text-center">
              <p className="text-xs mb-1" style={{ color: 'var(--earthy-brown)', opacity: 0.6 }}>
                나중에 이 에세이를 찾으려면
              </p>
              <p className="text-2xl font-handwriting tracking-widest" style={{ color: 'var(--star-brown)' }}>
                {essay.unique_code}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--earthy-brown)', opacity: 0.5 }}>
                고유번호를 기억해두세요
              </p>
            </PaperNote>
          </div>
        )}

        {/* Action buttons */}
        <div className="max-w-lg mx-auto flex flex-col gap-3">
          <ShareButton essayId={essay.id} existingCode={essay.unique_code} />

          <Link
            href={`/essay/${essay.id}/edit`}
            className="w-full py-3 rounded-full text-center text-sm font-medium border"
            style={{
              borderColor: 'var(--sage-green)',
              color: 'var(--sage-green)',
              backgroundColor: 'transparent',
            }}
          >
            ✍️ 수정 요청하기
          </Link>

          <Link
            href="/write"
            className="w-full py-3 rounded-full text-center text-sm font-medium"
            style={{
              backgroundColor: 'var(--sage-green)',
              color: 'var(--cream)',
            }}
          >
            <span className="flex items-center justify-center gap-1"><Image src="/assets/characters/sungsungi-keyboard.svg" alt="" width={20} height={20} className="pixel-art inline" style={{ imageRendering: 'pixelated' }} /> 새 에세이 쓰기</span>
          </Link>

          <Link
            href="/drawer"
            className="w-full py-3 rounded-full text-center text-sm"
            style={{ color: 'var(--earthy-brown)', opacity: 0.6 }}
          >
            서랍 보기 →
          </Link>
        </div>
      </div>

      {/* bottom decoration removed */}
    </CloverBackground>
  )
}
