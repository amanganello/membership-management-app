-- ============================================
-- SEED DATA: Membership Plans, Members, and Test Data
-- ============================================
-- This file is automatically run after 01_schema.sql
-- during PostgreSQL container initialization.

-- ============================================
-- PLANS
-- ============================================
INSERT INTO plans (name, monthly_cost, duration_value, duration_unit) VALUES
  ('Day Pass', 10.00, 1, 'day'),
  ('Monthly Pass', 49.99, 1, 'month'),
  ('Annual Pass', 499.99, 1, 'year');

SELECT 'Seeded ' || COUNT(*) || ' plans' AS status FROM plans;

-- ============================================
-- MEMBERS (Sample Test Data)
-- ============================================
INSERT INTO members (name, email, join_date) VALUES
  ('John Doe', 'john.doe@example.com', '2026-01-01'),
  ('Jane Smith', 'jane.smith@example.com', '2026-01-15'),
  ('Mike Johnson', 'mike.j@example.com', '2025-12-01'),
  ('Sarah Williams', 'sarah.w@example.com', '2026-01-20'),
  ('Tom Brown', 'tom.brown@example.com', '2025-11-10'),
  ('Alex Turner', 'atos@example.com', CURRENT_DATE - INTERVAL '30 days');  -- Edge case: expires today

SELECT 'Seeded ' || COUNT(*) || ' members' AS status FROM members;

-- ============================================
-- MEMBERSHIPS (Sample Active & Expired)
-- ============================================
-- John Doe: Active Day Pass (For testing "Ends Today" logic)
INSERT INTO memberships (member_id, plan_id, start_date, end_date) VALUES
  ((SELECT id FROM members WHERE email = 'john.doe@example.com'),
   (SELECT id FROM plans WHERE name = 'Day Pass'),
   CURRENT_DATE, CURRENT_DATE);

-- Jane Smith: Active Monthly Pass
INSERT INTO memberships (member_id, plan_id, start_date, end_date) VALUES
  ((SELECT id FROM members WHERE email = 'jane.smith@example.com'),
   (SELECT id FROM plans WHERE name = 'Monthly Pass'),
   CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days');

-- Mike Johnson: Active Annual Pass
INSERT INTO memberships (member_id, plan_id, start_date, end_date) VALUES
  ((SELECT id FROM members WHERE email = 'mike.j@example.com'),
   (SELECT id FROM plans WHERE name = 'Annual Pass'),
   '2026-01-01', '2026-12-31');

-- Tom Brown: EXPIRED Monthly Pass
INSERT INTO memberships (member_id, plan_id, start_date, end_date) VALUES
  ((SELECT id FROM members WHERE email = 'tom.brown@example.com'),
   (SELECT id FROM plans WHERE name = 'Monthly Pass'),
   CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '30 days');

-- Sarah Williams: NO MEMBERSHIP

-- Alex Turner: EDGE CASE - Monthly Pass expires exactly TODAY
INSERT INTO memberships (member_id, plan_id, start_date, end_date) VALUES
  ((SELECT id FROM members WHERE email = 'atos@example.com'),
   (SELECT id FROM plans WHERE name = 'Monthly Pass'),
   CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE);

SELECT 'Seeded ' || COUNT(*) || ' memberships' AS status FROM memberships;

-- ============================================
-- CHECK-INS (Last 30 Days)
-- ============================================
-- John Doe: Regular gym-goer (12 check-ins last 30 days)
INSERT INTO checkins (member_id, checked_in_at) VALUES
  ((SELECT id FROM members WHERE email = 'john.doe@example.com'), NOW() - INTERVAL '1 day'),
  ((SELECT id FROM members WHERE email = 'john.doe@example.com'), NOW() - INTERVAL '3 days'),
  ((SELECT id FROM members WHERE email = 'john.doe@example.com'), NOW() - INTERVAL '5 days'),
  ((SELECT id FROM members WHERE email = 'john.doe@example.com'), NOW() - INTERVAL '7 days'),
  ((SELECT id FROM members WHERE email = 'john.doe@example.com'), NOW() - INTERVAL '9 days'),
  ((SELECT id FROM members WHERE email = 'john.doe@example.com'), NOW() - INTERVAL '11 days'),
  ((SELECT id FROM members WHERE email = 'john.doe@example.com'), NOW() - INTERVAL '14 days'),
  ((SELECT id FROM members WHERE email = 'john.doe@example.com'), NOW() - INTERVAL '16 days'),
  ((SELECT id FROM members WHERE email = 'john.doe@example.com'), NOW() - INTERVAL '19 days'),
  ((SELECT id FROM members WHERE email = 'john.doe@example.com'), NOW() - INTERVAL '21 days'),
  ((SELECT id FROM members WHERE email = 'john.doe@example.com'), NOW() - INTERVAL '24 days'),
  ((SELECT id FROM members WHERE email = 'john.doe@example.com'), NOW() - INTERVAL '27 days');

-- Jane Smith: Moderate user (5 check-ins last 30 days)
INSERT INTO checkins (member_id, checked_in_at) VALUES
  ((SELECT id FROM members WHERE email = 'jane.smith@example.com'), NOW() - INTERVAL '2 days'),
  ((SELECT id FROM members WHERE email = 'jane.smith@example.com'), NOW() - INTERVAL '7 days'),
  ((SELECT id FROM members WHERE email = 'jane.smith@example.com'), NOW() - INTERVAL '12 days'),
  ((SELECT id FROM members WHERE email = 'jane.smith@example.com'), NOW() - INTERVAL '18 days'),
  ((SELECT id FROM members WHERE email = 'jane.smith@example.com'), NOW() - INTERVAL '25 days');

-- Mike Johnson: New active member (3 check-ins)
INSERT INTO checkins (member_id, checked_in_at) VALUES
  ((SELECT id FROM members WHERE email = 'mike.j@example.com'), NOW() - INTERVAL '4 days'),
  ((SELECT id FROM members WHERE email = 'mike.j@example.com'), NOW() - INTERVAL '10 days'),
  ((SELECT id FROM members WHERE email = 'mike.j@example.com'), NOW() - INTERVAL '20 days');

-- Tom Brown: Had check-ins before expiration (none in last 30 days since membership expired)
INSERT INTO checkins (member_id, checked_in_at) VALUES
  ((SELECT id FROM members WHERE email = 'tom.brown@example.com'), NOW() - INTERVAL '40 days'),
  ((SELECT id FROM members WHERE email = 'tom.brown@example.com'), NOW() - INTERVAL '45 days');

SELECT 'Seeded ' || COUNT(*) || ' check-ins' AS status FROM checkins;

-- ============================================
-- VERIFICATION SUMMARY
-- ============================================
SELECT 'Database seeding completed!' AS status;
