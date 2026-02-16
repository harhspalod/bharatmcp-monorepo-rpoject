# Architecture — How BharatMCP Handles Complex Websites

## The Problem

A simple chatbot says: "Click the Orders button, then fill in the form."

BharatMCP **does it** for the user. And it works on complex sites with dozens of APIs, multi-step workflows, and nested data.

---

## Real-World Example: E-Commerce Store

### What the owner registers (MCP Tools):

```
Tool: search_products
  → GET /api/products?q={query}
  → Returns: list of products with id, name, price, stock

Tool: create_order  
  → POST /api/orders
  → Body: { items: [{ product_id, quantity }], address_id }
  → Returns: { order_id, total, status }
  → Requires confirmation: YES (it's a purchase)

Tool: apply_coupon
  → POST /api/orders/{order_id}/coupon
  → Body: { code }
  → Depends on: create_order (needs order_id first)
  → Returns: { discount, new_total }

Tool: get_addresses
  → GET /api/user/addresses
  → Returns: list of saved addresses
```

### What happens when user says: "Order 5 blue shirts with coupon SAVE20"

```
1. AI creates a TaskPlan:
   ┌─────────────────────────────────────────────┐
   │  Step 1: search_products                    │
   │    params: { query: "blue shirts" }         │
   │    no confirmation needed                   │
   │                                             │
   │  Step 2: get_addresses                      │
   │    params: {}                               │
   │    no confirmation needed                   │
   │                                             │
   │  Step 3: create_order                       │
   │    params: {                                │
   │      items: [{ product_id: $step1[0].id,    │
   │                quantity: 5 }],              │
   │      address_id: $step2[0].id               │
   │    }                                        │
   │    ⚠️  REQUIRES USER CONFIRMATION           │
   │                                             │
   │  Step 4: apply_coupon                       │
   │    params: {                                │
   │      order_id: $step3.order_id,             │
   │      code: "SAVE20"                         │
   │    }                                        │
   │    depends on: step 3                       │
   └─────────────────────────────────────────────┘

2. Execution:
   Step 1 runs → finds "Blue Cotton Shirt - ₹600"
   Step 2 runs → finds "Home - 123 MG Road, Bangalore"
   
   Agent shows: "I found Blue Cotton Shirt (₹600).
                 5 × ₹600 = ₹3,000
                 Shipping to: 123 MG Road, Bangalore
                 Should I place this order?"
   
   User confirms → Step 3 runs → Order #1234 created
   Step 4 runs → Coupon applied, 20% off
   
   Agent shows: "Done! Order #1234 placed.
                 Subtotal: ₹3,000
                 Discount: -₹600
                 Total: ₹2,400 ✅"
```

---

## Key Type Concepts

### 1. Tool Parameter Mapping (`parameterMapping`)

Steps can reference outputs from previous steps using `$stepN.field` syntax:

```typescript
{
  order: 3,
  toolId: "create_order",
  parameterMapping: {
    "items[0].product_id": "$step1.data[0].id",  // from search
    "address_id": "$step2.data[0].id"             // from addresses
  }
}
```

### 2. Conditional Steps (`StepCondition`)

Steps can be skipped based on previous results:

```typescript
{
  order: 4,
  toolId: "apply_coupon",
  condition: {
    stepOrder: 3,
    field: "success",
    operator: "equals",
    value: true
    // Only apply coupon if order was created successfully
  }
}
```

### 3. Confirmation Gates (`requiresConfirmation`)

Sensitive actions pause and ask the user:

```typescript
{
  toolId: "process_payment",
  requiresConfirmation: true,
  description: "Charge ₹2,400 to your saved card ending 4242"
}
```

### 4. Nested Parameters (`properties`)

Complex APIs with nested objects are fully supported:

```typescript
{
  name: "shipping_address",
  type: "object",
  properties: [
    { name: "street", type: "string", required: true },
    { name: "city", type: "string", required: true },
    { name: "state", type: "string", required: true },
    { name: "pincode", type: "string", required: true, validation: { pattern: "^[0-9]{6}$" } }
  ]
}
```

---

## SaaS Dashboard Example

Same system works for complex SaaS:

```
User: "Create a new project called Q3 Marketing, 
       add Priya and Rahul as members, 
       set deadline to March 31"

TaskPlan:
  Step 1: create_project → { name: "Q3 Marketing", deadline: "2025-03-31" }
  Step 2: search_users → { query: "Priya" }  
  Step 3: search_users → { query: "Rahul" }
  Step 4: add_member → { project_id: $step1.id, user_id: $step2[0].id }
  Step 5: add_member → { project_id: $step1.id, user_id: $step3[0].id }

Result: "Done! Project 'Q3 Marketing' created with Priya and Rahul.
         Deadline: March 31, 2025 ✅"
```

---

## Next Steps

- **Step 2**: Build the MCP server that stores these tool definitions and executes them
- **Step 3**: Build the platform backend that creates TaskPlans from user messages
- **Step 4**: Build the SDK widget that users interact with