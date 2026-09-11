# Warranturn

> **Consumer Problems. Real Resolutions.**  
> *"A warranty claim is one possible action. Resolution is the goal."*

Warranturn is an autonomous AI agent designed for consumer post-purchase product resolution. Rather than acting as a passive warranty tracker, chatbot, or form-filler, Warranturn maintains an active, invariant user goal: **to restore product functionality with minimum cost, time, and friction**.

When an initial resolution path fails (e.g., inventory exhaustion, service center backlog), Warranturn intercepts the failure, re-evaluates the remaining options, proposes an alternative plan, and tracks execution through to verified completion.

---

## 🔁 Continuous Agent Loop

Warranturn runs a closed-loop control cycle with failure recovery:

```
[ OBSERVE ] ──> [ DIAGNOSE ] ──> [ DECIDE ] ──> [ ACT ] ──> [ MONITOR ] ──> [ VERIFY ]
     ▲                                                                            │
     │                                                                            ▼
[ ACT AGAIN ] <── [ REPLAN ] <────── (If Path Fails or Inventory Exhausted) ──────┘
```

1. **Observe:** Ingests conversational issue description and multimodal evidence (receipt OCR, product photos).
2. **Diagnose:** Rules out trivial configuration issues via guided troubleshooting and classifies hardware faults.
3. **Decide:** Dynamically evaluates a multi-criteria option matrix (Retailer Replacement, Brand Warranty, Service Center, Paid Repair).
4. **Act:** Dispatches requests through modular integration adapters after explicit Human-in-the-Loop (HITL) approval.
5. **Monitor:** Tracks status against SLA milestones and catches asynchronous failure signals.
6. **Replan:** Intercepts failures without abandoning the user goal, pruning invalid routes and presenting a reasoned alternative.
7. **Verify:** Validates physical delivery and prompts the user to test functionality before marking the goal achieved.

---

## 🏛️ System Architecture & Modularity

The external integration layer is **completely decoupled** from the core agent orchestration:

```
Core Agent State Machine (Orchestration)
         │
         ▼
Abstract Provider Interface (IResolutionProvider)
         ├── Amazon Adapter
         ├── Manufacturer Adapter (boAt / OEM)
         └── Service Network Adapter
```

> **⚠️ Important Notice on External Integrations:**  
> For the hackathon MVP, third-party interactions (Amazon, boAt, Authorized Service Centers) are powered by **controlled, deterministic demo adapters**. They simulate real-world API responses, SLA timelines, and failure states.  
> They are **not** live web scrapers or unauthorized automated bots. The architecture is explicitly designed so that production OAuth / SP-API credentials can replace demo adapters without rewriting agent logic.

---

## 🛠️ Technology Stack

* **Frontend & Full-Stack:** Next.js 14/15 (App Router), React, Tailwind CSS, Lucide Icons, Radix UI.
* **Orchestration:** Finite-state agent graph controller with strict Human-in-the-Loop gates.
* **AI & Vision:** Google Gemini 1.5 Flash (multimodal receipt OCR & damage check) and Gemini 1.5 Pro (diagnostic & replan reasoning).
* **Database & Persistence:** Supabase (PostgreSQL + Storage) with local in-memory/JSON state fallback.
* **Testing:** Fast headless TypeScript test runner for end-to-end loop verification.

---

## 📁 Project Directory Structure

```text
Warranturn/
├── agents/
│   ├── evidence/               # Step 3: OCR & multimodal receipt/photo extractor
│   ├── diagnosis/              # Step 4: Symptom analysis, policy checking, troubleshooting
│   ├── resolution/             # Step 5: Trade-off scoring & decision engine
│   ├── monitoring/             # Step 9: SLA & status lifecycle tracking
│   ├── replanning/             # Step 10: Failure analysis & fallback replanner
│   └── verification/           # Step 11: Delivery validation & user sign-off
├── backend/                    # API endpoints, event streams & server actions
├── database/
│   ├── schema.sql              # PostgreSQL relational schema
│   └── seeds/                  # Pre-seeded Product Wallet items (MacBook Air, Galaxy S23)
├── docs/                       # Implementation plan, demo script & judge guide
├── frontend/                   # Next.js UI (Product Wallet, Chat, Replan Graph)
├── integrations/
│   ├── contracts/              # Standard interfaces (IResolutionProvider)
│   ├── amazon/                 # Amazon Demo Adapter (simulates replacement failure)
│   ├── manufacturer/           # OEM Demo Adapter (simulates boAt RMA success)
│   └── service-network/        # Service Network Demo Adapter
├── mock-systems/
│   └── scenarios/              # Controlled failure injection configurations
├── orchestration/              # Core Agent Loop & State Machine (Observe -> Verify)
├── shared/
│   ├── schemas/                # JSON schemas for structured LLM outputs
│   └── types/                  # SessionState, Product, ResolutionOption types
├── tests/                      # Automated smoke tests for agent loop & replan logic
└── tools/                      # Deterministic tool executions called by agents
```

---

## 🚀 Team Getting Started Guide

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.18 or higher recommended)
* Git

### Local Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yoyostuu/Warranturn.git
   cd Warranturn
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Add your free `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/).

3. **Install dependencies (when implementation starts):**
   ```bash
   npm install
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔒 Security & Safe Development Principles

* **Zero Secrets in Git:** Never commit `.env`, `.env.local`, or private API tokens.
* **Human Approval Gates:** The agent cannot trigger financial or physical service requests without explicit user consent.
* **Separation of Concerns:** Internal chain-of-thought is logged separately in debugging telemetry; users receive concise, transparent summaries.
