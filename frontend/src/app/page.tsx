import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Stethoscope, ArrowRight, Activity, ShieldCheck, Repeat, CheckCircle } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-[var(--color-background)]">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">
            <Stethoscope size={18} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Warranturn</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors">
            Sign in
          </Link>
          <Button asChild>
            <Link href="/signup">Launch demo</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative px-6 py-24 md:py-32 md:px-12 overflow-hidden">
          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] px-3 py-1 text-sm font-medium text-[var(--color-secondary)] mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[var(--color-secondary)] mr-2 animate-pulse" />
              Autonomous Post-Purchase Resolution
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] text-white mb-6">
              Your product problem <br className="hidden md:block" />
              <span className="text-[var(--color-text-secondary)]">doesn't end at the claim.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mb-10 leading-relaxed">
              Warranturn diagnoses the issue, compares the available routes, acts with your approval, and keeps adapting until the original problem is resolved.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <Link href="/signup">
                  Resolve an issue <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                <Link href="/signup">See how replanning works</Link>
              </Button>
            </div>
          </div>

          {/* Abstract graphic representing the closed loop process */}
          <div className="mt-24 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-sm font-semibold tracking-widest uppercase text-[var(--color-text-secondary)] mb-4">The Agent Loop</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[
                { label: "Observe", icon: Activity },
                { label: "Diagnose", icon: Stethoscope },
                { label: "Decide", icon: ShieldCheck },
                { label: "Act", icon: ArrowRight },
                { label: "Monitor", icon: Repeat },
                { label: "Verify", icon: CheckCircle },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-center relative shadow-[0_4px_24px_-12px_rgba(0,0,0,0.5)]">
                  <div className="h-10 w-10 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border-strong)] flex items-center justify-center mb-4 text-[var(--color-primary)]">
                    <step.icon size={18} />
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text-main)]">{step.label}</span>
                  {i < 5 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 w-4 border-t border-[var(--color-border-strong)]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:px-12 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Failure is just new context.</h2>
              <p className="text-[var(--color-text-secondary)] text-lg mb-8 leading-relaxed">
                When an Amazon replacement is out of stock, traditional trackers leave you hanging. Warranturn understands the failure, analyzes the remaining options, and proposes Manufacturer Replacement immediately.
              </p>
              <ul className="space-y-4">
                {[
                  "Human approval required for consequential actions",
                  "Clear distinction between goal completion and task completion",
                  "Verified outcome tracking"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[var(--color-text-main)]">
                    <CheckCircle className="h-5 w-5 text-[var(--color-primary)] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background)] p-6 shadow-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/10 to-transparent rounded-2xl pointer-events-none" />
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
                  <div>
                    <h4 className="font-semibold text-white">boAt Airdopes 141</h4>
                    <p className="text-sm text-[var(--color-text-muted)]">Goal: Get earbuds working again</p>
                  </div>
                  <div className="px-2 py-1 rounded bg-[var(--color-failure)]/20 text-[var(--color-failure)] text-xs font-semibold">
                    FAILED
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-[var(--color-surface-soft)] border border-[var(--color-border-strong)] text-sm">
                  <span className="text-[var(--color-text-secondary)] block mb-1">Reason:</span>
                  <span className="text-white">Replacement inventory is unavailable.</span>
                </div>
                
                <div className="flex items-center justify-center py-2">
                  <Repeat className="h-5 w-5 text-[var(--color-text-muted)] animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                
                <div className="p-4 rounded-lg border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5">
                  <h5 className="font-semibold text-[var(--color-primary)] mb-1">New Recommendation</h5>
                  <p className="text-white text-sm mb-3">Manufacturer Replacement</p>
                  <Button size="sm" className="w-full">Approve New Plan</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 text-center border-t border-[var(--color-border-subtle)] text-sm text-[var(--color-text-muted)]">
        Warranturn Demo Workspace. Not connected to real external providers.
      </footer>
    </div>
  )
}
