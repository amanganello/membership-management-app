# 🏋️ FITNESS APP AGENT PROTOCOLS

## 1. PROJECT CONTEXT & TECH STACK
You are building a **Full-Stack Member Management System** for a fitness business.
- **Backend:** Node.js + Express + TypeScript.
- **Frontend:** React + TypeScript + Vite.
- **Database:** Relational SQL (PostgreSQL recommended).
- **Styling:** Tailwind CSS (Utility-first framework).
- **Infrastructure:** Docker Compose (Mandatory for DB).

## 2. THE GOLDEN RULES (Behavioral)
### Rule A: The Planning Protocol
**Trigger:** Any task involving >1 file, schema changes, or business logic.
**Action:**
1.  **Pause & Plan:** Create a `PLAN.md` artifact.
2.  **Concurrency Check:** Explicitly state how you will handle race conditions (e.g., preventing double check-ins or overlapping memberships).
3.  **Confirm:** Wait for user approval.

### Rule B: The "No-Guessing" Rule
If you hit an error, **read the logs**. Do not blindly patch code.

## 3. STRICT BUSINESS LOGIC (Immutable Constraints)
*The Agent must enforce these rules in both Database Schema and Application Logic.*

1.  **Single Active Membership:**
    - A member can have **at most one** active membership at a time.
    - *Constraint:* You must design the DB schema or logic to prevent overlapping active date ranges.
2.  **Check-In Gate:**
    - Only members with an **Active** membership status can check in.
    - You must validate status *before* creating a check-in record.
3.  **Data Requirements:**
    - Member Summary must always return:
        - Active Plan Name (or null).
        - Last Check-in Timestamp.
        - Check-in count (Last 30 days).

## 4. CODING STANDARDS

### A. Backend (Express + TS)
- **Validation:** Use a library (like Zod) for all API inputs.
- **Error Handling:** Pass all async errors to `next(err)`. Never swallow errors.
- **Database:**
    - Use Migration files (SQL) for all schema changes.
    - **Keys:** Use Foreign Keys for `member_id` and `plan_id`.
    - **Indexes:** Index searchable fields (Member Name, Email).

### B. Frontend (React + Vite)
- **State:** Use React Hooks.
- **Styling (Tailwind):**
    - Use utility classes directly in JSX (e.g., `className="p-4 flex"`).
    - Avoid arbitrary values (e.g., `w-[13px]`)—stick to the theme grid.
    - Use libraries like `clsx` or `tailwind-merge` for conditional classes.
- **API Client:** Extract API calls to a service layer (e.g., `services/api.ts`).
- **Types:** Share types/interfaces between Backend and Frontend if possible (or keep them strictly synced).

---
*System Note: All Agents must prioritize "Business Logic" constraints over speed.*
