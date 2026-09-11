# Warranturn --- Complete Project Implementation Plan

**Agentic AI System for Autonomous Post-Purchase Product Resolution**

> **"A warranty claim is one possible action. Resolution is the goal."**

------------------------------------------------------------------------

## 1. Project Overview

Warranturn is a consumer-side autonomous post-purchase product
resolution agent. Instead of treating a warranty claim as the final
objective, Warranturn keeps the user's real goal fixed --- for example,
**getting a malfunctioning product working again** --- and dynamically
chooses, executes, monitors and, when necessary, replans the resolution
path.

The complete system should demonstrate:

**Goal → Decision → Action → Intermediate Result → Adaptation → Final
Outcome**

The Round 1 prototype should focus on demonstrating genuine agentic
behavior rather than simply presenting a warranty tracker, chatbot,
form-filling tool or static claim-management system.

------------------------------------------------------------------------

## 2. Core Concept

> **A warranty claim is one possible action. Resolution is the goal.**

The core agentic loop is:

``` text
OBSERVE
   ↓
DIAGNOSE
   ↓
DECIDE
   ↓
ACT
   ↓
MONITOR
   ↓
VERIFY
```

If the goal has not been achieved:

``` text
REPLAN
   ↓
ACT AGAIN
   ↓
VERIFY
```

The important principle is that the **user's goal remains fixed while
the execution plan can change dynamically**.

For example:

``` text
Goal:
Get my earbuds working again.

Initial Plan:
Amazon Replacement

Result:
Amazon replacement unavailable.

New Plan:
Manufacturer Replacement

Final:
Product delivered → User confirms issue is resolved.
```

------------------------------------------------------------------------

# 3. Complete System Architecture

``` text
                         USER
                           ↓
                 ┌──────────────────┐
                 │     FRONTEND     │
                 │ Next.js + React  │
                 └────────┬─────────┘
                          ↓
                 ┌──────────────────┐
                 │ BACKEND / DATA   │
                 │ API + Supabase   │
                 │ Auth + DB + File │
                 │ Storage          │
                 └────────┬─────────┘
                          ↓
                 ┌──────────────────┐
                 │    n8n AGENT     │
                 │ Agent Workflow   │
                 └────────┬─────────┘
                          ↓
             ┌────────────┼────────────┐
             ↓            ↓            ↓
          Amazon     Manufacturer   Service Network
          Adapter       Adapter        Adapter
             ↓            ↓            ↓
             Controlled / External Resolution Systems
                          ↓
                     Result / Error
                          ↓
                    Monitoring / State
                    ↙              ↘
                Success          Failure
                   ↓                ↓
             Verification     Failure Analysis
                   ↓                ↓
                RESOLVED        REPLANNING
                                      ↓
                                 New Approval
                                      ↓
                                  New Action
                                      ↓
                                  Verification
```

------------------------------------------------------------------------

# 4. Technology Stack

  -----------------------------------------------------------------------
  Layer                   Technology / Approach   Purpose
  ----------------------- ----------------------- -----------------------
  Frontend                Next.js + React +       Warranturn web
                          Tailwind CSS            application

  Authentication          Supabase Auth           Login, signup and user
                                                  identity

  Database                Supabase PostgreSQL     Products, cases,
                                                  evidence, attempts and
                                                  persistent state

  Storage                 Supabase Storage        Invoices and product
                                                  photos

  Agent orchestration     n8n                     Agent workflow,
                                                  routing, approvals,
                                                  execution, monitoring
                                                  and replanning

  AI                      LLM + OCR/Vision        Understanding, evidence
                                                  extraction, diagnosis,
                                                  recommendation and
                                                  failure analysis

  Integration layer       Provider adapter        Common interface for
                          architecture            different resolution
                                                  channels

  Round 1 external        Controlled demo/mock    Reliable demonstration
  systems                 providers               of external actions and
                                                  failures

  Deployment              Vercel + Supabase + n8n Complete deployed
                                                  prototype
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 5. Project Setup & Repository Structure

