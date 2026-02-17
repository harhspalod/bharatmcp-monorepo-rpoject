# BharatMCP Dashboard — File Structure & Build Plan

## Project Structure (Next.js 14 App Router + Tailwind CSS + shadcn/ui)

```
bharatmcp-dashboard/
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── .env.local.example
│
├── public/
│   ├── logo.svg                          # BharatMCP logo
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout (fonts, providers)
│   │   ├── globals.css                   # Global styles + CSS variables
│   │   ├── page.tsx                      # Redirect → /dashboard
│   │   │
│   │   ├── (auth)/                       # Auth group (no sidebar)
│   │   │   ├── layout.tsx                # Auth layout (centered card)
│   │   │   ├── login/
│   │   │   │   └── page.tsx              # Login page
│   │   │   └── register/
│   │   │       └── page.tsx              # Register page
│   │   │
│   │   └── (dashboard)/                  # Dashboard group (with sidebar)
│   │       ├── layout.tsx                # Dashboard layout (sidebar + content)
│   │       ├── dashboard/
│   │       │   └── page.tsx              # Overview / Home
│   │       │
│   │       ├── agents/
│   │       │   ├── page.tsx              # List all agents (sites)
│   │       │   ├── new/
│   │       │   │   └── page.tsx          # Create new agent
│   │       │   └── [agentId]/
│   │       │       ├── layout.tsx        # Agent detail layout (secondary sidebar)
│   │       │       ├── identity/
│   │       │       │   └── page.tsx      # ★ Identity config (screenshot 1)
│   │       │       ├── instructions/
│   │       │       │   └── page.tsx      # Agent instructions/prompt
│   │       │       ├── widget/
│   │       │       │   └── page.tsx      # Widget appearance config
│   │       │       ├── chat-bubble/
│   │       │       │   └── page.tsx      # Chat bubble config
│   │       │       ├── advanced/
│   │       │       │   └── page.tsx      # Advanced settings
│   │       │       ├── tools/
│   │       │       │   ├── page.tsx      # List API tools
│   │       │       │   └── new/
│   │       │       │       └── page.tsx  # Register new tool
│   │       │       ├── api-keys/
│   │       │       │   └── page.tsx      # Manage API keys
│   │       │       └── chat-logs/
│   │       │           └── page.tsx      # View conversations
│   │       │
│   │       ├── integrations/
│   │       │   └── page.tsx              # Integrations page
│   │       │
│   │       ├── analytics/
│   │       │   └── page.tsx              # Analytics page
│   │       │
│   │       └── settings/
│   │           └── page.tsx              # Account settings
│   │
│   ├── components/
│   │   ├── ui/                           # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── select.tsx
│   │   │   ├── label.tsx
│   │   │   ├── avatar.tsx
│   │   │   └── toast.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── icon-sidebar.tsx          # Left icon rail (narrow)
│   │   │   ├── secondary-sidebar.tsx     # Config nav sidebar
│   │   │   ├── topbar.tsx               # Top bar (Docs, Discord, Help, Plan, Avatar)
│   │   │   └── sidebar-link.tsx          # Reusable sidebar link item
│   │   │
│   │   ├── agent/
│   │   │   ├── identity-form.tsx         # Agent name + welcome message form
│   │   │   ├── instructions-form.tsx     # System prompt editor
│   │   │   ├── widget-config-form.tsx    # Widget appearance settings
│   │   │   ├── chat-bubble-form.tsx      # Bubble position, icon, etc.
│   │   │   ├── advanced-form.tsx         # Advanced settings form
│   │   │   └── tool-form.tsx             # API tool registration form
│   │   │
│   │   ├── preview/
│   │   │   └── widget-preview.tsx        # Live chat widget preview (right side)
│   │   │
│   │   └── shared/
│   │       ├── page-header.tsx           # Page title + description
│   │       ├── empty-state.tsx           # Empty state illustration
│   │       ├── loading-skeleton.tsx       # Loading states
│   │       └── copy-button.tsx           # Copy-to-clipboard button
│   │
│   ├── lib/
│   │   ├── utils.ts                      # cn() and helpers
│   │   ├── api.ts                        # API client (fetch wrapper)
│   │   ├── constants.ts                  # App constants
│   │   └── validations.ts               # Zod schemas
│   │
│   ├── hooks/
│   │   ├── use-agent.ts                  # Agent data hook
│   │   ├── use-toast.ts                  # Toast notifications
│   │   └── use-debounce.ts              # Debounce input
│   │
│   ├── stores/
│   │   └── agent-store.ts               # Zustand store for agent state
│   │
│   └── types/
│       ├── agent.ts                      # Agent/Site types
│       ├── tool.ts                       # Tool types
│       ├── chat.ts                       # Chat session types
│       └── api.ts                        # API response types
│
└── README.md
```

---

## Pages Mapped to Screenshots

| # | Page | Route | What's On It |
|---|------|-------|-------------|
| 1 | **Identity** | `/agents/[id]/identity` | Agent Name, Welcome Message, Save + Live Preview |
| 2 | **Instructions** | `/agents/[id]/instructions` | System prompt textarea, tone settings |
| 3 | **Widget** | `/agents/[id]/widget` | Colors, position, title, branding |
| 4 | **Chat Bubble** | `/agents/[id]/chat-bubble` | Bubble icon, size, animation |
| 5 | **Advanced** | `/agents/[id]/advanced` | Rate limits, allowed domains, API config |
| 6 | **Tools** | `/agents/[id]/tools` | List registered APIs, add new |
| 7 | **API Keys** | `/agents/[id]/api-keys` | Generate/revoke embed keys |
| 8 | **Chat Logs** | `/agents/[id]/chat-logs` | View user conversations |

---

## Icon Sidebar Items (Left Rail)

| Icon | Label | Route |
|------|-------|-------|
| 🏠 Home | Dashboard | `/dashboard` |
| 🤖 Agent | Agents | `/agents` |
| 🔗 API | Integrations | `/integrations` |
| 💬 Chat | Chat Logs | `/agents/[id]/chat-logs` |
| 📊 Analytics | Analytics | `/analytics` |
| ⚙️ Settings | Settings | `/settings` |

---

## Build Order (we'll go one by one)

1. **Project setup** — Next.js + Tailwind + shadcn/ui + fonts + CSS variables
2. **Root layout + globals.css** — Theme colors, fonts
3. **Icon Sidebar** — Left narrow rail with icons
4. **Top Bar** — Docs, Discord, Get Help, Plan badge, Avatar
5. **Dashboard layout** — Sidebar + topbar + content area
6. **Agent detail layout** — Secondary sidebar (Identity, Instructions, etc.)
7. **Identity page** — Form + live widget preview (Screenshot 1)
8. **Widget Preview component** — Live chat preview on right
9. **Instructions page**
10. **Widget config page**
11. **Chat Bubble page**
12. **Advanced page**
13. **Tools page**
14. **API Keys page**
15. **Chat Logs page**
16. **Auth pages** — Login + Register
17. **Dashboard home page**

---

## Design Direction

**Aesthetic**: Clean, professional SaaS — similar to Crow but with BharatMCP branding
**Color Scheme**: Deep indigo/violet primary (#6C5CE7 range) with warm accents
**Font**: Geist Sans (body) + Geist Mono (code)
**Theme**: Light mode default, dark mode support
**Layout**: 3-column (icon rail | secondary nav | content + preview)
