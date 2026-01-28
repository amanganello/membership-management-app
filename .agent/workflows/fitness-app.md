---
description: Load fitness app protocols and coding standards before starting work
---

# Fitness App Development Workflow

Before starting any work on this project, follow these steps:

1. Read and internalize the protocols defined in `/AGENTS.md`

2. Apply all rules from the AGENTS.md file, including:
   - **Planning Protocol**: Create PLAN.md for tasks involving >1 file
   - **No-Guessing Rule**: Read logs before fixing errors
   - **Business Logic Constraints**: Single active membership, check-in gate, data requirements

3. Follow the coding standards:
   - **Backend**: Zod validation, proper error handling, SQL migrations
   - **Frontend**: React hooks, Tailwind CSS utilities, API service layer

4. Remember the tech stack:
   - Backend: Node.js + Express + TypeScript
   - Frontend: React + TypeScript + Vite
   - Database: PostgreSQL (Docker Compose required)
   - Styling: Tailwind CSS

5. Prioritize business logic constraints over speed

// turbo-all
