import Link from 'next/link'
import Image from 'next/image'
import { requireAuth } from '@/lib/auth-guard'
import { CloverBackground } from '@/components/scrapbook'
import { PaperNote } from '@/components/scrapbook'
import { MaskingTape } from '@/components/scrapbook'

export default async function DrawerPage() {
  const user = await requireAuth()

  // Fetch essays from API
  let essays: Array<{
    id: string
    content: string
    style: string
    created_at: string
    todays_word: string | null
  }> = []
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/essay?user_id=${user.id}`, {
      cache: 'no-store',
    })
    if (response.ok) {
      essays = await response.json()
    }
  } catch {
    // DB not connected yet — show empty state
  }

  return (
    <CloverBackground>
      <div className="min-h-screen p-4 py-8">
        {/* Header */}
        <div className="max-w-lg mx-auto mb-6">
          <MaskingTape variant="green" rotation={-1} className="inline-block mb-3">
            <span className="text-xs font-handwriting" style={{ color: 'var(--star-brown)' }}>
              나의 서랍
            </span>
          </MaskingTape>
          <h1 className="text-2xl font-handwriting" style={{ color: 'var(--star-brown)' }}>
            저장된 에세이
          </h1>
        </div>

        {/* Essay list */}
        <div className="max-w-lg mx-auto space-y-4">
          {essays.length === 0 ? (
            <PaperNote variant="lined" className="p-6 text-center">
              <p className="text-sm" style={{ color: 'var(--earthy-brown)', opacity: 0.6 }}>
              <div className="mb-3 flex justify-center">
                <Image src="/assets/characters/mouse-cafe.svg" alt="마우스" width={48} height={48} className="pixel-art" style={{ imageRendering: 'pixelated' }} />
              </div>
                아직 저장된 에세이가 없어요.
              </p>
              <Link
                href="/write"
                className="inline-block mt-4 px-6 py-2 rounded-full text-sm"
                style={{ backgroundColor: 'var(--sage-green)', color: 'var(--cream)' }}
              >
                첫 에세이 쓰기
              </Link>
            </PaperNote>
          ) : (
            essays.map(essay => (
              <Link key={essay.id} href={`/essay/${essay.id}`}>
                <PaperNote variant="lined" className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: 'var(--sage-green)', color: 'var(--cream)' }}
                    >
                      {essay.style}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--earthy-brown)', opacity: 0.5 }}>
                      {new Date(essay.created_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <p
                    className="text-sm leading-relaxed line-clamp-3"
                    style={{ color: 'var(--earthy-brown)' }}
                  >
                    {essay.content.slice(0, 150)}...
                  </p>
                  {essay.todays_word && (
                    <p
                      className="mt-2 text-xs italic"
                      style={{ color: 'var(--earthy-brown)', opacity: 0.6 }}
                    >
                      오늘의 한마디: {essay.todays_word}
                    </p>
                  )}
                </PaperNote>
              </Link>
            ))
          )}
        </div>
      </div>
    </CloverBackground>
  )
}
