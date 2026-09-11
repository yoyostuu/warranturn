import { CaseStage, EvidenceItem, ResolutionOption, MonitoringEvent, VerificationResult, Attempt, Recommendation } from "./index"

export type MessageRole = "user" | "assistant" | "system"

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
  inlineComponent?: "EVIDENCE_REQUEST" | "OPTIONS_COMPARISON" | "REPLAN_APPROVAL" | "MONITORING_TIMELINE" | "VERIFICATION_PROMPT" | "UNDERSTANDING_CARD"
}

export interface ResolutionSession {
  sessionId: string
  caseId?: string
  messages: ChatMessage[]
  
  // Extracted Context
  originalGoal?: string
  issueDescription?: string
  symptoms?: string[]
  productCategory?: string
  productBrand?: string
  productModel?: string
  purchaseSource?: string
  purchaseDate?: string
  
  missingInformation: string[]
  evidence: EvidenceItem[]
  
  // State Machine
  currentStage: CaseStage
  
  // Resolution Data
  resolutionOptions: ResolutionOption[]
  recommendation?: Recommendation
  attempts: Attempt[]
  monitoringEvents: MonitoringEvent[]
  verification?: VerificationResult
  
  createdAt: string
  updatedAt: string
}
