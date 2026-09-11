import { ResolutionClient } from "./ResolutionClient"
import { ResolutionSession, ChatMessage } from "@/types/chat"
import { MOCK_RESOLUTION_OPTIONS } from "@/store/fixtures"

const DELAY = 800

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

function getStoredSessions(): Record<string, ResolutionSession> {
  if (typeof window === "undefined") return {}
  const raw = localStorage.getItem("mock_db_sessions")
  return raw ? JSON.parse(raw) : {}
}

function saveSession(session: ResolutionSession) {
  if (typeof window === "undefined") return
  const sessions = getStoredSessions()
  sessions[session.sessionId] = session
  localStorage.setItem("mock_db_sessions", JSON.stringify(sessions))
}

export class MockResolutionClient implements ResolutionClient {
  
  async createSession(initialMessage: string): Promise<ResolutionSession> {
    await new Promise(resolve => setTimeout(resolve, DELAY))
    
    const sessionId = `sess_${generateId()}`
    
    // Simulate initial extraction for the demo issue
    const isDemoIssue = initialMessage.toLowerCase().includes("crackling")
    
    const session: ResolutionSession = {
      sessionId,
      messages: [
        {
          id: generateId(),
          role: "user",
          content: initialMessage,
          timestamp: new Date().toISOString()
        }
      ],
      currentStage: "DRAFT",
      evidence: [],
      resolutionOptions: [],
      attempts: [],
      monitoringEvents: [],
      missingInformation: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (isDemoIssue) {
      session.originalGoal = "Get my earphones working again"
      session.issueDescription = "Right side crackling audio"
      session.productCategory = "Earphones"
      session.messages.push({
        id: generateId(),
        role: "assistant",
        content: "I understand the issue.\n\nYour goal is to get the earphones working correctly again. You’ve reported crackling audio from the right side.",
        timestamp: new Date().toISOString(),
        inlineComponent: "UNDERSTANDING_CARD"
      })
      session.messages.push({
        id: generateId(),
        role: "assistant",
        content: "To verify the product and check your available warranty or replacement routes, I need some supporting evidence.",
        timestamp: new Date().toISOString(),
        inlineComponent: "EVIDENCE_REQUEST"
      })
      session.currentStage = "COLLECTING_EVIDENCE"
    } else {
      session.messages.push({
        id: generateId(),
        role: "assistant",
        content: "I understand you are having an issue. Could you tell me more about the product (brand/model)?",
        timestamp: new Date().toISOString()
      })
    }

    saveSession(session)
    return session
  }

  async getSession(sessionId: string): Promise<ResolutionSession | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const sessions = getStoredSessions()
    return sessions[sessionId] || null
  }

  async sendMessage(sessionId: string, message: string): Promise<ResolutionSession> {
    await new Promise(resolve => setTimeout(resolve, DELAY))
    const sessions = getStoredSessions()
    const session = sessions[sessionId]
    if (!session) throw new Error("Session not found")

    session.messages.push({
      id: generateId(),
      role: "user",
      content: message,
      timestamp: new Date().toISOString()
    })

    // Very simple mock logic to progress conversation
    if (session.currentStage === "DRAFT") {
      session.originalGoal = "Resolve issue with product"
      session.messages.push({
        id: generateId(),
        role: "assistant",
        content: "To verify the product and available resolution routes, I need some supporting evidence.",
        timestamp: new Date().toISOString(),
        inlineComponent: "EVIDENCE_REQUEST"
      })
      session.currentStage = "COLLECTING_EVIDENCE"
    } else {
      session.messages.push({
        id: generateId(),
        role: "assistant",
        content: "I've noted that.",
        timestamp: new Date().toISOString()
      })
    }

    session.updatedAt = new Date().toISOString()
    saveSession(session)
    return session
  }

  async uploadEvidence(sessionId: string, fileData: { name: string; type: string; tempUrl: string }): Promise<ResolutionSession> {
    await new Promise(resolve => setTimeout(resolve, DELAY))
    const session = getStoredSessions()[sessionId]
    if (!session) throw new Error("Session not found")

    session.evidence.push({
      id: `ev_${generateId()}`,
      name: fileData.name,
      type: fileData.name.toLowerCase().includes("invoice") ? "INVOICE" : "PHOTO",
      fileUrl: fileData.tempUrl
    })

    session.updatedAt = new Date().toISOString()
    saveSession(session)
    return session
  }

