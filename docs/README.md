# BharatMCP — Complete Product Document

---

## 1. THE IDEA

BharatMCP is a platform that gives any website an AI chatbot that can actually
DO things — not just answer questions.

### How it works:

```
COMPANY SIDE (e.g., an Invoice App)
────────────────────────────────────
1. Company signs up on bharatmcp.dev
2. Registers their APIs:
   - POST /api/invoices         → "Create Invoice"
   - DELETE /api/invoices/:id   → "Delete Invoice"
   - GET /api/invoices          → "List Invoices"
   - POST /api/payments         → "Record Payment"
3. Gets a script tag to embed on their website
4. Done.


USER SIDE (customer using the Invoice App)
──────────────────────────────────────────
1. User visits invoiceapp.com
2. Sees chat widget (bottom-right corner)
3. Types: "Delete invoice INV-002 and create a new one for ₹5000"
4. AI understands → calls DELETE /api/invoices/INV-002
                   → calls POST /api/invoices { amount: 5000 }
5. Widget shows: "Done! Deleted INV-002 and created INV-003 for ₹5,000 ✅"

The bot DOES the work. Not "click here to delete" — it DELETES.
```

### Two products in one:

```
PRODUCT 1: Embeddable Widget (Phase 1)
──────────────────────────────────────
- Company embeds our chatbot on THEIR website
- Bot has access to company's APIs
- Bot performs actions for users
- Like Intercom but AI-powered and action-taking

PRODUCT 2: BharatMCP Platform (Phase 2 — later)
────────────────────────────────────────────────
- Users come to bharatmcp.dev
- Search for services ("create database", "build website")
- AI does it for them using registered tools
- Like a marketplace of AI agents
```

We build Product 1 first.

---

## 2. SYSTEM DESIGN

### Architecture Overview:

```
┌─────────────────────────────────────────────────────────────┐
│                    Company's Website                         │
│                                                              │
│   ┌──────────────────────────────────────────────────────┐  │
│   │  <script src="https://cdn.bharatmcp.dev/widget.js"   │  │
│   │          data-api-key="bm_live_abc123" />             │  │
│   └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ▼                                  │
│   ┌──────────────────────────────┐                          │
│   │      Chat Widget (JS/TS)     │◄── User types messages   │
│   │      Floating bubble UI      │                          │
│   └──────────┬───────────────────┘                          │
└──────────────┼──────────────────────────────────────────────┘
               │
               │ HTTP / WebSocket
               ▼
┌──────────────────────────────────────────────────────────────┐
│                  BharatMCP Backend (FastAPI)                 │
│                                                              │
│  ┌─────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│  │  Auth   │   │  Chat    │   │  Tool    │   │  Gemini  │    │
│  │ Service │   │ Service  │   │ Executor │   │    AI    │    │
│  └─────────┘   └──────────┘   └──────────┘   └──────────┘    │
│       │              │              │               │        │
│       ▼              ▼              ▼               ▼        │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                    MongoDB                           │    │
│  │  users │ sites │ tools │ api_keys │ chat_sessions    │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
               │
               │ Tool Executor calls company's APIs
               ▼
┌──────────────────────────────────────┐
│       Company's API Server           │
│  POST /api/invoices                  │
│  DELETE /api/invoices/:id            │
│  GET /api/invoices                   │
└──────────────────────────────────────┘
```

### Request Flow (what happens when user sends a message):

```
User types: "Delete invoice INV-002 and create new one for ₹5000"
                    │
                    ▼
Step 1: Widget sends message + API key to backend
        POST /api/chat/message
        { api_key: "bm_live_abc123", message: "Delete invoice...", session: "sess_1" }
                    │
                    ▼
Step 2: Backend verifies API key → finds the Site → loads its Tools
        Site: "InvoiceApp"
        Tools: [create_invoice, delete_invoice, list_invoices, record_payment]
                    │
                    ▼
Step 3: Backend sends to Gemini AI:
        "User wants: Delete invoice INV-002 and create new one for ₹5000
         Available tools: [delete_invoice, create_invoice, ...]
         What should I call?"
                    │
                    ▼
Step 4: Gemini responds:
        "Call delete_invoice(id='INV-002'), then create_invoice(amount=5000)"
                    │
                    ▼
Step 5: Backend executes the API calls:
        → DELETE https://api.invoiceapp.com/invoices/INV-002  ✅
        → POST https://api.invoiceapp.com/invoices { amount: 5000 }  ✅ → INV-003
                    │
                    ▼
Step 6: Backend tells Gemini the results, Gemini formats a reply:
        "Done! I deleted INV-002 and created INV-003 for ₹5,000."
                    │
                    ▼
Step 7: Widget shows the reply to user
```

