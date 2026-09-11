import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { ResolutionSession } from "@/types/chat"

interface ChatState {
  sessions: Record<string, ResolutionSession>
  _hasHydrated: boolean
  
  // Actions
  setHasHydrated: (state: boolean) => void
  addOrUpdateSession: (session: ResolutionSession) => void
  getSession: (sessionId: string) => ResolutionSession | undefined
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: {},
      _hasHydrated: false,
      
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      
      addOrUpdateSession: (session) => 
        set((state) => ({
          sessions: { ...state.sessions, [session.sessionId]: session }
        })),
        
      getSession: (sessionId) => get().sessions[sessionId],
    }),
    {
      name: "warranturn-chat-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
)