``` text
Warranturn/
│
├── frontend/
├── backend/
├── n8n/
├── integrations/
│   ├── amazon/
│   ├── manufacturer/
│   └── service-network/
│
├── mock-systems/
├── database/
├── tests/
├── docs/
│
├── .env.example
├── .gitignore
└── README.md
```

The repository should contain the complete project code, n8n workflow
exports/configuration, integration contracts, mock systems, database
setup and documentation.

Secrets must never be committed to GitHub.

------------------------------------------------------------------------

# 6. Authentication, Database & Storage

Supabase will provide:

-   Authentication
-   PostgreSQL database
-   File storage
-   Persistent application state

## Main database tables

### `users`

``` text
id
email
name
created_at
```

### `products`

``` text
id
user_id
brand
product_name
model
serial_number
purchase_date
purchase_source
seller
order_id
price
warranty_expiry
created_at
```

### `cases`

``` text
id
user_id
product_id
original_goal
issue_description
status
current_stage
created_at
updated_at
```

### `evidence`

``` text
id
case_id
type
file_url
extracted_data
confidence
created_at
```

### `resolution_options`

``` text
id
case_id
provider
action
cost
estimated_time
success_probability
customer_effort
eligibility
score
```

### `attempts`

``` text
id
case_id
provider
action
status
failure_code
failure_reason
created_at
```

### `monitoring_events`

``` text
id
case_id
attempt_id
status
message
timestamp
```

### `verification`

``` text
id
case_id
status
user_confirmed
goal_achieved
created_at
```

Use Row Level Security so users can access only their own information.

------------------------------------------------------------------------

# 7. Frontend Implementation

The frontend will provide the complete user-facing Warranturn
experience.

## 7.1 Login / Signup

Users should be able to:

-   Create an account
-   Log in
-   Access their authenticated dashboard

------------------------------------------------------------------------

## 7.2 Dashboard / Product Wallet

The dashboard should display the user's saved products.

Example:

``` text
Welcome back

My Products

┌────────────────────┐
│ Wireless Earbuds   │
│ Amazon             │
│ Warranty: Active   │
└────────────────────┘

+ Add Product
```

The Product Wallet should contain product information extracted from
invoices and previous cases.

------------------------------------------------------------------------

## 7.3 Add Product / Report Issue

The user should be able to describe a problem using natural language.

Example:

> "My right earbud is making a crackling sound."

The user can upload:

-   Invoice / receipt
-   Product photo
-   Additional evidence where required

------------------------------------------------------------------------

## 7.4 Agent Processing Screen

The frontend should show understandable progress states such as:

``` text
✓ Understanding issue
✓ Checking product information
✓ Verifying warranty
✓ Diagnosing problem
✓ Comparing resolution options
```

The UI should show **decision states and useful results**, not fake AI
"thinking".

------------------------------------------------------------------------

## 7.5 Resolution Options

Display the available routes in a clear comparison.

Example:

``` text
Amazon Replacement
₹0
3–5 days

Manufacturer Replacement
₹0
5–7 days

Paid Repair
₹500
7–10 days
```

The exact values should come from the resolution engine/provider data
rather than being blindly hardcoded into the frontend.

------------------------------------------------------------------------

## 7.6 Recommendation & Approval

Show:

``` text
Recommended:
Amazon Replacement

Why:
Eligible
Lower customer effort
Faster expected resolution
```

Then require explicit user approval:

``` text
[ Approve ]
[ Choose another option ]
```

------------------------------------------------------------------------

## 7.7 Monitoring

Display the current resolution state:

``` text
✓ Request Submitted
✓ Processing
✓ Approved
✓ Dispatched
✓ Delivered
```

------------------------------------------------------------------------

## 7.8 Failure & Replanning

If an action fails, the frontend should clearly communicate it.

Example:

``` text
Amazon Replacement
FAILED

Reason:
Replacement inventory is unavailable.

Warranturn is evaluating another resolution route...
```

Then show the new recommendation:

``` text
New Recommendation

Manufacturer Replacement

Reason:
Amazon replacement is unavailable.
```

------------------------------------------------------------------------

## 7.9 Final Verification

After delivery:

``` text
Has the original issue been resolved?

[ Yes, it's fixed ]
[ No, still having the issue ]
```

