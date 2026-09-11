"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/store"
import { Case, ResolutionOption, Attempt, MonitoringEvent } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { 
  CheckCircle2, AlertTriangle, ArrowRight, Activity, 
  Search, ShieldAlert, Check, RotateCw, Box, Truck
} from "lucide-react"

export default function CaseWorkspacePage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = use(params)
  const cases = useStore(state => state.cases)
  const products = useStore(state => state.products)
  const approveResolution = useStore(state => state.approveResolution)
  const executeAttempt = useStore(state => state.executeAttempt)
  const verifyOutcome = useStore(state => state.verifyOutcome)
  
  const currentCase = cases.find(c => c.id === caseId)
  const product = products.find(p => p.id === currentCase?.productId)

  if (!currentCase || !product) {
    return <div className="p-12 text-center text-[var(--color-text-muted)]">Case not found</div>
  }

  const handleApprove = (optionId: string) => {
    approveResolution(caseId, optionId).then(() => {
      executeAttempt(caseId)
    })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header & Goal Banner */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Resolution Workspace</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">{product.brand} {product.productName}</p>
          </div>
          <Badge variant="outline" className="text-sm px-3 py-1">
            {currentCase.stage.replace(/_/g, ' ')}
          </Badge>
        </div>

        <div className="p-4 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">Target Goal</span>
            <span className="text-lg font-medium text-white">{currentCase.originalGoal}</span>
          </div>
          {currentCase.stage === "RESOLVED" ? (
            <div className="flex items-center gap-2 text-[var(--color-success)] bg-[var(--color-success)]/10 px-3 py-1.5 rounded-full border border-[var(--color-success)]/20">
              <CheckCircle2 size={16} /> Goal Achieved
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 px-3 py-1.5 rounded-full border border-[var(--color-secondary)]/20">
              <Activity size={16} /> In Progress
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentCase.stage === "PROCESSING" && (
          <ProcessingView key="processing" />
        )}

        {(currentCase.stage === "AWAITING_APPROVAL" || currentCase.stage === "AWAITING_REAPPROVAL") && (
          <ApprovalView key="approval" currentCase={currentCase} onApprove={handleApprove} />
        )}

        {(currentCase.stage === "EXECUTING" || currentCase.stage === "FAILED" || currentCase.stage === "REPLANNING") && (
          <ExecutionView key="execution" currentCase={currentCase} />
        )}

        {(currentCase.stage === "MONITORING" || currentCase.stage === "AWAITING_VERIFICATION") && (
          <MonitoringView key="monitoring" currentCase={currentCase} onVerify={(v) => verifyOutcome(caseId, v)} />
        )}

        {currentCase.stage === "RESOLVED" && (
          <ResolvedView key="resolved" currentCase={currentCase} />
        )}
      </AnimatePresence>
    </div>
  )
}

