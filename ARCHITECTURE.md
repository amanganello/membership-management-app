# Member Management MVP - Architecture Document

## Overview

An internal member-management tool for fitness business staff. Designed as an MVP with minimal complexity.

**Constraints:**
- 🏢 **Scope:** Internal staff tool only
- 🔓 **Auth:** None required (MVP)
- ✅ **Check-in:** Simple button click

**Stack:**
| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL |
| Local Dev | Docker Compose |
| Target Cloud | AWS (S3, ECS, RDS) |

---

## Member Check-in Data Flow

### Flow Description

Staff clicks "Check In" button → Record saved to database.

```
1. BUTTON CLICK
   └── Staff clicks "Check In" on member's row in the UI

2. REACT STATE
   └── onClick handler calls checkinMember(memberId)
   └── Sets loading state on button

3. API REQUEST
   └── POST /api/checkins
   └── Body: { memberId: "uuid-123" }
   └── No auth headers (MVP)

4. EXPRESS ROUTE
   └── Router receives POST /api/checkins
   └── Extracts memberId from request body

5. SERVICE LAYER
   └── CheckinService.create(memberId)
   └── Validates member exists
   └── Validates membership is active (endDate >= CURRENT_DATE)
   └── Creates timestamp

6. DATABASE INSERT
   └── INSERT INTO checkins (id, member_id, checked_in_at)
   └── VALUES (gen_random_uuid(), $1, NOW())
   └── Returns created record

7. RESPONSE
   └── 201 Created → { id, memberId, checkedInAt }
   └── React clears loading, shows success toast
```

### Sequence Diagram

```mermaid
sequenceDiagram
    participant Staff as Staff Browser
    participant React as React App
    participant API as Express API
    participant DB as PostgreSQL

    Staff->>React: Click "Check In" button
    React->>React: Set loading state
    React->>API: POST /api/checkins<br/>{ memberId }
    API->>DB: INSERT INTO checkins
    DB-->>API: New record
    API-->>React: 201 { id, memberId, checkedInAt }
    React->>React: Clear loading
    React-->>Staff: Show success toast ✓
```

---

## Solution Diagrams

### Local Development (Docker Compose)

```mermaid
graph TB
    subgraph "Docker Compose"
        subgraph "frontend"
            VITE["Vite Dev Server<br/>:5174"]
        end
        
        subgraph "api"
            EXPRESS["Express API<br/>:3000"]
        end
        
        subgraph "db"
            PG["PostgreSQL<br/>:5432"]
            VOL[("pgdata volume")]
        end
    end
    
    BROWSER["localhost:5174"] --> VITE
    VITE -->|"/api/* proxy"| EXPRESS
    EXPRESS -->|"pg connection"| PG
    PG --> VOL

    style VITE fill:#646cff,color:#fff
    style EXPRESS fill:#68a063,color:#fff
    style PG fill:#336791,color:#fff
```

**docker-compose.yml structure:**
```yaml
services:
  frontend:    # Vite + React
    ports: ["5174:5174"]
    depends_on: [api]
    
  api:         # Express + TypeScript
    ports: ["3000:3000"]
    depends_on: [db]
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/memberapp
    
  db:          # PostgreSQL
    ports: ["5432:5432"]
    volumes: [pgdata:/var/lib/postgresql/data]
```

---

### Theoretical AWS Deployment

```mermaid
graph TB
    subgraph "AWS Cloud"
        subgraph "Static Hosting"
            CF["CloudFront CDN"]
            S3["S3 Bucket<br/>React Build"]
        end
        
        subgraph "Compute"
            ALB["Application Load Balancer"]
            ECS["ECS Fargate<br/>Express API"]
        end
        
        subgraph "Data"
            RDS["RDS PostgreSQL"]
        end
    end

    USER["Staff Browser"] --> CF
    CF -->|"Static files"| S3
    CF -->|"/api/*"| ALB
    ALB --> ECS
    ECS --> RDS

    style CF fill:#9d5025,color:#fff
    style S3 fill:#3f8624,color:#fff
    style ECS fill:#ff9900,color:#000
    style RDS fill:#3b48cc,color:#fff
```

**Deployment Mapping:**

| Local | AWS | Purpose |
|-------|-----|---------|
| Vite container | S3 + CloudFront | Serve React app |
| Express container | ECS Fargate | Run API |
| PostgreSQL container | RDS PostgreSQL | Store data |
| Docker network | VPC | Network isolation |

---

## Additional Documentation

For detailed technical specifications including database schema, business rules, validation rules, concurrency control, and future improvements, see [TECH_SPEC.md](file:///Users/amanganello/Documents/Membership%20Managment%20app/TECH_SPEC.md).

---

*Document Version: 1.0 | Updated: 2026-01-28 | Status: MVP Scope*
