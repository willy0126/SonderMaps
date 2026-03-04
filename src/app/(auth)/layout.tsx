import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Left panel — branding (lg+) */}
      <div className="relative hidden flex-col justify-between bg-neutral-950 p-10 lg:flex">
        {/* Background image + overlay */}
        <div className="animate-fade-in absolute inset-0">
          <Image
            src="/images/auth-main.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Logo */}
        <Link href="/" className="animate-fade-in-up relative z-10 flex w-fit items-center gap-2">
          <Image
            src="/images/logo-main.png"
            alt="SonderMaps"
            width={48}
            height={48}
            className="h-12 w-12"
          />
        </Link>

        {/* Quote */}
        <blockquote className="animate-fade-in-up relative z-10 max-w-md" style={{ animationDelay: "0.3s" }}>
          <p className="font-(family-name:--font-noto-serif) text-lg font-light leading-relaxed tracking-wide text-white/70">
            &ldquo;스쳐 지나가는 모든 사람에게도
            <br />
            당신만큼 복잡하고 아름다운
            <br />
            삶이 있다는 것을
            <br />
            문득 깨닫는 순간.&rdquo;
          </p>
          <footer className="mt-4 text-sm text-white/40">
            — The Dictionary of Obscure Sorrows
          </footer>
        </blockquote>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center bg-neutral-950 px-6 py-12">
        <div className="w-full max-w-md space-y-6">{children}</div>
      </div>
    </div>
  )
}
