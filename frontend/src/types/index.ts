export type CaseStage =
  | "DRAFT"
  | "PROCESSING"
  | "AWAITING_APPROVAL"
  | "EXECUTING"
  | "FAILED"
  | "REPLANNING"
  | "AWAITING_REAPPROVAL"
  | "MONITORING"
  | "AWAITING_VERIFICATION"
  | "RESOLVED";

export interface Product {
  id: string;
  brand: string;
  productName: string;
  purchaseSource: string;
  purchaseDate: string;
  warrantyExpiry: string;
  warrantyStatus: "Active" | "Expired" | "Unknown";
  orderId?: string;
}

export interface EvidenceItem {
  id: string;
  type: "INVOICE" | "PHOTO" | "OTHER";
  fileUrl: string;
  name: string;
}

export interface WarrantyResult {
  eligible: boolean;
  reason: string;
}

export interface Diagnosis {
  issueCategory: string;
  troubleshootingSuggested: string[];
  confidence: number;
}

export interface ResolutionOption {
  id: string;
  provider: string;
  action: string;
  cost: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  successProbability: number;
  customerEffort: "Low" | "Medium" | "High";
  eligible: boolean;
  score: number;
  isRecommended: boolean;
  reasonForRecommendation?: string;
}

export interface Recommendation {
  recommendedOptionId: string;
  reason: string;
}

export interface Approval {
  optionId: string;
  timestamp: string;
}

export interface Attempt {
  id: string;
  provider: string;
  action: string;
  status: "PENDING" | "EXECUTING" | "SUCCESS" | "FAILED";
  failureCode?: string;
  failureReason?: string;
  retryable: boolean;
}

export interface Failure {
  code: string;
  reason: string;
  retryable: boolean;
}

export interface MonitoringEvent {
  id: string;
  status: "SUBMITTED" | "PROCESSING" | "APPROVED" | "DISPATCHED" | "DELIVERED";
  message: string;
  timestamp: string;
}

export interface VerificationResult {
  userConfirmed: boolean;
  goalAchieved: boolean;
  timestamp: string;
}

export interface Case {
  id: string;
  productId: string;
  originalGoal: string;
  issueDescription: string;
  stage: CaseStage;
  evidence: EvidenceItem[];
  warrantyResult?: WarrantyResult;
  diagnosis?: Diagnosis;
  resolutionOptions: ResolutionOption[];
  recommendation?: Recommendation;
  approval?: Approval;
  attempts: Attempt[];
  monitoringEvents: MonitoringEvent[];
  verificationResult?: VerificationResult;
  createdAt: string;
  updatedAt: string;
}
