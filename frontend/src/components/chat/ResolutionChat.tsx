"use client"

import { useState, useRef, useEffect } from "react"
import { ChatMessage as MessageComponent } from "./ChatMessage"
import { ResolutionSession } from "@/types/chat"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Paperclip, Loader2 } from "lucide-react"

interface ResolutionChatProps {
  session: ResolutionSession
  onSendMessage: (message: string) => void
  onApproveOption: (optionId: string) => void
  onVerify: (isFixed: boolean) => void
  isProcessing: boolean
}

export function ResolutionChat({ session, onSendMessage, onApproveOption, onVerify, isProcessing }: ResolutionChatProps) {
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [session.messages, isProcessing])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return
    onSendMessage(input.trim())
    setInput("")
  }

  const isInputDisabled = isProcessing || 
    ["AWAITING_APPROVAL", "EXECUTING", "AWAITING_REAPPROVAL", "MONITORING", "AWAITING_VERIFICATION", "RESOLVED", "FAILED"].includes(session.currentStage)

  return (
    <div className="flex flex-col h-full flex-1 relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {session.messages.map((msg) => (
          <MessageComponent 
            key={msg.id} 
            message={msg} 
            session={session} 
            onApproveOption={onApproveOption}
            onVerify={onVerify}
          />
        ))}
        {isProcessing && (
          <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm ml-12">
            <Loader2 className="h-4 w-4 animate-spin" /> Warranturn is typing...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[var(--color-surface)] border-t border-[var(--color-border-subtle)]">
        <form onSubmit={handleSubmit} className="relative flex items-center max-w-4xl mx-auto">
          <Button type="button" variant="ghost" size="icon" className="absolute left-2 text-[var(--color-text-muted)]" disabled={isInputDisabled}>
            <Paperclip size={20} />
          </Button>
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isInputDisabled ? "Awaiting your action above..." : "Type your message..."}
            className="pl-12 pr-12 h-14 bg-[var(--color-surface-soft)] border-[var(--color-border-strong)] rounded-full text-base focus-visible:ring-1 focus-visible:ring-[var(--color-primary)] focus-visible:border-[var(--color-primary)]"
            disabled={isInputDisabled}
          />
          <Button type="submit" size="icon" className="absolute right-2 h-10 w-10 rounded-full" disabled={!input.trim() || isInputDisabled}>
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  )
}
