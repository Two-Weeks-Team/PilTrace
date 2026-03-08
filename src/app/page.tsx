import Link from 'next/link'
import Image from 'next/image'
import { StarBackground } from '@/components/scrapbook'
import { LaceRibbon } from '@/components/scrapbook'
import { MaskingTape } from '@/components/scrapbook'
import { PaperNote } from '@/components/scrapbook'

export default function HomePage() {
  return (
    <StarBackground>
      {/* Top lace ribbon */}
      <LaceRibbon position="top" />
      
      <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
        {/* Masking tape header decoration */}
        <MaskingTape variant="green" rotation={-2} className="mb-4">
          <span className="text-xs font-handwriting" style={{ color: 'var(--star-brown)' }}>
            오늘의 일기
          </span>
        </MaskingTape>

        {/* Main notepad */}
        <PaperNote variant="lined" clip sticker className="w-full max-w-sm">
          <div className="p-6 text-center">
            {/* Sungsungi character pixel art */}
            <div className="mb-4 flex justify-center">
              <Image
                src="/assets/characters/sungsungi-keyboard.svg"
                alt="숭숭이 - 키보드 앞에 앉아있는 원숭이"
                width={64}
                height={64}
                className="pixel-art"
                style={{ imageRendering: 'pixelated' }}
                priority
              />
            </div>
            
            <h1
              className="text-3xl font-handwriting mb-2"
              style={{ color: 'var(--star-brown)' }}
            >
              필트레이스
            </h1>
            <p
              className="text-sm mb-6 leading-relaxed"
              style={{ color: 'var(--earthy-brown)' }}
            >
              오늘 하루를 적어주세요.
              <br />
              숭숭이가 감성 에세이로 만들어드릴게요 ✨
            </p>

            <Link
              href="/write"
              className="inline-block px-8 py-3 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor: 'var(--sage-green)',
                color: 'var(--cream)',
              }}
            >
              일기 쓰기 시작하기
            </Link>
          </div>
        </PaperNote>

        {/* Guest access link */}
        <div className="mt-6 text-center">
          <Link
            href="/access"
            className="text-xs underline"
            style={{ color: 'var(--cream)', opacity: 0.7 }}
          >
            고유번호로 에세이 찾기
          </Link>
          <span className="mx-2 text-xs" style={{ color: 'var(--cream)', opacity: 0.5 }}>|</span>
          <Link
            href="/login"
            className="text-xs underline"
            style={{ color: 'var(--cream)', opacity: 0.7 }}
          >
            로그인
          </Link>
        </div>
      </div>

      {/* Bottom lace ribbon */}
      <LaceRibbon position="bottom" />
    </StarBackground>
  )
}
