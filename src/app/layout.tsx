import type { Metadata } from "next"
import { Inter, Noto_Serif_KR, Space_Grotesk } from "next/font/google"
import localFont from "next/font/local"
import "@/styles/globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  variable: "--font-noto-serif",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SonderMaps",
  description:
    "Anonymous geo-storytelling platform. Discover stories left at real places around you.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} ${pretendard.variable} ${spaceGrotesk.variable} ${notoSerifKr.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
