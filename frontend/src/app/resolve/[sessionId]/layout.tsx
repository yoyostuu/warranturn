"use client"

import { use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useChatStore } from "@/store/chatStore"
import { Stethoscope, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ResolveLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = use(params)
  const router = useRouter()
  const isHydrated = useChatStore(state => state._hasHydrated)
  const session = useChatStore(state => state.sessions[sessionId])

  useEffect(() => {
    if (isHydrated && !session) {
      // Small delay so it doesn't flash immediately if fetching from an API in the future
      const timeout = setTimeout(() => {
        if (!useChatStore.getState().sessions[sessionId]) {
          // Invalid session, redirect or show error handled in render below
        }
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [isHydrated, session, sessionId])

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] p-6">
        <Stethoscope className="h-12 w-12 text-[var(--color-text-muted)] mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Session Not Found</h2>
        <p className="text-[var(--color-text-secondary)] text-center max-w-sm mb-6">
          The resolution session you are looking for does not exist or has expired.
        </p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Homepage
          </Link>
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
