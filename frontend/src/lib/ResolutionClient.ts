import { ResolutionSession, ChatMessage } from "@/types/chat"

export interface ResolutionClient {
  /**
   * Initializes a new session.
   */
  createSession(initialMessage: string): Promise<ResolutionSession>
  
  /**
   * Retrieves an existing session.
   */
  getSession(sessionId: string): Promise<ResolutionSession | null>

  /**
   * Sends a user message and returns the updated session containing the assistant's reply.
   */
  sendMessage(sessionId: string, message: string): Promise<ResolutionSession>

  /**
   * Uploads evidence. (Note: frontend sends file metadata/temp URL, not raw base64)
   */
  uploadEvidence(sessionId: string, fileData: { name: string; type: string; tempUrl: string }): Promise<ResolutionSession>

  /**
   * Triggers processing once evidence is collected.
   */
  processEvidence(sessionId: string): Promise<ResolutionSession>

  /**
   * Approves a resolution route.
   */
  approveRecommendation(sessionId: string, optionId: string): Promise<ResolutionSession>

  /**
   * Verifies the final outcome.
   */
  verifyResolution(sessionId: string, isFixed: boolean): Promise<ResolutionSession>
}
