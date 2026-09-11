"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/MockResolutionClient"
import { useChatStore } from "@/store/chatStore"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, Loader2 } from "lucide-react"

export function IssueComposer() {
  const [input, setInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const addOrUpdateSession = useChatStore(state => state.addOrUpdateSession)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const suggestedPrompts = [
    "My earphones have crackling audio",
    "My laptop battery is draining quickly",
    "My phone screen is flickering",
    "My product arrived damaged"
  ]

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const session = await api.createSession(input.trim())
      addOrUpdateSession(session)
      router.push(`/resolve/${session.sessionId}`)
    } catch (err) {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleChipClick = (prompt: string) => {
    setInput(prompt)
    textareaRef.current?.focus()
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      <div className="w-full bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl shadow-2xl relative transition-all focus-within:border-[var(--color-primary)]/50 focus-within:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]">
        <form onSubmit={handleSubmit} className="flex flex-col relative">
          <Textarea 
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Example: I bought new earphones, but the right side is making a crackling sound..."
            className="min-h-[120px] max-h-[200px] border-0 focus-visible:ring-0 resize-none text-lg bg-transparent p-5 pb-16 placeholder:text-[var(--color-text-muted)] text-white shadow-none rounded-2xl"
            disabled={isSubmitting}
          />
          
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <Button type="button" variant="ghost" size="icon" className="text-[var(--color-text-muted)] hover:text-white rounded-full hover:bg-[var(--color-surface-soft)]" disabled={isSubmitting}>
              <Paperclip size={20} />
            </Button>
            
            <Button 
              type="submit" 
              disabled={!input.trim() || isSubmitting} 
              className={`rounded-full h-10 w-10 p-0 transition-colors ${
                input.trim() && !isSubmitting 
                  ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white shadow-lg shadow-[var(--color-primary)]/30' 
                  : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]'
              }`}
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-[-2px]" />}
            </Button>
          </div>
        </form>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {suggestedPrompts.map(prompt => (
          <button 
            key={prompt}
            onClick={() => handleChipClick(prompt)}
            disabled={isSubmitting}
            className="text-sm bg-transparent border border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)] text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface-soft)] px-4 py-2 rounded-full transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}
