import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, Activity, LogIn } from "lucide-react"
import { IssueComposer } from "@/components/chat/IssueComposer"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-[var(--color-background)] relative overflow-hidden">
      {/* Subtle radial light behind the interface */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-primary)]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-[var(--color-border-subtle)] relative z-10 bg-[var(--color-background)]/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-white shadow-inner">
            <span className="font-bold text-lg leading-none">W</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Warranturn</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/products" className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors">
            <Package size={16} /> Product Wallet
          </Link>
          <Link href="/cases" className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors">
            <Activity size={16} /> Existing Cases
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className="text-[var(--color-text-secondary)] hover:text-white">
            <Link href="/login"><LogIn size={16} className="mr-2" /> Sign in</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section (First Viewport) */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 md:px-6 w-full min-h-[calc(100dvh-73px)]">
        <div className="w-full max-w-4xl mx-auto text-center space-y-6 -mt-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Warranturn <span className="text-[var(--color-primary)] opacity-90">AI</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium text-[var(--color-text-main)]">
            What product problem can I help you resolve?
          </h2>
          <p className="text-base md:text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Describe the issue naturally. I’ll collect the right evidence, compare your available options, and keep working toward a resolution.
          </p>
          
          <div className="pt-4 w-full">
            <IssueComposer />
          </div>
        </div>
      </main>

      <footer className="py-6 px-6 text-center text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border-subtle)] relative z-10">
        Warranturn Demo Workspace. Not connected to real external providers.
      </footer>
    </div>
  )
}