The case should become **RESOLVED** only after the original goal is
verified.

------------------------------------------------------------------------

# 8. Backend & API Layer

The backend acts as the bridge between:

``` text
Frontend
   ↕
Backend
   ↕
Supabase
   ↕
n8n
```

The backend should handle:

-   Authentication
-   Case creation
-   Product storage
-   Evidence storage
-   n8n invocation
-   State persistence
-   Approval handling
-   Monitoring state
-   Verification state

## Suggested APIs

``` text
POST /api/cases
GET  /api/cases/:id

POST /api/evidence

POST /api/cases/:id/process

GET  /api/cases/:id/status

POST /api/cases/:id/approve

POST /api/cases/:id/verify
```

The backend must never expose private credentials or API keys to the
frontend.

------------------------------------------------------------------------

# 9. Evidence Processing

The evidence system processes:

``` text
Invoice
+
Product Photo
+
User Description
```

OCR/Vision should extract information such as:

-   Brand
-   Product name
-   Model
-   Purchase date
-   Purchase source
-   Seller
-   Order ID
-   Price
-   Serial/model number
-   Warranty information
-   Visible damage

Example:

``` json
{
  "brand": "boAt",
  "model": "Airdopes 141",
  "purchase_source": "Amazon",
  "purchase_date": "2026-05-12",
  "confidence": 0.96
}
```

The system must follow one important rule:

> **Never invent information that is not supported by the evidence.**

If required information is missing, the system should ask the user for
it.

------------------------------------------------------------------------

# 10. Understanding Agent

The agent converts the user's natural-language request into structured
information.

Example:

``` text
Goal:
Get earbuds working again

Issue:
Crackling audio

Symptoms:
Right-side audio distortion

Category:
Audio malfunction

Severity:
Medium
```

The understanding stage should identify:

-   User goal
-   Issue
-   Symptoms
-   Product
-   Constraints
-   Missing information
-   Confidence

It should not make the final resolution decision at this stage.

------------------------------------------------------------------------

# 11. Warranty & Eligibility Engine

The system should evaluate:

``` text
Purchase date
+
Warranty period
+
Product
+
Manufacturer
+
Purchase source
+
Issue type
+
Evidence
```

Example:

``` text
Warranty:
ELIGIBLE

Reason:
Product is within warranty period.
```

Where appropriate, official manufacturer support/warranty information
should be used as supporting evidence.

The system should not invent warranty rules.

------------------------------------------------------------------------

# 12. Diagnosis Agent

The diagnosis stage uses:

``` text
User issue
+
Product information
+
Evidence
+
Official troubleshooting guidance
```

Example safe troubleshooting:

``` text
1. Reset earbuds
2. Re-pair Bluetooth
3. Test on another device
4. Check whether issue persists
```

The diagnosis stage should:

-   Identify likely issue categories.
-   Suggest safe troubleshooting.
-   Avoid dangerous hardware modification instructions.
-   Decide whether troubleshooting is sufficient.
-   Pass unresolved cases to the resolution engine.

------------------------------------------------------------------------

# 13. Resolution Engine

The Resolution Engine is the core decision layer.

Possible routes include:

``` text
Amazon Replacement
Amazon Refund
Seller Return
Manufacturer Replacement
Manufacturer Repair
Authorized Service
Paid Repair
```

Each route should be evaluated using:

-   Eligibility
-   Cost
-   Estimated time
-   Success probability
-   Customer effort
-   Availability
-   Goal fit

## Example scoring

  Criterion               Example Weight
  --------------------- ----------------
  Eligibility                        25%
  Success probability                20%
  Cost                               15%
  Time                               15%
  Customer effort                    10%
  Availability                       10%
  Goal fit                            5%

The scoring should be deterministic and explainable.

The AI should not secretly make the numerical decision.

------------------------------------------------------------------------

# 14. Recommendation Agent

The recommendation stage converts the resolution engine's result into a
clear explanation for the user.

Example:

``` text
Recommended:
Amazon Replacement

Why:
• Eligible
• ₹0 estimated cost
• Faster than manufacturer route
• Lower customer effort
```

The recommendation should explain **why the selected route fits the
user's goal**.

