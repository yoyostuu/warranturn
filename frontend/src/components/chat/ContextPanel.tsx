"use client"

import { ResolutionSession } from "@/types/chat"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, CircleDashed, ShieldAlert, ShieldCheck } from "lucide-react"

export function ContextPanel({ session }: { session: ResolutionSession }) {
  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)] border-l border-[var(--color-border-subtle)] w-80 shrink-0 overflow-y-auto">
      <div className="p-6 border-b border-[var(--color-border-subtle)] sticky top-0 bg-[var(--color-surface)] z-10">
        <h3 className="font-semibold text-lg text-white mb-2">Case Context</h3>
        <Badge variant="outline">{session.currentStage.replace(/_/g, ' ')}</Badge>
      </div>

      <div className="p-6 space-y-8">
        {/* Original Goal */}
        <section>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Target Goal</h4>
          <div className="text-sm font-medium text-white p-3 rounded-lg bg-[var(--color-surface-soft)] border border-[var(--color-border-strong)]">
            {session.originalGoal || "Identifying goal..."}
          </div>
        </section>

        {/* Product Details */}
        <section>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Product Info</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--color-text-secondary)]">Category</span>
              <span className="text-white font-medium">{session.productCategory || "Unknown"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--color-text-secondary)]">Brand</span>
              <span className="text-white font-medium">{session.productBrand || "Unknown"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--color-text-secondary)]">Model</span>
              <span className="text-white font-medium">{session.productModel || "Unknown"}</span>
            </div>
          </div>
        </section>

        {/* Issue Details */}
        <section>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Reported Issue</h4>
          <p className="text-sm text-white">{session.issueDescription || "Gathering details..."}</p>
        </section>

        {/* Evidence */}
        <section>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Evidence</h4>
          {session.evidence.length > 0 ? (
            <div className="space-y-2">
              {session.evidence.map(ev => (
                <div key={ev.id} className="flex items-center justify-between p-2 text-sm rounded bg-[var(--color-surface-soft)] border border-[var(--color-border-strong)]">
                  <span className="text-white truncate max-w-[150px]">{ev.name}</span>
                  <CheckCircle2 size={14} className="text-[var(--color-success)]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
              <CircleDashed size={14} /> Waiting for evidence
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
