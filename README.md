# 🇮🇳 BharatMCP

**AI agent platform that connects to any website and performs tasks for users.**

Website owners register their APIs → Users chat with the bot → Bot calls the APIs and gets things done.

## How It Works

```
WEBSITE OWNER                          END USER
─────────────                          ────────
Signs up on BharatMCP                  Visits the website
     │                                      │
Registers APIs as MCP tools            Sees chat widget
  "POST /api/orders = Create Order"         │
  "GET /api/products = Search"              │
     │                                 Types: "Order 5 shirts
Adds script tag to website              with coupon SAVE20"
     │                                      │
     └──────────┐              ┌────────────┘
                ▼              ▼
        ┌─────────────────────────────┐
        │      BharatMCP Platform     │
        │                             │
        │  1. Understands the intent  │
        │  2. Plans the steps:        │
        │     → validate_coupon       │
        │     → create_order          │
        │     → apply_coupon          │
        │  3. Calls each API          │
        │  4. Returns result          │
        └─────────────────────────────┘
                    │
                    ▼
          "Done! Order #1234 placed
           with 20% off. Total: ₹2,400"
```

## Project Structure

```
bharatmcp/
├── packages/
│   ├── types/          ← Shared TypeScript types
│   ├── mcp-server/     ← MCP server (tool registration + execution)
│   ├── platform/       ← Backend API (AI + task orchestration)
│   ├── sdk/            ← Embeddable script + chat widget
│   └── dashboard/      ← Web app for site owners
├── docs/               ← Documentation
├── package.json        ← Monorepo root
├── turbo.json          ← Build orchestration
└── tsconfig.base.json  ← Shared TS config
```

## Development

```bash
npm install        # install all dependencies
npm run build      # build all packages
npm run dev        # start dev mode
```

## License

MIT © BharatMCP Team