------------------------------------------------------------------------

# 15. User Approval System

Consequential external actions must require explicit user approval.

Example:

``` text
Recommended Resolution

Amazon Replacement

Estimated Cost:
₹0

Estimated Time:
3–5 days

[ Approve ]
[ Choose another option ]
```

Approval must be enforced by the backend/agent execution guard and not
only by the frontend UI.

------------------------------------------------------------------------

# 16. Provider Adapter Architecture

The agent decides:

> **WHAT should happen?**

The provider adapter decides:

> **HOW should it be executed?**

Use a common provider interface:

``` text
ResolutionProvider

checkEligibility()
getOptions()
submitRequest()
getStatus()
getFailureReason()
```

Implement provider adapters such as:

``` text
AmazonAdapter
ManufacturerAdapter
ServiceNetworkAdapter
```

This keeps the agent independent of any particular company or resolution
channel.

The architecture can later support legitimate authorized integrations.

------------------------------------------------------------------------

# 17. Controlled Demo / Mock External Systems

For Round 1, the core demonstration should not depend on:

-   Live Amazon login
-   OTP
-   CAPTCHA
-   Unstable website UI
-   Account-specific access
-   Unreliable external automation

Instead, create controlled provider systems such as:

``` text
/mock-systems/amazon
/mock-systems/manufacturer
/mock-systems/service-network
```

These systems should behave like resolution providers for the purpose of
the demo.

**Important:** They must be clearly treated as controlled demo/mock
systems and must not be presented as real Amazon or manufacturer
integrations.

------------------------------------------------------------------------

# 18. n8n Agent Implementation

n8n will act as the **agent orchestration and execution layer**.

The workflow should coordinate:

-   Input processing
-   AI reasoning stages
-   Evidence processing
-   Warranty checks
-   Diagnosis
-   Resolution generation
-   Deterministic scoring
-   Recommendation
-   User approval
-   Provider routing
-   External action execution
-   Monitoring
-   Failure analysis
-   Replanning
-   Verification

The n8n workflow should maintain structured state throughout the case.

------------------------------------------------------------------------

# 19. End-to-End n8n Workflow

``` text
Webhook
  ↓
Normalize Input
  ↓
Understanding Agent
  ↓
Structured Output
  ↓
Evidence Required?
  ├── YES → OCR/Vision → Evidence Validation
  └── NO
        ↓
Product Create/Update
        ↓
Manufacturer Identification
        ↓
Official Information Retrieval
        ↓
Warranty Calculation
        ↓
Diagnosis Agent
        ↓
Troubleshooting
        ↓
Evidence Package
        ↓
Generate Resolution Options
        ↓
Deterministic Scoring
        ↓
Recommendation Agent
        ↓
User Approval
        ↓
Approval Guard
        ↓
Provider Router
        ↓
Provider Adapter
        ↓
Action Result
        ↓
Monitoring
        ↓
Success?
  ├── YES → Verification → User Confirmation → RESOLVED
  └── NO
       ↓
  Failure Analysis
       ↓
  Replanning Agent
       ↓
  New Recommendation
       ↓
  Second Approval
       ↓
  New Provider
       ↓
  Monitoring
       ↓
  Verification
```

------------------------------------------------------------------------

# 20. Failure Detection & Failure Analysis

The demo should intentionally create a meaningful failure.

Example Amazon response:

``` json
{
  "success": false,
  "status": "FAILED",
  "failure_code": "INVENTORY_EXHAUSTED",
  "failure_reason": "Replacement inventory is unavailable",
  "retryable": false
}
```

The system should not simply display an error.

The agent should determine:

``` text
Why did the action fail?
        ↓
Can it be retried?
        ↓
Is retrying useful?
        ↓
What alternatives remain?
        ↓
Does the plan need to change?
```

------------------------------------------------------------------------

# 21. Replanning & Adaptation

The original user goal must remain unchanged.

Example:

``` text
ORIGINAL GOAL
Get my earbuds working again.
        ↓
PLAN 1
Amazon Replacement
        ↓
FAILURE
Inventory unavailable
        ↓
FAILURE ANALYSIS
Retry is not useful
        ↓
REPLAN
Evaluate remaining eligible routes
        ↓
PLAN 2
Manufacturer Replacement
```