function ProcessingView() {
  const steps = [
    "Understanding the issue",
    "Extracting product information",
    "Checking warranty eligibility",
    "Reviewing safe troubleshooting",
    "Comparing resolution routes"
  ]
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const i = setInterval(() => {
      setActiveStep(prev => (prev < steps.length ? prev + 1 : prev))
    }, 400) // Match the 2000ms delay in store
    return () => clearInterval(i)
  }, [steps.length])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="p-12 text-center border border-[var(--color-border-subtle)] rounded-2xl bg-[var(--color-surface)] shadow-lg"
    >
      <Search className="h-12 w-12 text-[var(--color-primary)] mx-auto mb-6 animate-pulse" />
      <h2 className="text-xl font-semibold mb-8">Warranturn is working...</h2>
      
      <div className="max-w-sm mx-auto space-y-4 text-left">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              i < activeStep ? "bg-[var(--color-success)] text-white" : 
              i === activeStep ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] animate-pulse" : 
              "bg-[var(--color-surface-soft)] text-transparent"
            }`}>
              <Check size={12} strokeWidth={3} />
            </div>
            <span className={i <= activeStep ? "text-white font-medium" : "text-[var(--color-text-muted)]"}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function ApprovalView({ currentCase, onApprove }: { currentCase: Case, onApprove: (id: string) => void }) {
  const recommended = currentCase.resolutionOptions.find((o) => o.isRecommended)
  const others = currentCase.resolutionOptions.filter((o) => !o.isRecommended)
  const isReplan = currentCase.stage === "AWAITING_REAPPROVAL"

  if (!recommended) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {isReplan && (
        <div className="p-4 rounded-xl bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-[var(--color-warning)] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[var(--color-warning)] font-semibold text-lg">Action Failed & Replanned</h3>
            <p className="text-[var(--color-text-secondary)] mt-1">
              The previous plan (Amazon Replacement) failed because inventory is exhausted. Warranturn has evaluated the remaining alternatives and proposes a new plan.
            </p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">Recommended Resolution</h2>
          
          <Card className="border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)]">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Badge className="mb-2 bg-[var(--color-primary)] text-white">Recommended</Badge>
                  <h3 className="text-2xl font-bold">{recommended.provider} {recommended.action}</h3>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-white">₹{recommended.cost}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="space-y-1">
                  <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Time</span>
                  <p className="font-medium">{recommended.estimatedDaysMin}-{recommended.estimatedDaysMax} days</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Effort</span>
                  <p className="font-medium">{recommended.customerEffort}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Success Rate</span>
                  <p className="font-medium">{recommended.successProbability}%</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Eligibility</span>
                  <p className="font-medium text-[var(--color-success)]">Verified</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-sm mb-6">
                <span className="text-[var(--color-text-secondary)]">Why this fits your goal: </span>
                <span className="text-white">{currentCase.recommendation?.reason}</span>
              </div>

              <Button size="lg" className="w-full text-base" onClick={() => onApprove(recommended.id)}>
                Approve this plan <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Other Options</h2>
          <div className="space-y-4">
            {others.map((opt: ResolutionOption) => (
              <Card key={opt.id} className="bg-[var(--color-surface)] opacity-70 hover:opacity-100 transition-opacity">
                <CardContent className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{opt.provider}</h4>
                    <span className="font-medium text-white">₹{opt.cost}</span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">{opt.action}</p>
                  <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                    <span>{opt.estimatedDaysMin}-{opt.estimatedDaysMax} days</span>
                    <span>{opt.customerEffort} effort</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ExecutionView({ currentCase }: { currentCase: Case }) {
  const latestAttempt = currentCase.attempts[currentCase.attempts.length - 1]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card className="bg-[var(--color-surface)] overflow-hidden">
        <div className="bg-[var(--color-surface-soft)] px-6 py-4 border-b border-[var(--color-border-subtle)]">
          <h3 className="font-semibold">Execution Log</h3>
        </div>
        <CardContent className="p-6">
          <div className="space-y-6">
            {currentCase.attempts.map((attempt: Attempt, i: number) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1">
                  {attempt.status === "FAILED" ? (
                    <ShieldAlert className="h-5 w-5 text-[var(--color-failure)]" />
                  ) : attempt.status === "SUCCESS" ? (
                    <CheckCircle2 className="h-5 w-5 text-[var(--color-success)]" />
                  ) : (
                    <RotateCw className="h-5 w-5 text-[var(--color-primary)] animate-spin" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-white">Attempt: {attempt.provider} {attempt.action}</h4>
                  <div className="mt-1 text-sm">
                    {attempt.status === "FAILED" ? (
                      <div className="p-3 mt-2 rounded bg-[var(--color-failure)]/10 border border-[var(--color-failure)]/20 text-[var(--color-failure)]">
                        <strong>Error {attempt.failureCode}:</strong> {attempt.failureReason}
                      </div>
                    ) : (
                      <span className="text-[var(--color-text-secondary)]">Status: {attempt.status}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function MonitoringView({ currentCase, onVerify }: { currentCase: Case, onVerify: (v: boolean) => void }) {
  const isAwaitingVerification = currentCase.stage === "AWAITING_VERIFICATION"
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-6">Monitoring Delivery</h2>
          <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-[var(--color-border-strong)]">
            {currentCase.monitoringEvents.map((evt: MonitoringEvent, i: number) => {
              const isLast = i === currentCase.monitoringEvents.length - 1
              return (
                <div key={evt.id} className="relative">
                  <div className={`absolute -left-[30px] top-1 h-4 w-4 rounded-full border-2 ${
                    isLast && !isAwaitingVerification 
                      ? "border-[var(--color-primary)] bg-[var(--color-background)] animate-pulse" 
                      : "border-transparent bg-[var(--color-success)]"
                  }`} />
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{evt.status}</span>
                    <span className="text-sm text-[var(--color-text-secondary)]">{evt.message}</span>
                    <span className="text-xs text-[var(--color-text-muted)] mt-1">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {isAwaitingVerification && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border-[var(--color-secondary)] bg-[var(--color-secondary)]/5 shadow-[0_0_40px_-15px_rgba(34,211,238,0.2)]">
              <CardContent className="p-8 text-center">
                <Box className="h-16 w-16 text-[var(--color-secondary)] mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Delivery Completed</h3>
                <p className="text-[var(--color-text-secondary)] mb-8">
                  The replacement has been delivered. Has the original issue been resolved?
                </p>
                <div className="space-y-3">
                  <Button size="lg" className="w-full bg-[var(--color-success)] hover:bg-[var(--color-success)]/90 text-white" onClick={() => onVerify(true)}>
                    Yes, it's fixed
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" onClick={() => onVerify(false)}>
                    No, I'm still having the issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function ResolvedView({ currentCase }: { currentCase: Case }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center py-12">
      <div className="h-24 w-24 rounded-full bg-[var(--color-success)]/20 border border-[var(--color-success)]/30 flex items-center justify-center mx-auto mb-8">
        <CheckCircle2 className="h-12 w-12 text-[var(--color-success)]" />
      </div>
      <h2 className="text-4xl font-bold mb-4 tracking-tight">Resolution Complete</h2>
      <p className="text-xl text-[var(--color-text-secondary)] mb-12">
        Your original goal has been successfully achieved.
      </p>
      
      <Card className="bg-[var(--color-surface)] border-[var(--color-border-subtle)] text-left mb-8">
        <div className="bg-[var(--color-surface-soft)] px-6 py-4 border-b border-[var(--color-border-subtle)]">
          <h3 className="font-semibold text-white">Resolution Summary</h3>
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between border-b border-[var(--color-border-subtle)] pb-4">
            <span className="text-[var(--color-text-secondary)]">Total Cost</span>
            <span className="font-medium text-white">₹0</span>
          </div>
          <div className="flex justify-between border-b border-[var(--color-border-subtle)] pb-4">
            <span className="text-[var(--color-text-secondary)]">Final Route</span>
            <span className="font-medium text-white">Manufacturer Replacement</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Total Attempts</span>
            <span className="font-medium text-white">{currentCase.attempts.length}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
