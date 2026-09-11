# Warranturn Frontend

This is the fully functioning, premium dark-only frontend for Warranturn, an autonomous post-purchase resolution interface. 

## Setup Commands

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run local development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Available Routes

- `/` — Polished landing page introducing the agentic workflow.
- `/login` — Frontend-only demo login.
- `/signup` — Frontend-only demo signup.
- `/dashboard` — Authenticated overview of saved products, active cases, and required actions.
- `/products` — Product Wallet showing all owned products and warranty statuses.
- `/products/new` — (Demo placeholder) Add a product workflow.
- `/products/[productId]` — Product details, warranty, evidence, and case history.
- `/cases` — Overview of all resolution cases.
- `/cases/new` — Polished multi-step workflow to report an issue (includes "Use Demo Scenario" shortcut).
- `/cases/[caseId]` — Unified dynamic case workspace demonstrating the full resolution lifecycle.

## Demo Workflow

The demo illustrates the core product principle: "A warranty claim is one possible action. Resolution is the goal."
1. Sign up/log in with any credentials.
2. Navigate to "Resolve an issue" (`/cases/new`).
3. Click "Use Demo Scenario" to prefill the boAt Airdopes 141 crackling audio story.
4. Submit the case. You will be redirected to the dynamic case workspace.
5. The agent will show its processing steps and present 3 options.
6. Approve the recommended "Amazon Replacement".
7. The Amazon replacement will intentionally **FAIL** (INVENTORY_EXHAUSTED).
8. The system will replan and present the "Manufacturer Replacement" as the new recommendation.
9. Approve the new plan.
10. Watch the monitoring timeline progress to DELIVERED.
11. Finally, verify the outcome by clicking "Yes, it's fixed" to resolve the case.

## State Architecture & Mock Integration

The state is managed using **Zustand** with persistence (`localStorage`), located in `src/store/index.ts`. 

- **Domain Types:** Found in `src/types/index.ts`.
- **Mock Fixtures:** Found in `src/store/fixtures.ts`.
- **State Machine:** The Zustand store (`src/store/index.ts`) acts as an asynchronous mock adapter. It handles state transitions (e.g., `processCase`, `executeAttempt`) deterministically using `setTimeout` to mimic network/backend delays.

### Replacing the Mock Adapter

When the backend team is ready to connect the real n8n/Supabase implementation:
1. Replace the asynchronous actions in `src/store/index.ts` with real API calls (using `fetch` or a client SDK) hitting the actual backend endpoints.
2. Ensure the backend endpoints return JSON payloads that match the exact shape of the strict TypeScript models defined in `src/types/index.ts`.
3. The UI components are completely decoupled from the data source and will automatically react to the updated Zustand state.

## Security Confirmation

**CONFIRMATION:** This frontend is a 100% simulated, closed-loop demo. No real external providers (Amazon, boAt, LLMs) are contacted. No real API keys, Supabase credentials, or backend endpoints are implemented.
