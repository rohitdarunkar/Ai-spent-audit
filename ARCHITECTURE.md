# Architecture

## Overview

The application follows a modern Next.js App Router architecture.

## Layers

### Frontend
- Next.js App Router
- React Components
- Tailwind Styling

### Business Logic
- Audit engine
- Savings calculations
- Recommendation system

### AI Layer
- OpenAI integration
- Executive summary generation

### Deployment
- Vercel hosting
- Serverless API routes

---

## Data Flow

1. User enters AI tooling data
2. Audit engine processes spend
3. Recommendations generated
4. OpenAI summarizes findings
5. Results dashboard rendered

---

## Key Modules

### audit-engine.ts
Handles:
- spend optimization
- duplicate detection
- team-plan analysis

### route.ts
Handles:
- OpenAI API calls
- AI summary generation

### results/page.tsx
Displays:
- savings metrics
- audit recommendations
- AI summaries
