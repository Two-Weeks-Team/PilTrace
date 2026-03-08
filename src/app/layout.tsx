import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notoSansKR, gaegu } from "@/lib/fonts";
import "./globals.css";
import GlobalNav from '@/components/GlobalNav'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PilTrace — AI 에세이 저널링",
  description: "오늘의 이야기를 에세이로. 숭숭이와 함께하는 AI 저널링 서비스.",
};

export const viewport: Viewport = {
  themeColor: '#9CAF88',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable} ${gaegu.variable} antialiased`}
      >
        {children}
        <GlobalNav />
      </body>
    </html>
  );
}
