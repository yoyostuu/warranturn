"use client"

import { use, useState } from "react"
import { useChatStore } from "@/store/chatStore"
import { api } from "@/lib/MockResolutionClient"
import { ResolutionChat } from "@/components/chat/ResolutionChat"
import { ContextPanel } from "@/components/chat/ContextPanel"
import { Menu } from "lucide-react"

export default function ResolutionWorkspacePage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params)
  const session = useChatStore(state => state.sessions[sessionId])
  const addOrUpdateSession = useChatStore(state => state.addOrUpdateSession)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showMobileContext, setShowMobileContext] = useState(false)

  if (!session) return null // Layout handles the missing session rendering

  const handleSendMessage = async (message: string) => {
    try {
      setIsProcessing(true)
      // Optimistic user message append is handled inside the mock client for simplicity, 
      // but in real app we might want optimistic UI here.
      const updatedSession = await api.sendMessage(session.sessionId, message)
      addOrUpdateSession(updatedSession)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApproveOption = async (optionId: string) => {
    try {
      setIsProcessing(true)
      const updatedSession = await api.approveRecommendation(session.sessionId, optionId)
      addOrUpdateSession(updatedSession)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVerify = async (isFixed: boolean) => {
    try {
      setIsProcessing(true)
      const updatedSession = await api.verifyResolution(session.sessionId, isFixed)
      addOrUpdateSession(updatedSession)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background)]">
      {/* Mobile Header for Context Toggle */}
      <div className="absolute top-0 left-0 w-full h-14 bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] flex items-center justify-between px-4 lg:hidden z-20">
        <div className="font-semibold text-white truncate pr-4">
          {session.originalGoal || "Warranturn Resolution"}
        </div>
        <button onClick={() => setShowMobileContext(!showMobileContext)} className="text-[var(--color-text-secondary)]">
          <Menu size={24} />
        </button>
      </div>

      <div className="flex flex-1 pt-14 lg:pt-0 overflow-hidden relative w-full h-full">
        {/* Main Chat Area */}
        <div className="flex-1 min-w-0">
          <ResolutionChat 
            session={session} 
            onSendMessage={handleSendMessage} 
            onApproveOption={handleApproveOption}
            onVerify={handleVerify}
            isProcessing={isProcessing}
          />
        </div>

        {/* Desktop Context Panel */}
        <div className="hidden lg:block h-full">
          <ContextPanel session={session} />
        </div>

        {/* Mobile Context Panel Overlay */}
        {showMobileContext && (
          <div className="absolute inset-0 z-30 flex justify-end bg-black/60 lg:hidden">
            <div className="w-80 h-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <ContextPanel session={session} />
            </div>
            <div className="absolute inset-y-0 left-0 w-[calc(100%-20rem)]" onClick={() => setShowMobileContext(false)} />
          </div>
        )}
      </div>
    </div>
  )
}
