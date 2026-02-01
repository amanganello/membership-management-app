# Technical Specification - Fitness Member Management MVP

## Relational Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    MEMBERS ||--o{ MEMBERSHIPS : has
    PLANS ||--o{ MEMBERSHIPS : "used in"
    MEMBERS ||--o{ CHECKINS : records
    
    MEMBERS {
        uuid id PK
        varchar name
        varchar email UK
        date join_date
        timestamp created_at
        timestamp updated_at
    }
    
    PLANS {
        uuid id PK
        varchar name
        decimal monthly_cost
        int duration_value
        varchar duration_unit
        timestamp created_at
        timestamp updated_at
    }
    
    MEMBERSHIPS {
        uuid id PK
        uuid member_id FK
        uuid plan_id FK
        date start_date
        date end_date
        timestamp cancelled_at
        timestamp created_at
        timestamp updated_at
    }
    
    CHECKINS {
        uuid id PK
        uuid member_id FK
        timestamp checked_in_at
    }
```

### Table Definitions

#### members
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() |
| name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| join_date | DATE | NOT NULL, DEFAULT CURRENT_DATE |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

**Indexes:**
- `idx_members_email` on `email`

---

#### plans
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() |
| name | VARCHAR(100) | NOT NULL |
| monthly_cost | DECIMAL(10,2) | NOT NULL, CHECK (monthly_cost >= 0) |
| duration_value | INTEGER | NOT NULL, DEFAULT 1 |
| duration_unit | VARCHAR(20) | NOT NULL, CHECK (duration_unit IN ('day', 'month', 'year')) |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

---

#### memberships
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() |
| member_id | UUID | NOT NULL, REFERENCES members(id) ON DELETE CASCADE |
| plan_id | UUID | NOT NULL, REFERENCES plans(id) ON DELETE RESTRICT |
| start_date | DATE | NOT NULL |
| end_date | DATE | NOT NULL |
| cancelled_at | TIMESTAMP WITH TIME ZONE | DEFAULT NULL |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

**Constraints:**
- `valid_date_range`: CHECK (start_date <= end_date)
- `no_overlapping_memberships`: EXCLUSION constraint (see Concurrency Control below)

**Indexes:**
- `idx_memberships_member_id` on `member_id`
- `idx_memberships_dates` on `(start_date, end_date)`

---

#### checkins
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() |
| member_id | UUID | NOT NULL, REFERENCES members(id) ON DELETE CASCADE |
| checked_in_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() |

**Indexes:**
- `idx_checkins_member_id` on `member_id`
- `idx_checkins_timestamp` on `checked_in_at`

---

### Database Features

**Extension Required:**
```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;
```

**Auto-Update Triggers:**
PostgreSQL does not auto-update `updated_at` columns. A trigger function handles this:

```sql
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_members_modtime BEFORE UPDATE ON members FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_plans_modtime BEFORE UPDATE ON plans FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_memberships_modtime BEFORE UPDATE ON memberships FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

```

**Helper View:**
```sql
CREATE VIEW active_memberships AS
SELECT 
    m.id AS membership_id,
    m.member_id,
    mb.name AS member_name,
    p.name AS plan_name,
    m.start_date,
    m.end_date
FROM memberships m
JOIN members mb ON m.member_id = mb.id
JOIN plans p ON m.plan_id = p.id
WHERE m.end_date >= CURRENT_DATE;
```

---

## API Endpoints

Base URL: `http://localhost:3000/api`

### Health Check

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server health status |

**Response:** `200 OK`
```json
{ "status": "ok", "timestamp": "2026-01-28T12:00:00.000Z" }
```

---

### Members

#### Create Member
`POST /api/members`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "joinDate": "2026-01-28",
  "createdAt": "2026-01-28T12:00:00.000Z",
  "updatedAt": "2026-01-28T12:00:00.000Z"
}
```

**Errors:**
- `400` - Validation error (invalid email, empty name)
- `409` - Email already exists

---

#### List Members
`GET /api/members`

**Query Parameters:**
- `q` (optional): Search by name or email

**Response:** `200 OK`
```json
[
  { "id": "uuid", "name": "John Doe", "email": "john@example.com", ... }
]
```

---

#### Get Member Summary
`GET /api/members/:id`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "joinDate": "2026-01-01",
  "activeMembership": {
    "id": "uuid",
    "planName": "Premium Monthly",
    "startDate": "2026-01-01",
    "endDate": "2026-12-31"
  },
  "lastCheckinAt": "2026-01-28T10:00:00.000Z",
  "checkinCount30Days": 12
}
```

**Errors:**
- `400` - Invalid UUID format
- `404` - Member not found

---

### Plans

#### List Plans
`GET /api/plans`

**Response:** `200 OK`
```json
[
  { "id": "uuid", "name": "Basic Monthly", "monthlyCost": 29.99, ... },
  { "id": "uuid", "name": "Premium Monthly", "monthlyCost": 59.99, ... }
]
```

---

### Memberships

#### Assign Membership
`POST /api/memberships`

**Request Body:**
```json
{
  "memberId": "uuid",
  "planId": "uuid",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "memberId": "uuid",
  "planId": "uuid",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Errors:**
- `400` - Validation error (invalid dates, start > end)
- `404` - Member or Plan not found
- `409` - Overlapping membership exists

---

#### Cancel Membership
`PATCH /api/memberships/:id/cancel`

**Request Body:**
```json
{
  "cancelDate": "2026-06-15"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "memberId": "uuid",
  "planId": "uuid",
  "startDate": "2026-01-01",
  "endDate": "2026-06-15",
  ...
}
```

**Errors:**
- `400` - Cancel date in the past, membership already expired
- `404` - Membership not found

---

### Check-ins

#### Record Check-in
`POST /api/checkins`

**Request Body:**
```json
{
  "memberId": "uuid"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "memberId": "uuid",
  "checkedInAt": "2026-01-28T10:00:00.000Z"
}
```

**Errors:**
- `400` - Member has no active membership (check-in denied)
- `404` - Member not found

---

### Error Response Format

All errors return a consistent format:
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "statusCode": 400
  }
}
```

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `CONFLICT` | 409 | Duplicate or overlapping resource |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Business Rules

### 1. Active Membership Definition
A membership is considered **active** if and only if:
```
end_date >= CURRENT_DATE
```

This allows memberships expiring today to remain valid for check-in.

---

### 2. One Active Membership Rule
**Rule:** A member can have **at most one active membership** at any given time.

**Enforcement:** Database-level exclusion constraint (see Concurrency Control section).

**Impact:**
- When assigning a new membership, ensure no date overlap with existing memberships
- System will reject overlapping assignments with a 409 Conflict error

---

### 3. Check-in Authorization
**Rule:** Only members with an **active membership** can check in.

**Validation Logic:**
```sql
-- Service layer checks:
SELECT COUNT(*) FROM memberships
WHERE member_id = $1
AND end_date >= CURRENT_DATE;

-- If count = 0, reject check-in
```

**Error Response:** `400 Bad Request - Member does not have an active membership`

---

### 4. Membership Cancellation
**Approach:** "Cancel at Period End" (Delayed Cancellation).
When a membership is cancelled, the system records the timestamp in `cancelled_at` but **does NOT** change the `end_date`.

**Example:**
```
Original: start_date = 2026-01-01, end_date = 2026-12-31
Cancelled on 2026-06-15:
Updated: cancelled_at = 2026-06-15, end_date = 2026-12-31 (Unchanged)
```

**Effect:**
- The member remains **Active** and can check in until `end_date`.
- The UI displays "Scheduled to Cancel" and prevents manual renewal until expired.
- Prevents "early termination" refunds or loss of paid access.

---

## Validation Rules

### Member Creation
| Field | Validation |
|-------|------------|
| name | Required, 1-255 characters |
| email | Required, valid email format, unique |

### Membership Assignment
| Field | Validation |
|-------|------------|
| member_id | Required, must exist in `members` table |
| plan_id | Required, must exist in `plans` table |
| start_date | Required, valid date |
| end_date | Required, valid date, must be >= start_date |

**Additional checks:**
- No overlapping date range with existing memberships for the same member (enforced by exclusion constraint)

### Check-in
| Field | Validation |
|-------|------------|
| member_id | Required, must exist in `members` table |
| member status | Must have active membership (end_date >= CURRENT_DATE) |

### Plan Details
| Field | Validation |
|-------|------------|
| name | Required, 1-100 characters |
| monthly_cost | Required, numeric, >= 0 |

---

## Concurrency Control

### Problem
**Race Condition:** Two simultaneous requests might attempt to assign overlapping memberships to the same member, violating the "one active membership" rule.

**Example:**
```
Request A: Assign 2026-01-01 to 2026-12-31
Request B: Assign 2026-06-01 to 2027-06-01 (overlaps!)
```

### Solution: PostgreSQL Exclusion Constraint

```sql
CONSTRAINT no_overlapping_memberships 
    EXCLUDE USING gist (
        member_id WITH =,                           -- Same member
        daterange(start_date, end_date, '[]') WITH &&  -- Overlapping dates
    )
```

**How it works:**
1. Uses the GiST index with `btree_gist` extension
2. `member_id WITH =` ensures comparison only happens within the same member
3. `daterange(..., '[]')` creates an inclusive date range from start to end
4. `WITH &&` checks if ranges overlap
5. If overlap detected, PostgreSQL raises error: `23P01 exclusion_violation`

**API Handling:**
```typescript
try {
  await membershipRepository.create(data);
} catch (error) {
  if (error.code === '23P01') {
    throw new ConflictError('Member already has an overlapping membership');
  }
  throw error;
}
```

**Benefits:**
- Database-level enforcement (cannot be bypassed)
- Atomic operation (thread-safe)
- Works even with multiple API instances

---

## "If More Time" Improvements

### 1. 🔐 Staff Authentication
**Priority:** Critical (currently skipped for MVP)

**Why:** Currently no access control; any user can perform any action.

**Implementation:**
- Login page with email/password
- JWT tokens in httpOnly cookies
- Protect all `/api/*` routes with auth middleware
- Add staff roles (Admin, Front Desk)

---

### 2. 📊 Check-in Analytics Dashboard
**Why:** Business value for gym owners to understand usage patterns

**Features:**
- Daily/weekly/monthly check-in trends (line chart)
- Peak hours visualization (bar chart)
- Member visit frequency report
- Exportable CSV reports for external analysis

**Example Query:**
```sql
SELECT DATE(checked_in_at) as date, COUNT(*) as count
FROM checkins 
WHERE checked_in_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(checked_in_at)
ORDER BY date;
```

---

### 3. 🔔 Member Engagement Notifications
**Why:** Increase retention and re-engage inactive members

**Features:**
- Email/SMS when member hasn't visited in 7+ days
- Welcome notification on first check-in
- Birthday/anniversary messages
- Membership expiration reminders (7, 3, 1 day before)

**Integration:** SendGrid (email) + Twilio (SMS) or AWS SES/SNS

---

### 4. 📱 QR Code Self Check-in
**Why:** Reduce staff workload, enable self-service kiosks

**Implementation:**
- Generate unique QR code per member (encodes member UUID)
- Members scan QR at entrance tablet/kiosk
- API endpoint: `POST /api/checkins/qr`
- Libraries: `qrcode` (generation) + device camera API (scanning)

**Flow:**
1. Member displays QR code (printed card or mobile app)
2. Kiosk scans code
3. System validates → checks active membership → logs check-in
4. Display success/error on screen

---

### 5. 💳 Payment Integration
**Why:** Automate billing and renewals

**Features:**
- Stripe/PayPal integration for recurring payments
- Auto-renewal of memberships before expiration
- Payment history tracking
- Automated receipt generation

---

*Document Version: 1.0 | Created: 2026-01-28*
