# FitAI — Claude Code Rules

Every session MUST read and follow these rules before making any changes.

---

## Architecture: Services Separation (NON-NEGOTIABLE)

This app starts as a Next.js PWA but is designed to transition to React Native with minimal effort.
The single most important rule: **business logic never lives in UI**.

### The Three-Layer Rule
1. **`/services`** — all data fetching, all API calls, all side effects
2. **`/app/api/...`** — REST endpoints only; they call `/services` functions, nothing else
3. **`/app` pages + `/components`** — render only; they call service functions and render the result

### What this means concretely
- NEVER put Supabase queries inside a page, component, or layout
- NEVER call the Claude API directly from a page or component
- NEVER put Razorpay logic outside of `/services/razorpay.ts`
- ALL pages are thin: they call services, pass data to components, done
- ALL API routes at `/app/api/` are standard REST — React Native will call the same URLs later
- NEVER use Next.js server components for business logic — keep it in `/services`
- NEVER use Next.js-only libraries for core features (UI libs like Tailwind/Framer Motion are fine)

---

## Folder Structure Reference

```
/app
  /api
    /auth/callback/route.ts
    /meal-plan/generate/route.ts     ← REST endpoint
    /workout/generate/route.ts       ← REST endpoint
    /chat/route.ts                   ← REST endpoint
    /food-scan/route.ts              ← REST endpoint
    /razorpay/create-subscription/route.ts
    /razorpay/webhook/route.ts
  /dashboard
    /nutrition/page.tsx
    /workout/page.tsx
    /progress/page.tsx
    /chat/page.tsx
  /onboarding/page.tsx
  /pricing/page.tsx
  /page.tsx                          ← home/landing
  /layout.tsx

/services
  supabase.ts    ← ALL Supabase queries
  claude.ts      ← ALL Claude API calls
  razorpay.ts    ← ALL Razorpay logic

/lib
  indianFoods.ts    ← Indian food database
  calculations.ts   ← BMR, TDEE, macro math
  constants.ts      ← plan limits, goals list, app-wide constants
  utils.ts          ← helper functions

/types
  index.ts          ← ALL TypeScript interfaces (no framework imports)

/components
  /ui               ← generic: Button, Card, Input, Modal, BottomNav
  /nutrition        ← meal plan specific
  /workout          ← workout specific
  /progress         ← charts and progress
  /chat             ← chat UI

/hooks
  useUser.ts           ← current user + profile
  useSubscription.ts   ← plan and limits
  useMealPlan.ts       ← meal plan state
  useWorkout.ts        ← workout state

/public
  manifest.json
  sw.js
  icons/
```

---

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Functions | camelCase | `getMealPlan`, `logFood` |
| React components | PascalCase | `MealCard`, `WorkoutDay` |
| TypeScript types/interfaces | PascalCase | `UserProfile`, `MealPlan` |
| Files containing components | PascalCase | `MealCard.tsx` |
| Files containing utils/services | camelCase | `supabase.ts`, `utils.ts` |
| CSS classes | Tailwind utility classes only | no custom CSS unless unavoidable |
| API route files | always `route.ts` | `/app/api/chat/route.ts` |
| Hook files | camelCase, `use` prefix | `useUser.ts` |

---

## Feature Development Checklist

Every new feature MUST have:
- [ ] A **service function** in the relevant `/services` file
- [ ] A **REST API route** in `/app/api/` if the feature touches a backend
- [ ] A **component** in `/components/<feature>/` for any UI
- [ ] A **hook** in `/hooks/` if the feature has client-side state
- [ ] Types defined in `/types/index.ts`

**Never merge service + component into one file.**

---

## Types Rule

All types in `/types/index.ts` must be:
- Pure TypeScript interfaces — no Next.js imports, no Supabase imports, no React imports
- Importable by React Native directly without modification

---

## API Routes Rule

All routes in `/app/api/` must:
- Accept and return plain JSON
- Call `/services` functions only — no inline DB/AI calls
- Use standard HTTP methods (GET, POST, PUT, DELETE)
- Be callable by a React Native fetch() with no special headers beyond `Authorization`

---

## What Claude Must NOT Do

- Do not put fetch/axios calls inside page files or components
- Do not import `createClient` from supabase inside pages or components
- Do not import `Anthropic` inside pages or components
- Do not add Next.js `use server` directives to business logic — use API routes instead
- Do not create new top-level folders without updating this file
- Do not add comments that describe WHAT code does — only WHY if non-obvious