The agent should then obtain approval for the new consequential action.

This is the key demonstration of autonomous adaptation.

------------------------------------------------------------------------

# 22. Monitoring System

Every action attempt should have a status lifecycle.

Example:

``` text
SUBMITTED
    ↓
PROCESSING
    ↓
APPROVED
    ↓
DISPATCHED
    ↓
DELIVERED
```

Each important state change should be stored as a monitoring event.

Example:

``` text
attempt_id
status
message
timestamp
```

The frontend uses these events to create the resolution timeline.

------------------------------------------------------------------------

# 23. Verification System

The system must distinguish:

> **Action completed**

from:

> **User's goal achieved**

For example:

``` text
Replacement delivered
        ↓
Ask user:
"Does the product now work correctly?"
        ↓
YES
        ↓
GOAL ACHIEVED
        ↓
RESOLVED
```

If the user answers **No**, the case remains unresolved and the system
can re-enter the resolution loop.

------------------------------------------------------------------------

# 24. Canonical Agent State

The frontend, backend and n8n workflow should use a consistent state
structure.

``` json
{
  "session_id": "",
  "user_id": "",
  "original_goal": "",

  "product": {},

  "issue": {},

  "evidence": [],

  "warranty": {},

  "diagnosis": {},

  "resolution_options": [],

  "recommendation": {},

  "approval": {},

  "current_plan": {},

  "attempt_history": [],

  "current_attempt": {},

  "action_result": {},

  "monitoring": {},

  "failure": {},

  "replanned_plan": {},

  "verification": {},

  "final_outcome": {}
}
```

This prevents different parts of the system from maintaining
incompatible versions of the case.

------------------------------------------------------------------------

# 25. Frontend ↔ Agent Data Contract

The interface between the frontend/backend and n8n should be clearly
defined before integration.

## Frontend → Agent

``` json
{
  "case_id": "123",
  "user_goal": "Get my earbuds working again",
  "issue_description": "Right earbud has crackling audio",
  "product_id": "p001",
  "evidence": []
}
```

## Agent → Frontend

``` json
{
  "case_id": "123",
  "stage": "AWAITING_APPROVAL",
  "diagnosis": "...",
  "options": [],
  "recommendation": {},
  "approval_required": true
}
```

## Failure / Replanning Result

``` json
{
  "case_id": "123",
  "stage": "REPLANNED",
  "failure": {
    "provider": "Amazon",
    "reason": "Replacement inventory unavailable"
  },
  "new_recommendation": {
    "provider": "Manufacturer",
    "action": "replacement"
  },
  "approval_required": true
}
```

This contract should be treated as the compatibility boundary between
the application and the agent.

------------------------------------------------------------------------

# 26. Failure Scenario

The primary demo should use a controlled failure to show adaptation.

### Step 1 --- User Goal

> "Get my earbuds working again."

### Step 2 --- Issue

> "My right earbud is making a crackling sound."

### Step 3 --- Evidence

Invoice/product evidence is uploaded.

### Step 4 --- Understanding

Product and issue information are extracted.

### Step 5 --- Warranty

The system determines that the product is eligible.

### Step 6 --- Diagnosis

The system identifies the likely issue and performs/records safe
troubleshooting.

### Step 7 --- Resolution Options

``` text
Amazon Replacement
Manufacturer Replacement
Paid Repair
```

### Step 8 --- Recommendation

Amazon Replacement is selected based on the resolution score.

### Step 9 --- Approval

The user approves.

### Step 10 --- Execution

Amazon Demo Provider is called.

### Step 11 --- Failure

``` text
INVENTORY_EXHAUSTED
```

### Step 12 --- Failure Analysis

The agent determines that retrying the same route is not useful.

### Step 13 --- Replanning

The agent evaluates remaining options.

### Step 14 --- New Recommendation

Manufacturer Replacement.

### Step 15 --- Second Approval

The user approves.

### Step 16 --- Execution

Manufacturer provider is called.

### Step 17 --- Monitoring

``` text
SUBMITTED
→ APPROVED
→ DISPATCHED
→ DELIVERED
```

