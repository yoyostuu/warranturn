import { describe, it, expect, beforeEach } from 'vitest'
import { api } from '@/lib/MockResolutionClient'

describe('Resolution Stage Transitions', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should initialize to DRAFT or COLLECTING_EVIDENCE depending on input', async () => {
    const session1 = await api.createSession('Hello')
    expect(session1.currentStage).toBe('DRAFT')

    const session2 = await api.createSession('crackling audio')
    expect(session2.currentStage).toBe('COLLECTING_EVIDENCE')
  })

  it('should transition to AWAITING_APPROVAL after evidence upload and processing', async () => {
    const session = await api.createSession('crackling audio')
    
    // Upload evidence
    await api.uploadEvidence(session.sessionId, { name: 'invoice.pdf', type: 'INVOICE', tempUrl: 'temp' })
    
    // Process
    const processed = await api.processEvidence(session.sessionId)
    expect(processed.currentStage).toBe('AWAITING_APPROVAL')
    expect(processed.resolutionOptions.length).toBeGreaterThan(0)
  })

  it('should transition to FAILED and then AWAITING_REAPPROVAL on first approval', async () => {
    const session = await api.createSession('crackling audio')
    await api.uploadEvidence(session.sessionId, { name: 'invoice.pdf', type: 'INVOICE', tempUrl: 'temp' })
    const processed = await api.processEvidence(session.sessionId)
    
    // First approval
    const approved = await api.approveRecommendation(processed.sessionId, 'opt_1')
    
    // First one fails due to mock deterministic logic
    expect(approved.currentStage).toBe('AWAITING_REAPPROVAL')
    const lastAttempt = approved.attempts[approved.attempts.length - 1]
    expect(lastAttempt.status).toBe('FAILED')
    expect(lastAttempt.failureCode).toBe('INVENTORY_EXHAUSTED')
  })
})