  async processEvidence(sessionId: string): Promise<ResolutionSession> {
    await new Promise(resolve => setTimeout(resolve, DELAY))
    const session = getStoredSessions()[sessionId]
    if (!session) throw new Error("Session not found")

    session.messages.push({
      id: generateId(),
      role: "assistant",
      content: "I’ve added your evidence to this case. The invoice identifies the product as boAt Airdopes 141, purchased from Amazon on 12 May 2026.",
      timestamp: new Date().toISOString()
    })
    
    session.productBrand = "boAt"
    session.productModel = "Airdopes 141"

    session.currentStage = "AWAITING_APPROVAL"
    session.resolutionOptions = MOCK_RESOLUTION_OPTIONS
    session.recommendation = { recommendedOptionId: "opt_1", reason: "Fastest replacement via original seller." }

    session.messages.push({
      id: generateId(),
      role: "assistant",
      content: "I found three possible resolution routes. I recommend Amazon Replacement for the fastest resolution.",
      timestamp: new Date().toISOString(),
      inlineComponent: "OPTIONS_COMPARISON"
    })

    session.updatedAt = new Date().toISOString()
    saveSession(session)
    return session
  }

  async approveRecommendation(sessionId: string, optionId: string): Promise<ResolutionSession> {
    await new Promise(resolve => setTimeout(resolve, DELAY))
    const session = getStoredSessions()[sessionId]
    if (!session) throw new Error("Session not found")

    const option = session.resolutionOptions.find(o => o.id === optionId)

    if (session.currentStage === "AWAITING_APPROVAL") {
      // First approval goes to EXECUTING and FAILS immediately
      session.currentStage = "FAILED"
      session.attempts.push({
        id: generateId(),
        provider: option?.provider || "Unknown",
        action: option?.action || "Action",
        status: "FAILED",
        failureCode: "INVENTORY_EXHAUSTED",
        failureReason: "Replacement inventory is unavailable.",
        retryable: false
      })
      
      session.messages.push({
        id: generateId(),
        role: "assistant",
        content: `The first route (${option?.provider}) failed because replacement inventory is unavailable.`,
        timestamp: new Date().toISOString()
      })
      
      session.currentStage = "AWAITING_REAPPROVAL"
      session.recommendation = { recommendedOptionId: "opt_2", reason: "Fallback to manufacturer warranty." }
      
      session.messages.push({
        id: generateId(),
        role: "assistant",
        content: "I’ve prepared another route for your approval (Manufacturer Replacement).",
        timestamp: new Date().toISOString(),
        inlineComponent: "REPLAN_APPROVAL"
      })

    } else if (session.currentStage === "AWAITING_REAPPROVAL") {
      // Second approval succeeds and moves to monitoring
      session.currentStage = "MONITORING"
      session.attempts.push({
        id: generateId(),
        provider: option?.provider || "Unknown",
        action: option?.action || "Action",
        status: "SUCCESS",
        retryable: false
      })

      session.monitoringEvents = [
        { id: generateId(), status: "SUBMITTED", message: "Request sent", timestamp: new Date().toISOString() },
        { id: generateId(), status: "PROCESSING", message: "Approved by manufacturer", timestamp: new Date(Date.now() + 1000).toISOString() },
        { id: generateId(), status: "DISPATCHED", message: "Shipped", timestamp: new Date(Date.now() + 2000).toISOString() },
        { id: generateId(), status: "DELIVERED", message: "Arrived", timestamp: new Date(Date.now() + 3000).toISOString() },
      ]

      session.messages.push({
        id: generateId(),
        role: "assistant",
        content: `I've started the ${option?.provider} route. Here is the live status:`,
        timestamp: new Date().toISOString(),
        inlineComponent: "MONITORING_TIMELINE"
      })

      // Simulate waiting for verification
      session.currentStage = "AWAITING_VERIFICATION"
      session.messages.push({
        id: generateId(),
        role: "assistant",
        content: "The replacement has been delivered. Has the original crackling-audio issue been resolved?",
        timestamp: new Date(Date.now() + 4000).toISOString(),
        inlineComponent: "VERIFICATION_PROMPT"
      })
    }

    session.updatedAt = new Date().toISOString()
    saveSession(session)
    return session
  }

  async verifyResolution(sessionId: string, isFixed: boolean): Promise<ResolutionSession> {
    await new Promise(resolve => setTimeout(resolve, DELAY))
    const session = getStoredSessions()[sessionId]
    if (!session) throw new Error("Session not found")

    if (isFixed) {
      session.currentStage = "RESOLVED"
      session.verification = { userConfirmed: true, goalAchieved: true, timestamp: new Date().toISOString() }
      session.messages.push({
        id: generateId(),
        role: "assistant",
        content: "Excellent. I've marked this case as resolved. Thank you for using Warranturn.",
        timestamp: new Date().toISOString()
      })
    } else {
      session.messages.push({
        id: generateId(),
        role: "assistant",
        content: "I'm sorry to hear that. I will reopen the investigation.",
        timestamp: new Date().toISOString()
      })
      session.currentStage = "PROCESSING"
    }

    session.updatedAt = new Date().toISOString()
    saveSession(session)
    return session
  }
}

export const api = new MockResolutionClient()