### Step 18 --- Verification

The user confirms the product works.

### Step 19 --- Final Outcome

``` text
RESOLVED
GOAL ACHIEVED
```

------------------------------------------------------------------------

# 27. Testing Strategy

The system should be tested using multiple scenarios.

  -----------------------------------------------------------------------
  Scenario                            Expected Behavior
  ----------------------------------- -----------------------------------
  Normal success                      Issue → diagnosis → Amazon →
                                      success → delivery → verification →
                                      resolved

  Amazon failure                      Amazon → inventory failure →
                                      failure analysis → replan →
                                      manufacturer → success

  Warranty expired                    Warranty route rejected → another
                                      valid route recommended

  Missing invoice                     Agent requests evidence → user
                                      uploads → workflow continues

  User rejects recommendation         Alternative route is presented →
                                      new approval

  Product still broken                User says no → goal remains
                                      unresolved → another resolution
                                      cycle
  -----------------------------------------------------------------------

Testing should cover both individual components and the complete
end-to-end workflow.

------------------------------------------------------------------------

# 28. Security Requirements

-   Use Supabase Authentication.
-   Use Row Level Security.
-   Keep invoice and photo storage private.
-   Never expose API keys in frontend code.
-   Store secrets in environment variables and n8n credentials.
-   Never commit `.env` or secrets to GitHub.
-   Require explicit user approval before consequential actions.
-   Validate agent-generated actions against an allowlisted
    provider/action schema.
-   Do not allow arbitrary external actions from the LLM.
-   Do not expose chain-of-thought.
-   Show concise decision explanations instead of internal reasoning
    traces.

------------------------------------------------------------------------

# 29. Token & API Optimization

Because the project should be buildable and demoable with limited API
usage:

-   Use AI only where reasoning or extraction is genuinely required.
-   Use deterministic code for scoring, validation and calculations.
-   Avoid repeated calls for the same evidence.
-   Store extracted information in persistent state.
-   Keep prompts focused and structured.
-   Reuse official information rather than repeatedly retrieving the
    same content.
-   Use mock providers for repeated testing.
-   Avoid unnecessary LLM calls during frontend development.
-   Keep the main demo deterministic so it does not depend on
    unpredictable model outputs.

------------------------------------------------------------------------

# 30. Deployment Architecture

``` text
                Warranturn Web App
                       ↓
                    Vercel
                       ↓
                Backend / API
                       ↓
                  Supabase
            ┌──────────┼──────────┐
            ↓          ↓          ↓
          Auth        DB       Storage
                       ↓
                      n8n
                       ↓
              Provider Adapters
                       ↓
             Controlled Demo APIs
```

The final deployed system should feel like one unified Warranturn
product even though its internal components are separated.

------------------------------------------------------------------------

# 31. Step-by-Step Build Order

## Phase 1 --- Foundation

1.  Create the Warranturn GitHub repository.
2.  Create the project structure.
3.  Set up Next.js and Tailwind.
4.  Set up Supabase.
5.  Create database schema.
6.  Configure authentication and storage.
7.  Set up n8n.

## Phase 2 --- Contracts & Infrastructure

8.  Define the canonical agent state.
9.  Define frontend ↔ backend API contracts.
10. Define backend ↔ n8n input/output contracts.
11. Define the provider adapter interface.

## Phase 3 --- External Resolution Simulation

12. Build the controlled Amazon provider.
13. Build the controlled Manufacturer provider.
14. Add deterministic failure responses.
15. Add deterministic success/status responses.

## Phase 4 --- Agent

16. Implement input understanding.
17. Implement evidence processing.
18. Implement warranty/eligibility.
19. Implement diagnosis.
20. Implement resolution option generation.
21. Implement deterministic scoring.
22. Implement recommendation.
23. Implement approval gate.
24. Implement provider routing.
25. Implement action execution.
26. Implement monitoring.
27. Implement failure analysis.
28. Implement replanning.
29. Implement second approval.
30. Implement verification.

## Phase 5 --- Application

