import { Noto_Sans_KR, Gaegu } from 'next/font/google'

export const notoSansKR = Noto_Sans_KR({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans-kr',
  preload: false,  // 한글 폰트는 preload 하지 않음 (크기 큼)
})

export const gaegu = Gaegu({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-gaegu',
  preload: false,
})

// Nanum Pen Script는 variable font 미지원, 직접 import
// src/app/layout.tsx에서 <link> 태그로 추가
export const nanumPenFontUrl = 'https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap'