---

## 3. TECH STACK

```
Layer            Technology          Why
─────────────── ─────────────────── ──────────────────────────────
Backend API      FastAPI (Python)    Fast, async, great for AI apps
Database         MongoDB + Motor     Flexible schema, async driver
AI Model         Google Gemini       Free tier, good for India
Dashboard        Next.js             Company registration portal
Chat Widget      Vanilla JS/TS      Lightweight, no framework needed
                                     Must be <50KB for embed
HTTP Client      httpx (Python)      Async API calls to company servers
Auth             JWT + bcrypt        Simple, stateless
```

---

## 4. DATABASE DESIGN (MongoDB Collections)

```
Collection: users
─────────────────
{
  _id: ObjectId,
  email: "harsh@invoiceapp.com",
  name: "Harsh",
  company_name: "InvoiceApp",
  hashed_password: "$2b$12$...",
  is_active: true,
  created_at: DateTime
}


Collection: sites
─────────────────
{
  _id: ObjectId,
  name: "InvoiceApp",
  domain: "invoiceapp.com",
  description: "Invoice management tool",
  owner_id: ObjectId (→ users),
  widget_config: {
    position: "bottom-right",
    welcome_message: "Hi! I can manage your invoices.",
    primary_color: "#FF6B35",
    title: "Invoice Assistant"
  },
  plan: "free",
  active: true,
  created_at: DateTime
}


Collection: tools
─────────────────
{
  _id: ObjectId,
  site_id: ObjectId (→ sites),
  tool_id: "delete_invoice",
  name: "Delete Invoice",
  description: "Permanently deletes an invoice by ID",
  endpoint: {
    url: "https://api.invoiceapp.com/invoices/:id",
    method: "DELETE",
    headers: { "Authorization": "Bearer {{site_api_token}}" },
    timeout_ms: 30000
  },
  parameters: [
    {
      name: "id",
      label: "Invoice ID",
      description: "ID of invoice to delete",
      type: "string",
      required: true,
      location: "path"
    }
  ],
  security: {
    required_permission: "write",
    confirmation: "always",
    side_effect: true,
    risk_level: "high"
  },
  active: true,
  category: "invoices",
  created_at: DateTime
}


Collection: api_keys
────────────────────
{
  _id: ObjectId,
  key: "bm_live_abc123xyz",
  site_id: ObjectId (→ sites),
  owner_id: ObjectId (→ users),
  label: "Production",
  permissions: ["read", "write"],
  active: true,
  created_at: DateTime,
  last_used_at: DateTime
}


Collection: chat_sessions
─────────────────────────
{
  _id: ObjectId,
  site_id: ObjectId (→ sites),
  session_token: "sess_abc123",
  messages: [
    { role: "user", content: "Delete INV-002 and create new one for ₹5000", timestamp: DateTime },
    { role: "agent", content: "I'll delete INV-002 and create a new invoice...", timestamp: DateTime },
    { role: "agent", type: "confirmation", content: "Should I proceed?", timestamp: DateTime },
    { role: "user", content: "Yes", timestamp: DateTime },
    { role: "agent", content: "Done! ✅ Deleted INV-002, created INV-003 for ₹5,000", timestamp: DateTime }
  ],
  page_url: "https://invoiceapp.com/dashboard",
  started_at: DateTime,
  last_active_at: DateTime
}
```

---

## 5. PHASES

### Phase 1: Backend API (FastAPI + MongoDB + Gemini)
Everything the chatbot needs to work.

