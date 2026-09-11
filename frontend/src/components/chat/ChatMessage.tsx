"use client"

import { ChatMessage as IChatMessage, ResolutionSession } from "@/types/chat"
import { cn } from "@/lib/utils"
import { Stethoscope, Upload, ArrowRight, Activity, CheckCircle2, RotateCw, AlertTriangle, Box } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface ChatMessageProps {
  message: IChatMessage
  session: ResolutionSession
  onApproveOption?: (optionId: string) => void
  onVerify?: (isFixed: boolean) => void
}

export function ChatMessage({ message, session, onApproveOption, onVerify }: ChatMessageProps) {
  const isAssistant = message.role === "assistant"
  const isSystem = message.role === "system"

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <span className="text-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-soft)] px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div className={cn("flex w-full", isAssistant ? "justify-start" : "justify-end")}>
      <div className={cn("flex max-w-[85%] sm:max-w-[75%] gap-3", isAssistant ? "flex-row" : "flex-row-reverse")}>
        
        {/* Avatar */}
        {isAssistant && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white mt-1 shadow-sm">
            <Stethoscope size={16} />
          </div>
        )}

        <div className={cn("flex flex-col", isAssistant ? "items-start" : "items-end")}>
          <div 
            className={cn(
              "px-4 py-3 rounded-2xl text-[15px] leading-relaxed",
              isAssistant 
                ? "bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] rounded-tl-sm shadow-sm" 
                : "bg-[var(--color-primary)] text-white rounded-tr-sm shadow-md"
            )}
          >
            {message.content}
          </div>

          {/* Inline Components */}
          {message.inlineComponent === "UNDERSTANDING_CARD" && (
            <div className="mt-3 w-full max-w-sm">
              <Card className="bg-[var(--color-surface)] border-[var(--color-border-subtle)] shadow-sm">
                <div className="bg-[var(--color-surface-soft)] px-4 py-3 border-b border-[var(--color-border-subtle)]">
                  <span className="font-semibold text-white text-sm">What I understood</span>
                </div>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">Product</span>
                    <span className="text-sm text-white">{session.productCategory || "Unknown"}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">Affected part</span>
                    <span className="text-sm text-white">{session.issueDescription?.split(" ")[0] === "Right" ? "Right side" : "Unknown"}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">Symptom</span>
                    <span className="text-sm text-white">{session.issueDescription?.replace("Right side ", "") || "Unknown"}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">Goal</span>
                    <span className="text-sm text-[var(--color-primary)] font-medium">{session.originalGoal || "Unknown"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {message.inlineComponent === "EVIDENCE_REQUEST" && (
            <div className="mt-3 w-full max-w-sm">
              <Card className="bg-[var(--color-surface)] border-[var(--color-primary)]/30 overflow-hidden shadow-lg shadow-[var(--color-primary)]/5">
                <div className="bg-[var(--color-primary)]/10 px-4 py-3 border-b border-[var(--color-primary)]/20 flex items-center gap-2">
                  <Upload size={16} className="text-[var(--color-primary)]" />
                  <span className="font-semibold text-[var(--color-primary)] text-sm">Evidence Required</span>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                    Please upload the requested documents to proceed with the resolution.
                  </p>
                  <Button asChild className="w-full shadow-md">
                    <Link href={`/resolve/${session.sessionId}/evidence`}>
                      Add evidence <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {message.inlineComponent === "OPTIONS_COMPARISON" && (
            <div className="mt-3 w-full max-w-md space-y-3">
              {session.resolutionOptions.map(opt => (
                <Card key={opt.id} className={cn(
                  "bg-[var(--color-surface)] overflow-hidden transition-all",
                  opt.isRecommended ? "border-[var(--color-primary)] shadow-[0_0_20px_-10px_rgba(59,130,246,0.5)]" : "border-[var(--color-border-subtle)] opacity-80"
                )}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        {opt.isRecommended && (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--color-primary)] text-white mb-1">
                            Recommended
                          </span>
                        )}
                        <h4 className="font-semibold text-white">{opt.provider} {opt.action}</h4>
                      </div>
                      <span className="font-bold text-white">₹{opt.cost}</span>
                    </div>
                    <div className="flex gap-4 text-xs text-[var(--color-text-muted)] mb-4">
                      <span>{opt.estimatedDaysMin}-{opt.estimatedDaysMax} days</span>
                      <span>{opt.successProbability}% success</span>
                    </div>
                    {opt.isRecommended && onApproveOption && session.currentStage === "AWAITING_APPROVAL" && (
                      <Button size="sm" className="w-full" onClick={() => onApproveOption(opt.id)}>
                        Approve this plan
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {message.inlineComponent === "REPLAN_APPROVAL" && session.recommendation && (
            <div className="mt-3 w-full max-w-sm">
              <Card className="bg-[var(--color-surface)] border-[var(--color-warning)]/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="h-5 w-5 text-[var(--color-warning)] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white">New Recommendation</h4>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1">{session.recommendation.reason}</p>
                    </div>
                  </div>
                  {onApproveOption && session.currentStage === "AWAITING_REAPPROVAL" && (
                    <Button size="sm" className="w-full bg-[var(--color-warning)] hover:bg-[var(--color-warning)]/90 text-[var(--color-background)]" onClick={() => onApproveOption(session.recommendation!.recommendedOptionId)}>
                      Approve New Plan
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {message.inlineComponent === "MONITORING_TIMELINE" && (
            <div className="mt-3 w-full max-w-sm">
              <Card className="bg-[var(--color-surface)] border-[var(--color-border-subtle)]">
                <CardContent className="p-4">
                  <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-[var(--color-border-strong)]">
                    {session.monitoringEvents.map((evt, i) => {
                      const isLast = i === session.monitoringEvents.length - 1
                      return (
                        <div key={evt.id} className="relative">
                          <div className={cn(
                            "absolute -left-[30px] top-1 h-4 w-4 rounded-full border-2",
                            isLast && session.currentStage !== "AWAITING_VERIFICATION" && session.currentStage !== "RESOLVED"
                              ? "border-[var(--color-primary)] bg-[var(--color-background)] animate-pulse" 
                              : "border-transparent bg-[var(--color-success)]"
                          )} />
                          <div className="flex flex-col">
                            <span className="font-medium text-white text-sm">{evt.status}</span>
                            <span className="text-xs text-[var(--color-text-secondary)]">{evt.message}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {message.inlineComponent === "VERIFICATION_PROMPT" && (
            <div className="mt-3 w-full max-w-sm">
              <Card className="bg-[var(--color-secondary)]/10 border-[var(--color-secondary)]/30">
                <CardContent className="p-4 text-center">
                  <Box className="h-10 w-10 text-[var(--color-secondary)] mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-4">Has the issue been resolved?</h4>
                  {onVerify && session.currentStage === "AWAITING_VERIFICATION" && (
                    <div className="space-y-2">
                      <Button size="sm" className="w-full bg-[var(--color-success)] hover:bg-[var(--color-success)]/90 text-white" onClick={() => onVerify(true)}>
                        Yes, it&apos;s fixed
                      </Button>
                      <Button size="sm" variant="outline" className="w-full" onClick={() => onVerify(false)}>
                        No, issue remains
                      </Button>
                    </div>
                  )}
                  {session.currentStage === "RESOLVED" && (
                    <div className="flex items-center justify-center gap-2 text-[var(--color-success)] text-sm font-medium">
                      <CheckCircle2 size={16} /> Resolution Confirmed
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <span className={cn(
            "text-[10px] mt-1 text-[var(--color-text-muted)]",
            isAssistant ? "ml-2" : "mr-2"
          )}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  )
}
