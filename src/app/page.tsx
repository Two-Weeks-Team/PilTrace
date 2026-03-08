import Link from 'next/link'
import Image from 'next/image'
import { StarBackground } from '@/components/scrapbook'
import { MaskingTape } from '@/components/scrapbook'
import { PaperNote } from '@/components/scrapbook'
import { getServerUser } from '@/lib/auth-guard'

export default async function HomePage() {
  const user = await getServerUser()
  return (
    <StarBackground>
      
      <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
        {/* Masking tape header decoration */}
        <MaskingTape variant="green" rotation={-2} className="mb-6">
          <span className="text-sm font-handwriting tracking-wide" style={{ color: 'var(--star-brown)' }}>
            오늘의 일기
          </span>
        </MaskingTape>

        {/* Main notepad */}
        <PaperNote variant="lined" clip sticker className="w-full max-w-md">
          <div className="p-8 text-center">
            {/* Sungsungi character pixel art */}
            <div className="mb-6 flex justify-center">
              <Image
                src="/assets/characters/sungsungi-keyboard.svg"
                alt="승승이 - 키보드 앞에 앉아있는 원슭이"
                width={128}
                height={128}
                className="pixel-art drop-shadow-md"
                style={{ imageRendering: 'pixelated' }}
                priority
              />
            </div>
            
            <h1
              className="text-4xl font-handwriting mb-3"
              style={{ color: 'var(--star-brown)' }}
            >
              필적(筆跡)
            </h1>
            <p
              className="text-base mb-8 leading-relaxed"
              style={{ color: 'var(--earthy-brown)' }}
            >
              오늘 하루를 적어주세요.
              <br />
              승승이가 감성 에세이로 만들어드릴게요 ✨
            </p>

            {user ? (
              /* 로그인 상태: 서랍/새 에세이 */
              <div className="flex flex-col gap-3 w-full">
                <Link
                  href="/write"
                  className="inline-block px-10 py-3.5 rounded-full text-base font-medium transition-all hover:opacity-85 hover:scale-[1.02] shadow-sm text-center"
                  style={{
                    backgroundColor: 'var(--sage-green)',
                    color: 'var(--cream)',
                  }}
                >
                  새 에세이 쓰기
                </Link>
                <Link
                  href="/drawer"
                  className="inline-block px-10 py-3 rounded-full text-sm font-medium transition-all hover:opacity-85 text-center border"
                  style={{
                    borderColor: 'var(--sage-green)',
                    color: 'var(--sage-green)',
                    backgroundColor: 'transparent',
                  }}
                >
                  내 서랍 보기
                </Link>
              </div>
            ) : (
              /* 비로그인 상태: 시작하기 */
              <Link
                href="/write"
                className="inline-block px-10 py-3.5 rounded-full text-base font-medium transition-all hover:opacity-85 hover:scale-[1.02] shadow-sm"
                style={{
                  backgroundColor: 'var(--sage-green)',
                  color: 'var(--cream)',
                }}
              >
                일기 쓰기 시작하기
              </Link>
            )}

          </div>
        </PaperNote>

        {/* Bottom links */}
        <div className="mt-8 text-center">
          <Link
            href="/access"
            className="text-sm underline underline-offset-2 transition-opacity hover:opacity-100"
            style={{ color: '#F5F0E8', opacity: 0.85 }}
          >
            고유번호로 에세이 찾기
          </Link>
          {!user && (
            <>
              <span className="mx-3 text-sm" style={{ color: '#F5F0E8', opacity: 0.5 }}>|</span>
              <Link
                href="/login"
                className="text-sm underline underline-offset-2 transition-opacity hover:opacity-100"
                style={{ color: '#F5F0E8', opacity: 0.85 }}
              >
                로그인
              </Link>
            </>
          )}
        </div>
      </div>

    </StarBackground>
  )
}