```
Files to build:
├── backend/
│   ├── main.py                    ← FastAPI app entry point
│   ├── requirements.txt           ← Python dependencies
│   ├── .env.example               ← Environment variables template
│   ├── app/
│   │   ├── config.py              ← Settings from .env
│   │   ├── db/
│   │   │   └── mongodb.py         ← MongoDB connection
│   │   ├── models/
│   │   │   ├── user.py            ← User model
│   │   │   ├── site.py            ← Site model
│   │   │   ├── tool.py            ← Tool model
│   │   │   ├── api_key.py         ← API Key model
│   │   │   └── chat.py            ← Chat session model
│   │   ├── services/
│   │   │   ├── auth.py            ← JWT + password hashing
│   │   │   ├── gemini.py          ← Gemini AI integration
│   │   │   ├── tool_executor.py   ← Calls company APIs
│   │   │   └── chat.py            ← Chat logic (ties AI + executor)
│   │   ├── routes/
│   │   │   ├── auth.py            ← POST /auth/register, /auth/login
│   │   │   ├── sites.py           ← CRUD /sites
│   │   │   ├── tools.py           ← CRUD /sites/:id/tools
│   │   │   ├── api_keys.py        ← CRUD /api-keys
│   │   │   └── chat.py            ← POST /chat/message (widget calls this)
│   │   └── middleware/
│   │       └── auth.py            ← JWT verification middleware

Endpoints:
  Auth:
    POST   /auth/register          ← Company signs up
    POST   /auth/login             ← Company logs in

  Sites:
    POST   /sites                  ← Create a site
    GET    /sites                  ← List my sites
    GET    /sites/:id              ← Get site details
    PUT    /sites/:id              ← Update site
    DELETE /sites/:id              ← Delete site

  Tools:
    POST   /sites/:id/tools        ← Register an API tool
    GET    /sites/:id/tools        ← List all tools
    PUT    /sites/:id/tools/:tid   ← Update a tool
    DELETE /sites/:id/tools/:tid   ← Delete a tool

  API Keys:
    POST   /sites/:id/api-keys     ← Generate API key
    GET    /sites/:id/api-keys     ← List keys
    DELETE /api-keys/:kid          ← Revoke key

  Chat (widget calls these):
    POST   /chat/message           ← Send message, get AI response
    GET    /chat/session/:token    ← Get chat history
```

### Phase 2: Chat Widget (Embeddable JavaScript)
The actual UI that appears on the company's website.

```
Files to build:
├── widget/
│   ├── src/
│   │   ├── index.ts               ← Entry point
│   │   ├── widget.ts              ← Creates the floating bubble + chat window
│   │   ├── api.ts                 ← HTTP calls to backend
│   │   ├── styles.ts              ← All CSS (injected via JS, no external file)
│   │   └── types.ts               ← TypeScript types
│   ├── package.json
│   └── build config               ← Bundles to single <50KB file

Company adds this to their site:
  <script src="https://cdn.bharatmcp.dev/widget.js"
          data-api-key="bm_live_abc123" />

That's it. Widget auto-renders.
```

### Phase 3: Dashboard (Next.js)
Web app where companies manage everything.

```
├── dashboard/
│   ├── app/
│   │   ├── login/                 ← Login page
│   │   ├── register/              ← Signup page
│   │   ├── dashboard/             ← Overview
│   │   ├── sites/                 ← Manage sites
│   │   ├── sites/[id]/tools/      ← Add/edit API tools
│   │   ├── sites/[id]/widget/     ← Widget customization
│   │   ├── sites/[id]/api-keys/   ← Manage API keys
│   │   └── sites/[id]/chat-logs/  ← View conversations
```

### Phase 4: BharatMCP Platform (bharatmcp.dev for end users)
Users search services and AI does things for them.
(Built after Phase 1-3 are solid)

---

## 6. BUILD ORDER

```
 Phase 1: Backend ─────────────────────────────────────────
 │
 │  Step 1:  Project setup + config + MongoDB connection
 │  Step 2:  Models (User, Site, Tool, APIKey, Chat)
 │  Step 3:  Auth service + routes (register/login)
 │  Step 4:  Site CRUD routes
 │  Step 5:  Tool CRUD routes
 │  Step 6:  API Key routes
 │  Step 7:  Gemini AI service
 │  Step 8:  Tool executor service (calls company APIs)
 │  Step 9:  Chat service + route (ties everything together)
 │  Step 10: Test end-to-end
 │
 Phase 2: Widget ──────────────────────────────────────────
 │
 │  Step 11: Widget UI (bubble + chat window)
 │  Step 12: API connection to backend
 │  Step 13: Confirmation flow UI
 │  Step 14: Build & CDN deploy
 │
 Phase 3: Dashboard ───────────────────────────────────────
 │
 │  Step 15: Next.js setup + auth pages
 │  Step 16: Site management pages
 │  Step 17: Tool registration UI (form builder)
 │  Step 18: Widget customization page
 │  Step 19: Chat logs viewer
 │
 Phase 4: Platform (later) ────────────────────────────────
```

---

## 7. WHAT MAKES THIS DIFFERENT

```
Existing chatbots (Intercom, Tidio, Drift):
  ❌ Only answer questions from a knowledge base
  ❌ "Click here to create an invoice" — GUIDES the user
  ❌ Need manual setup of conversation flows
  ❌ Can't call APIs

BharatMCP:
  ✅ Actually DOES things — calls the company's APIs
  ✅ "Delete INV-002 and create new one" → DONE
  ✅ AI understands intent — no manual flow setup
  ✅ Company just registers APIs, AI figures out the rest
  ✅ Multi-step: search → confirm → execute → report
  ✅ Works on any website with a script tag
```