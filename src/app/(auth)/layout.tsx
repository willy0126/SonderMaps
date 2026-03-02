import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted">
      <div className="w-full max-w-md space-y-6 p-8">{children}</div>
    </div>
  )
}
