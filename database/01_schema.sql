-- ============================================
-- Member Management App - PostgreSQL Schema
-- ============================================

-- Enable required extension for exclusion constraint
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ============================================
-- PLANS
-- ============================================
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    monthly_cost DECIMAL(10, 2) NOT NULL CHECK (monthly_cost >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MEMBERS
-- ============================================
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_members_email ON members(email);

-- ============================================
-- MEMBERSHIPS
-- ============================================
-- Business Rule: A member can have at most ONE active membership at a time.
-- Active = endDate > CURRENT_DATE
-- Enforced via EXCLUSION CONSTRAINT on date ranges.

CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,  -- Required per business rules
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Validate start_date <= end_date (allows single-day passes)
    CONSTRAINT valid_date_range CHECK (start_date <= end_date),

    -- EXCLUSION CONSTRAINT: Prevent overlapping date ranges for same member
    CONSTRAINT no_overlapping_memberships 
        EXCLUDE USING gist (
            member_id WITH =,
            daterange(start_date, end_date, '[]') WITH &&
        )
);

CREATE INDEX idx_memberships_member_id ON memberships(member_id);
CREATE INDEX idx_memberships_dates ON memberships(start_date, end_date);

-- ============================================
-- CHECK-INS
-- ============================================
CREATE TABLE checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    checked_in_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_checkins_member_id ON checkins(member_id);
CREATE INDEX idx_checkins_timestamp ON checkins(checked_in_at);

-- ============================================
-- HELPER VIEW: Active Memberships
-- ============================================
CREATE VIEW active_memberships AS
SELECT 
    m.id AS membership_id,
    m.member_id,
    mb.name AS member_name,
    mb.email AS member_email,
    p.name AS plan_name,
    m.start_date,
    m.end_date
FROM memberships m
JOIN members mb ON m.member_id = mb.id
JOIN plans p ON m.plan_id = p.id
WHERE m.end_date >= CURRENT_DATE;

-- ============================================
-- AUTO-UPDATE TIMESTAMPS
-- ============================================
-- PostgreSQL does NOT auto-update updated_at like MySQL.
-- This trigger handles it automatically.

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_members_modtime 
    BEFORE UPDATE ON members 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_plans_modtime 
    BEFORE UPDATE ON plans 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_memberships_modtime 
    BEFORE UPDATE ON memberships 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();
