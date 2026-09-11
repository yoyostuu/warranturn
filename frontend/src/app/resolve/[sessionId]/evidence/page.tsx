"use client"

import { use, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useChatStore } from "@/store/chatStore"
import { api } from "@/lib/MockResolutionClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCloud, FileText, Image as ImageIcon, ArrowLeft, Loader2, CheckCircle2, FileSignature, Video } from "lucide-react"
import Link from "next/link"

export default function EvidencePage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params)
  const router = useRouter()
  const session = useChatStore(state => state.sessions[sessionId])
  const addOrUpdateSession = useChatStore(state => state.addOrUpdateSession)
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploads, setUploads] = useState<Record<string, boolean>>({})

  if (!session) return null // Layout handles missing

  const handleUpload = async (type: string) => {
    setIsProcessing(true)
    try {
      const updatedSession = await api.uploadEvidence(session.sessionId, {
        name: `${type}_upload.${type === 'invoice' || type === 'warranty' ? 'pdf' : 'jpg'}`,
        type: type.toUpperCase(),
        tempUrl: "/mock-url" // Safe metadata, no raw file
      })
      addOrUpdateSession(updatedSession)
      setUploads(prev => ({ ...prev, [type]: true }))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleContinue = async () => {
    setIsProcessing(true)
    try {
      const updatedSession = await api.processEvidence(session.sessionId)
      addOrUpdateSession(updatedSession)
      router.push(`/resolve/${session.sessionId}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const hasInvoice = uploads["invoice"] || session.evidence.some(e => e.type === "INVOICE")
  const hasPhoto = uploads["photo"] || session.evidence.some(e => e.type === "PHOTO")
  const hasWarranty = uploads["warranty"] || session.evidence.some(e => e.type === "WARRANTY")
  const hasAdditional = uploads["additional"] || session.evidence.some(e => e.type === "ADDITIONAL")

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8 pb-20">
      <div className="flex items-center gap-4 border-b border-[var(--color-border-subtle)] pb-6 pt-2">
        <Button variant="ghost" size="icon" asChild className="hover:bg-[var(--color-surface-soft)]">
          <Link href={`/resolve/${session.sessionId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Upload Evidence</h1>
          <p className="text-[var(--color-text-secondary)]">Provide the requested context so Warranturn can analyze your claim.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Context Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-[var(--color-surface)] border-[var(--color-border-strong)] shadow-lg">
            <CardHeader className="pb-3 border-b border-[var(--color-border-subtle)]">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Current Case Context</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div>
                <span className="text-xs text-[var(--color-text-muted)] block mb-1">Original Goal</span>
                <p className="font-medium text-white">{session.originalGoal}</p>
              </div>
              <div>
                <span className="text-xs text-[var(--color-text-muted)] block mb-1">Reported Issue</span>
                <p className="text-[var(--color-text-secondary)] text-sm">{session.issueDescription}</p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <div className="h-2 w-2 rounded-full bg-[var(--color-secondary)] animate-pulse" />
                <span className="text-sm font-medium text-[var(--color-secondary)]">Awaiting Evidence</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Cards Grid */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
          
          {/* Invoice */}
          <UploadCard 
            title="Invoice or Receipt" 
            icon={<FileText className="h-5 w-5" />} 
            required 
            isUploaded={hasInvoice} 
            isProcessing={isProcessing} 
            onUpload={() => handleUpload("invoice")} 
            desc="PDF or clear photo of your purchase receipt."
          />

          {/* Product Photo */}
          <UploadCard 
            title="Product Image" 
            icon={<ImageIcon className="h-5 w-5" />} 
            required={false} 
            isUploaded={hasPhoto} 
            isProcessing={isProcessing} 
            onUpload={() => handleUpload("photo")} 
            desc="A clear photo showing the whole product."
          />

          {/* Warranty */}
          <UploadCard 
            title="Warranty Document" 
            icon={<FileSignature className="h-5 w-5" />} 
            required={false} 
            isUploaded={hasWarranty} 
            isProcessing={isProcessing} 
            onUpload={() => handleUpload("warranty")} 
            desc="Official warranty card if provided."
          />

          {/* Additional Video/Photo */}
          <UploadCard 
            title="Issue Video/Photo" 
            icon={<Video className="h-5 w-5" />} 
            required={false} 
            isUploaded={hasAdditional} 
            isProcessing={isProcessing} 
            onUpload={() => handleUpload("additional")} 
            desc="Visual proof of the damage or defect."
          />

        </div>
      </div>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--color-background)]/80 backdrop-blur-lg border-t border-[var(--color-border-subtle)] flex justify-end z-20">
        <div className="max-w-6xl w-full mx-auto flex justify-end px-4 md:px-8">
          <Button size="lg" className="w-full sm:w-auto shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]" onClick={handleContinue} disabled={!hasInvoice || isProcessing}>
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Continue resolution
          </Button>
        </div>
      </div>
    </div>
  )
}

function UploadCard({ title, icon, required, isUploaded, isProcessing, onUpload, desc }: { title: string, icon: React.ReactNode, required: boolean, isUploaded: boolean, isProcessing: boolean, onUpload: () => void, desc: string }) {
  return (
    <Card className={`overflow-hidden flex flex-col transition-colors border ${isUploaded ? 'border-[var(--color-success)]/50 bg-[var(--color-success)]/5' : 'border-[var(--color-border-subtle)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/40'}`}>
      <div className={`p-4 border-b flex items-center gap-3 ${isUploaded ? 'border-[var(--color-success)]/20 bg-[var(--color-success)]/10' : 'border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)]'}`}>
        <div className={isUploaded ? 'text-[var(--color-success)]' : 'text-[var(--color-primary)]'}>{icon}</div>
        <h3 className="font-semibold text-white">{title}</h3>
        {required ? (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[var(--color-primary)]/20 text-[var(--color-primary)] ml-auto">Required</span>
        ) : (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] ml-auto">Optional</span>
        )}
      </div>
      <CardContent className="p-6 flex-1 flex flex-col justify-center items-center text-center">
        {isUploaded ? (
          <div className="space-y-4">
            <CheckCircle2 className="h-12 w-12 text-[var(--color-success)] mx-auto" />
            <p className="text-sm font-medium text-white">Uploaded securely</p>
            <Button variant="ghost" size="sm" onClick={onUpload} disabled={isProcessing} className="text-[var(--color-text-muted)] mt-2">Replace file</Button>
          </div>
        ) : (
          <div className="w-full">
            <div className="border-2 border-dashed border-[var(--color-border-strong)] rounded-xl p-6 transition-colors hover:bg-[var(--color-surface-soft)] hover:border-[var(--color-primary)]/50 cursor-pointer" onClick={onUpload}>
              <UploadCloud className="h-8 w-8 text-[var(--color-text-muted)] mb-3 mx-auto" />
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">{desc}</p>
              <Button variant="outline" disabled={isProcessing} className="w-full text-xs" onClick={(e) => { e.stopPropagation(); onUpload(); }}>
                Browse Files
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