31. Build dashboard.
32. Build Product Wallet.
33. Build issue submission.
34. Build evidence upload.
35. Build agent progress screen.
36. Build resolution comparison.
37. Build approval UI.
38. Build monitoring timeline.
39. Build failure/replanning UI.
40. Build verification UI.
41. Build final RESOLVED screen.

## Phase 6 --- Integration

42. Connect frontend to backend.
43. Connect backend to Supabase.
44. Connect backend to n8n.
45. Connect n8n to provider adapters.
46. Connect provider results back to persistent state.
47. Connect monitoring events to the frontend.
48. Test the complete workflow.

## Phase 7 --- Finalization

49. Test normal success.
50. Test Amazon failure and replanning.
51. Test missing evidence.
52. Test expired warranty.
53. Test rejected recommendation.
54. Test failed verification.
55. Fix integration bugs.
56. Deploy.
57. Prepare architecture diagram.
58. Finalize README.
59. Record the 3--5 minute demo.
60. Prepare the hackathon submission.

------------------------------------------------------------------------

# 32. Final Demo Flow

``` text
USER

"My right earbud is making a crackling sound."
        ↓
Upload invoice / product evidence
        ↓
Warranturn extracts product information
        ↓
Warranty eligibility check
        ↓
Diagnosis
        ↓
Resolution options
        ↓
Agent recommends Amazon replacement
        ↓
USER APPROVES
        ↓
Amazon Demo Provider
        ↓
FAILED
INVENTORY_EXHAUSTED
        ↓
Failure Analysis
        ↓
REPLANNING
        ↓
Manufacturer replacement selected
        ↓
USER APPROVES AGAIN
        ↓
Manufacturer Provider
        ↓
SUBMITTED
        ↓
APPROVED
        ↓
DISPATCHED
        ↓
DELIVERED
        ↓
USER VERIFICATION
        ↓
"Yes, it's fixed."
        ↓
✓ GOAL ACHIEVED
✓ RESOLVED
```

------------------------------------------------------------------------

# 33. What the Judges Should See

The demo should clearly demonstrate:

### 1. Goal

The system understands the user's actual objective.

> "Get my earbuds working again."

### 2. Decision

The system evaluates multiple resolution routes and chooses the best
available route.

### 3. Action

The system executes the chosen action through a provider adapter.

### 4. Intermediate Result

The first action produces a real structured result.

### 5. Failure

The selected route fails.

``` text
Amazon Replacement
→ INVENTORY_EXHAUSTED
```

### 6. Adaptation

The agent does not stop.

It:

``` text
Analyze failure
→ Evaluate alternatives
→ Replan
→ Recommend new route
→ Ask approval
→ Execute again
```

### 7. Verification

The system does not assume that a submitted claim or delivered
replacement means success.

It asks the user whether the original goal was achieved.

------------------------------------------------------------------------

# 34. Final Project Outcome

A successful Warranturn prototype will demonstrate a consumer-facing
autonomous resolution system that can:

1.  Understand a user's product issue.
2.  Identify the product and purchase information.
3.  Gather and validate evidence.
4.  Determine warranty/eligibility.
5.  Diagnose the issue safely.
6.  Generate multiple resolution routes.
7.  Compare and score those routes.
8.  Recommend a goal-fit resolution.
9.  Obtain explicit user approval.
10. Execute through a provider adapter.
11. Monitor the action.
12. Detect failure.
13. Analyze why the action failed.
14. Replan using remaining options.
15. Obtain approval for the new action.
16. Execute the new resolution.
17. Monitor the new attempt.
18. Verify the actual user outcome.
19. Mark the case resolved only when the original goal is achieved.

------------------------------------------------------------------------

# 35. Core Agentic Loop

``` text
              OBSERVE
                 ↓
              DIAGNOSE
                 ↓
               DECIDE
                 ↓
                ACT
                 ↓
             MONITOR
                 ↓
              VERIFY
                 ↓
        ┌─────────────────┐
        │ Goal achieved?  │
        └───────┬─────────┘
            YES │       │ NO
                ↓       ↓
             RESOLVED  REPLAN
                        ↓
                    ACT AGAIN
                        ↓
                     VERIFY
```

> ## **"A warranty claim is one possible action. Resolution is the goal."**
