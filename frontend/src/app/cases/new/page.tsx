"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, ChevronRight, UploadCloud, Stethoscope } from "lucide-react"

export default function NewCasePage() {
  const router = useRouter()
  const products = useStore(state => state.products)
  const createCase = useStore(state => state.createCase)
  const processCase = useStore(state => state.processCase)
  
  const [step, setStep] = useState(1)
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [originalGoal, setOriginalGoal] = useState("")
  const [issueDescription, setIssueDescription] = useState("")

  const handleUseDemoScenario = () => {
    const p = products.find(p => p.brand === "boAt")
    if (p) {
      setSelectedProductId(p.id)
    } else {
      setSelectedProductId(products[0]?.id || "")
    }
    setOriginalGoal("Get my earbuds working again")
    setIssueDescription("Right-side crackling audio")
    setStep(3)
  }

  const handleSubmit = async () => {
    if (!selectedProductId || !originalGoal || !issueDescription) return

    const caseId = createCase({
      productId: selectedProductId,
      originalGoal,
      issueDescription,
      evidence: [{
        id: `ev_${Date.now()}`,
        type: "INVOICE",
        fileUrl: "/mock/invoice.pdf",
        name: "amazon_invoice.pdf"
      }]
    })

    // Auto-start processing for demo
    processCase(caseId)
    
    router.push(`/cases/${caseId}`)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Report an Issue</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">We'll diagnose the problem and find the best resolution.</p>
        </div>
        <Button variant="outline" onClick={handleUseDemoScenario} className="hidden sm:flex border-dashed border-[var(--color-primary)]/50 text-[var(--color-primary)]">
          <Stethoscope className="mr-2 h-4 w-4" />
          Use Demo Scenario
        </Button>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-[var(--color-border-strong)] -z-10" />
        {[
          { num: 1, label: "Product" },
          { num: 2, label: "Issue" },
          { num: 3, label: "Evidence" },
          { num: 4, label: "Review" }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center bg-[var(--color-background)] px-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border ${
              step > s.num ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" :
              step === s.num ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10" :
              "border-[var(--color-border-strong)] text-[var(--color-text-muted)] bg-[var(--color-surface)]"
            }`}>
              {step > s.num ? <CheckCircle2 size={16} /> : s.num}
            </div>
            <span className={`text-xs mt-2 font-medium ${step >= s.num ? "text-[var(--color-text-main)]" : "text-[var(--color-text-muted)]"}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <Card className="bg-[var(--color-surface)] overflow-hidden">
        <CardContent className="p-6 sm:p-10">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Which product has an issue?</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {products.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedProductId === p.id 
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 ring-1 ring-[var(--color-primary)]" 
                        : "border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] hover:border-[var(--color-text-secondary)]"
                    }`}
                  >
                    <div className="font-semibold text-white">{p.brand}</div>
                    <div className="text-sm text-[var(--color-text-secondary)] mt-1">{p.productName}</div>
                  </div>
                ))}
              </div>
              <div className="pt-4 flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!selectedProductId}>
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Describe the problem</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>What is your original goal?</Label>
                  <p className="text-xs text-[var(--color-text-muted)]">Focus on the outcome, not the process. (e.g. "Get my earbuds working again")</p>
                  <Input 
                    value={originalGoal} 
                    onChange={e => setOriginalGoal(e.target.value)} 
                    placeholder="e.g. Get my earbuds working again"
                  />
                </div>
                <div className="space-y-2">
                  <Label>What exactly is wrong?</Label>
                  <p className="text-xs text-[var(--color-text-muted)]">Describe the symptoms in your own words.</p>
                  <Textarea 
                    value={issueDescription} 
                    onChange={e => setIssueDescription(e.target.value)}
                    placeholder="e.g. Right-side crackling audio when volume is above 50%"
                    className="h-32"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} disabled={!originalGoal || !issueDescription}>
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Upload evidence</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">Warranturn needs proof of purchase or photos of the issue.</p>
              
              <div className="border-2 border-dashed border-[var(--color-border-strong)] rounded-2xl p-12 flex flex-col items-center justify-center bg-[var(--color-surface-soft)] text-center cursor-pointer hover:border-[var(--color-primary)]/50 transition-colors">
                <UploadCloud className="h-10 w-10 text-[var(--color-text-muted)] mb-4" />
                <p className="font-medium text-white mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-[var(--color-text-muted)]">PDF, PNG, JPG (max 5MB)</p>
              </div>

              {/* Fake uploaded file */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] text-xs font-bold">PDF</div>
                  <div>
                    <p className="text-sm font-medium text-white">amazon_invoice.pdf</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Demo file attached</p>
                  </div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-[var(--color-success)]" />
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={() => setStep(4)}>
                  Review <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Review your report</h2>
              
              <div className="space-y-6 p-6 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-strong)]">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Goal</h4>
                  <p className="font-medium text-white">{originalGoal}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Issue</h4>
                  <p className="text-white">{issueDescription}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Evidence</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="px-2 py-1 rounded bg-[var(--color-background)] border border-[var(--color-border-subtle)] text-xs">
                      amazon_invoice.pdf
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(3)}>Back</Button>
                <Button onClick={handleSubmit}>
                  Submit to Warranturn
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
