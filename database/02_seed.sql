-- ============================================
-- SEED DATA: Membership Plans
-- ============================================
-- This file is automatically run after 01_schema.sql
-- during PostgreSQL container initialization.

INSERT INTO plans (name, monthly_cost) VALUES
  ('Basic Monthly', 29.99),
  ('Premium Monthly', 59.99),
  ('Annual VIP', 499.99);

-- Verification: Show inserted plans
SELECT 'Seeded ' || COUNT(*) || ' plans' AS status FROM plans;
