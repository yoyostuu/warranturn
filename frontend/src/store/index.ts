import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Case, Product, CaseStage } from "@/types";
import { MOCK_PRODUCTS, MOCK_CASES, MOCK_RESOLUTION_OPTIONS } from "./fixtures";

interface WarranturnState {
  user: { id: string; email: string; name: string } | null;
  products: Product[];
  cases: Case[];
  
  // Actions
  login: (email: string) => void;
  logout: () => void;
  createProduct: (product: Omit<Product, "id">) => void;
  createCase: (data: Partial<Case>) => string;
  processCase: (caseId: string) => Promise<void>;
  approveResolution: (caseId: string, optionId: string) => Promise<void>;
  executeAttempt: (caseId: string) => Promise<void>;
  verifyOutcome: (caseId: string, isFixed: boolean) => void;
  resetDemo: () => void;
}

export const useStore = create<WarranturnState>()(
  persist(
    (set, get) => ({
      user: null,
      products: MOCK_PRODUCTS,
      cases: MOCK_CASES,

      login: (email) => set({ user: { id: "u_1", email, name: "Demo User" } }),
      
      logout: () => set({ user: null }),

      createProduct: (product) => set((state) => ({
        products: [...state.products, { ...product, id: `prod_${Date.now()}` }]
      })),

      createCase: (data) => {
        const id = `case_${Date.now()}`;
        const newCase: Case = {
          id,
          productId: data.productId!,
          originalGoal: data.originalGoal!,
          issueDescription: data.issueDescription!,
          stage: "DRAFT",
          evidence: data.evidence || [],
          resolutionOptions: [],
          attempts: [],
          monitoringEvents: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ cases: [...state.cases, newCase] }));
        return id;
      },

      processCase: async (caseId) => {
        // Deterministic mock processing
        set((state) => ({
          cases: state.cases.map(c => 
            c.id === caseId ? { ...c, stage: "PROCESSING" } : c
          )
        }));

        // Simulate network delay
        await new Promise(r => setTimeout(r, 2000));

        set((state) => ({
          cases: state.cases.map(c => 
            c.id === caseId ? {
              ...c,
              stage: "AWAITING_APPROVAL",
              warrantyResult: { eligible: true, reason: "Product is within warranty period." },
              diagnosis: {
                issueCategory: "Audio Hardware Malfunction",
                troubleshootingSuggested: ["Reset earbuds", "Re-pair Bluetooth"],
                confidence: 96
              },
              resolutionOptions: MOCK_RESOLUTION_OPTIONS,
              recommendation: {
                recommendedOptionId: "opt_amazon",
                reason: "Eligible, zero cost, and low effort."
              }
            } : c
          )
        }));
      },

      approveResolution: async (caseId, optionId) => {
        set((state) => ({
          cases: state.cases.map(c => {
            if (c.id !== caseId) return c;
            
            const isReplan = c.stage === "AWAITING_REAPPROVAL";
            return {
              ...c,
              stage: "EXECUTING",
              approval: { optionId, timestamp: new Date().toISOString() },
              attempts: [
                ...c.attempts,
                {
                  id: `att_${Date.now()}`,
                  provider: isReplan ? "boAt" : "Amazon",
                  action: isReplan ? "Manufacturer Replacement" : "Replacement",
                  status: "PENDING",
                  retryable: false
                }
              ]
            };
          })
        }));
      },

      executeAttempt: async (caseId) => {
        const currentCase = get().cases.find(c => c.id === caseId);
        if (!currentCase || currentCase.attempts.length === 0) return;
        
        const latestAttempt = currentCase.attempts[currentCase.attempts.length - 1];
        
        // Simulate network/execution delay
        await new Promise(r => setTimeout(r, 1500));

        if (latestAttempt.provider === "Amazon") {
          // Force Amazon failure demo
          set((state) => ({
            cases: state.cases.map(c => {
              if (c.id !== caseId) return c;
              
              const updatedAttempts = [...c.attempts];
              updatedAttempts[updatedAttempts.length - 1] = {
                ...updatedAttempts[updatedAttempts.length - 1],
                status: "FAILED",
                failureCode: "INVENTORY_EXHAUSTED",
                failureReason: "Replacement inventory is unavailable."
              };

              return {
                ...c,
                stage: "FAILED",
                attempts: updatedAttempts,
              };
            })
          }));

          // Transition to replanning after a brief pause
          setTimeout(() => {
            set((state) => ({
              cases: state.cases.map(c => {
                if (c.id !== caseId) return c;
                
                // Update recommendation to manufacturer
                const updatedOptions = c.resolutionOptions.map(opt => ({
                  ...opt,
                  isRecommended: opt.id === "opt_manufacturer"
                }));

                return {
                  ...c,
                  stage: "AWAITING_REAPPROVAL",
                  resolutionOptions: updatedOptions,
                  recommendation: {
                    recommendedOptionId: "opt_manufacturer",
                    reason: "Amazon replacement is unavailable. Defaulting to Manufacturer."
                  }
                };
              })
            }));
          }, 2000);
          
        } else {
          // Manufacturer route succeeds
          set((state) => ({
            cases: state.cases.map(c => {
              if (c.id !== caseId) return c;
              
              const updatedAttempts = [...c.attempts];
              updatedAttempts[updatedAttempts.length - 1] = {
                ...updatedAttempts[updatedAttempts.length - 1],
                status: "SUCCESS",
              };

              return {
                ...c,
                stage: "MONITORING",
                attempts: updatedAttempts,
                monitoringEvents: [
                  { id: "e1", status: "SUBMITTED", message: "Request Submitted to boAt", timestamp: new Date().toISOString() }
                ]
              };
            })
          }));

          // Simulate monitoring lifecycle
          const events: ("PROCESSING" | "APPROVED" | "DISPATCHED" | "DELIVERED")[] = ["PROCESSING", "APPROVED", "DISPATCHED", "DELIVERED"];
          
          for (let i = 0; i < events.length; i++) {
            await new Promise(r => setTimeout(r, 1000));
            set((state) => ({
              cases: state.cases.map(c => {
                if (c.id !== caseId) return c;
                return {
                  ...c,
                  monitoringEvents: [
                    ...c.monitoringEvents,
                    { id: `e${i+2}`, status: events[i], message: `Status updated to ${events[i]}`, timestamp: new Date().toISOString() }
                  ]
                };
              })
            }));
          }

          // Move to verification
          setTimeout(() => {
            set((state) => ({
              cases: state.cases.map(c => 
                c.id === caseId ? { ...c, stage: "AWAITING_VERIFICATION" } : c
              )
            }));
          }, 1000);
        }
      },

      verifyOutcome: (caseId, isFixed) => {
        set((state) => ({
          cases: state.cases.map(c => {
            if (c.id !== caseId) return c;
            
            if (isFixed) {
              return {
                ...c,
                stage: "RESOLVED",
                verificationResult: {
                  userConfirmed: true,
                  goalAchieved: true,
                  timestamp: new Date().toISOString()
                }
              };
            } else {
              // Return to replanning state if not fixed
               return {
                ...c,
                stage: "REPLANNING",
                verificationResult: {
                  userConfirmed: true,
                  goalAchieved: false,
                  timestamp: new Date().toISOString()
                },
                recommendation: {
                  recommendedOptionId: "opt_repair",
                  reason: "Replacement did not fix the issue. Paid repair or alternative needed."
                }
              };
            }
          })
        }));
      },

      resetDemo: () => set({ 
        user: null, 
        products: MOCK_PRODUCTS, 
        cases: MOCK_CASES 
      }),

    }),
    {
      name: "warranturn-storage",
    }
  )
);
