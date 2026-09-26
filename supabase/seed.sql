-- ==============================================================================
-- Demo data: students, quiz answers, open rooms and a few conversations.
--
-- Run it in the Supabase SQL Editor (it needs the postgres role to create auth
-- users), after every migration in supabase/migrations/. `supabase db reset`
-- also runs it locally. Safe to re-run: existing rows are left as they are.
--
-- Every demo account:
--   * has an @example.com email and an id starting with 5eed0000-, so
--     supabase/seed_cleanup.sql can remove them all before a real launch;
--   * signs in with the password  RoomieDemo!2026  (e.g. sophea.chan@example.com
--     hosts a room and has messages waiting).
-- ==============================================================================

BEGIN;

CREATE TEMP TABLE seed_students (
  n INT PRIMARY KEY,
  email TEXT,
  name TEXT,
  university TEXT,
  gender TEXT,
  bio TEXT,
  -- Quiz answers; NULL means the student hasn't taken the quiz yet.
  sleep TEXT,
  weekend TEXT,
  cleanliness TEXT,
  noise TEXT,
  joined_days_ago INT
) ON COMMIT DROP;

INSERT INTO seed_students VALUES
  (1,  'sophea.chan@example.com',   'Sophea Chan',      'Royal University of Phnom Penh', 'Female',
   'Final-year English Literature student. Up early with tea and a book, back from class by 5. Looking for calm housemates who keep the kitchen clean.',
   'early-bird', 'quiet-until-10', 'meticulous', 'quiet', 92),
  (2,  'dara.kim@example.com',      'Dara Kim',         'Institute of Technology of Cambodia', 'Male',
   'Civil engineering, third year. I study late and sleep in on weekends. Easygoing, I cook a lot and always share.',
   'night-owl', 'sleep-in', 'tidy', 'moderate', 75),
  (3,  'sreyneang.pich@example.com','Srey Neang Pich',  'CADT', 'Female',
   'Software engineering student and part-time barista. Early mornings, quiet evenings, and a very organised desk.',
   'early-bird', 'early-up', 'tidy', 'quiet', 64),
  (4,  'vuthy.heng@example.com',    'Vuthy Heng',       'National University of Management', 'Male',
   'Accounting student interning at a bank in Daun Penh. Flexible schedule, happy to split chores evenly.',
   'fluid', 'quiet-until-10', 'tidy', 'moderate', 58),
  (5,  'chanthy.ouk@example.com',   'Chanthy Ouk',      'American University of Phnom Penh', 'Female',
   'International relations, loves hosting small dinners and weekend movie nights. Relaxed about clutter, never about rent.',
   'night-owl', 'sleep-in', 'relaxed', 'lively', 51),
  (6,  'rithy.sok@example.com',     'Rithy Sok',        'Paragon International University', 'Male',
   'Architecture student. Up at 6 for the gym, drafting most evenings. Looking for someone tidy who respects focus time.',
   'early-bird', 'early-up', 'meticulous', 'quiet', 47),
  (7,  'monika.lim@example.com',    'Monika Lim',       'Institute of Foreign Languages', 'Female',
   'Translation student who tutors Korean on weekends. Plants everywhere, music at a sensible volume.',
   'fluid', 'quiet-until-10', 'meticulous', 'moderate', 40),
  (8,  'piseth.mao@example.com',    'Piseth Mao',       'CADT', 'Male',
   'Data science student. Night owl with headphones on, so you will not hear me. Tidy shared spaces matter to me.',
   'night-owl', 'quiet-until-10', 'tidy', 'quiet', 33),
  (9,  'sreymom.touch@example.com', 'Sreymom Touch',    'Royal University of Law and Economics', 'Female',
   'Law student, often in the library until 8. Early to bed on weeknights. Friendly, but values quiet study time.',
   'early-bird', 'quiet-until-10', 'tidy', 'moderate', 27),
  (10, 'kimleang.chea@example.com', 'Kimleang Chea',    'Institute of Technology of Cambodia', 'Male',
   'Electrical engineering. Laid back, plays guitar (quietly, promise), and happy with a simple shared room.',
   'fluid', 'sleep-in', 'relaxed', 'moderate', 21),
  (11, 'lina.phan@example.com',     'Lina Phan',        'Norton University', 'Female',
   'Nursing student on early hospital rotations. I need quiet nights and a clean bathroom; I will do the same for you.',
   'early-bird', 'early-up', 'tidy', 'quiet', 16),
  (12, 'bunthoeun.ly@example.com',  'Bunthoeun Ly',     'National University of Management', 'Male',
   'Marketing student and event volunteer. Social, often out on weekends, happy to have friends over when everyone agrees.',
   'night-owl', 'sleep-in', 'relaxed', 'lively', 10),
  (13, 'nary.seng@example.com',     'Nary Seng',        'Royal University of Phnom Penh', 'Female',
   'Just moved to Phnom Penh for my master''s in biology. Still figuring out neighbourhoods, open to suggestions!',
   NULL, NULL, NULL, NULL, 5),
  (14, 'visal.chhun@example.com',   'Visal Chhun',      'CADT', 'Male',
   'First-year student looking for a room near campus from next semester.',
   NULL, NULL, NULL, NULL, 2);

-- ------------------------------------------------------------------------------
-- 1. Auth users. The on_auth_user_created trigger creates each profile.
-- ------------------------------------------------------------------------------
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  ('5eed0000-0000-4000-8000-' || lpad(n::TEXT, 12, '0'))::UUID,
  'authenticated',
  'authenticated',
  email,
  extensions.crypt('RoomieDemo!2026', extensions.gen_salt('bf')),
  now() - make_interval(days => joined_days_ago),
  '{"provider": "email", "providers": ["email"]}'::JSONB,
  jsonb_build_object('name', name, 'university', university, 'gender', gender),
  now() - make_interval(days => joined_days_ago),
  now() - make_interval(days => joined_days_ago),
  -- GoTrue expects empty strings here, not NULL, or sign-in fails.
  '', '', '', ''
FROM seed_students
ON CONFLICT DO NOTHING;

INSERT INTO auth.identities (
  id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at
)
SELECT
  gen_random_uuid(),
  u.id,
  u.id::TEXT,
  'email',
  jsonb_build_object('sub', u.id::TEXT, 'email', u.email, 'email_verified', true),
  u.created_at,
  u.created_at,
  u.created_at
FROM auth.users u
JOIN seed_students s ON s.email = u.email
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------------------------
-- 2. Profile details the sign-up trigger doesn't set.
-- ------------------------------------------------------------------------------
UPDATE public.profiles p
SET
  bio = s.bio,
  created_at = now() - make_interval(days => s.joined_days_ago),
  updated_at = now() - make_interval(days => s.joined_days_ago)
FROM seed_students s
WHERE p.id = ('5eed0000-0000-4000-8000-' || lpad(s.n::TEXT, 12, '0'))::UUID;

-- ------------------------------------------------------------------------------
-- 3. Compatibility quiz answers (ids match HABITS in src/lib/compatibility.ts).
-- ------------------------------------------------------------------------------
INSERT INTO public.compatibility_responses (
  user_id, answers, sleep_schedule, cleanliness_score, social_habit, updated_at
)
SELECT
  ('5eed0000-0000-4000-8000-' || lpad(n::TEXT, 12, '0'))::UUID,
  jsonb_build_object('sleep', sleep, 'weekend', weekend, 'cleanliness', cleanliness, 'noise', noise),
  sleep,
  CASE cleanliness WHEN 'meticulous' THEN 3 WHEN 'tidy' THEN 2 ELSE 1 END,
  noise,
  now() - make_interval(days => GREATEST(joined_days_ago - 1, 0))
FROM seed_students
WHERE sleep IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. Rooms accepting roommates. `settings` follows RoomSettings in
--    src/lib/room-settings.ts. They show on Browse once
--    20260927000000_public_room_listings.sql is applied.
-- ------------------------------------------------------------------------------
INSERT INTO public.rooms (
  id, owner_id, name, district, street, monthly_rent, move_in_date, lease_end_date,
  arrangement, member_count, accepting_roommates, settings, created_at, updated_at
) VALUES
  ('5eed0000-0000-4000-8000-100000000001', '5eed0000-0000-4000-8000-000000000001',
   'Lotus Lane Flat', 'Toul Kork, Phnom Penh', 'St 598, 10 min walk to CADT',
   540, '2026-11-01', '2027-10-31', 'private', 3, true,
   '{
     "joinCode": "a3f1",
     "invitees": [],
     "rules": {"quietHours": {"start": "22:00", "end": "06:30"}, "guestPolicy": "with-notice", "acTemperature": 26,
               "customGuidelines": ["Shoes off at the door", "Label your food in the fridge"]},
     "rotateChoresWeekly": true,
     "chores": [
       {"id": "kitchen", "title": "Deep Kitchen Clean", "schedule": "Weekly on Sundays", "assignee": "host", "completed": true},
       {"id": "trash", "title": "Recycling & Trash", "schedule": "Every Tuesday & Friday", "assignee": "shared", "completed": false},
       {"id": "bathroom", "title": "Bathroom Scrub", "schedule": "Weekly on Saturdays", "assignee": "shared", "completed": false}
     ],
     "utilities": [
       {"id": "electricity", "kind": "electricity", "name": "Electricity (EDC Meter)", "dueNote": "Due 5th of every month", "monthlyTotal": 66, "isEstimate": true},
       {"id": "water", "kind": "water", "name": "Clean Water (PPWSA)", "dueNote": "Due 10th of every month", "monthlyTotal": 12, "isEstimate": true},
       {"id": "internet", "kind": "internet", "name": "Fiber Wi-Fi", "dueNote": "Fixed fee $25/mo", "monthlyTotal": 25, "isEstimate": false}
     ],
     "payments": {}
   }'::JSONB,
   now() - INTERVAL '20 days', now() - INTERVAL '3 days'),

  ('5eed0000-0000-4000-8000-100000000002', '5eed0000-0000-4000-8000-000000000004',
   'Riverside Study House', 'Daun Penh, Phnom Penh', 'St 108, near Wat Phnom',
   630, '2026-10-15', '2027-09-30', 'private', 3, true,
   '{
     "joinCode": "7c2d",
     "invitees": [{"id": "kanha", "name": "Kanha Sok", "contact": "@kanha_pp"}],
     "rules": {"quietHours": {"start": "23:00", "end": "07:00"}, "guestPolicy": "with-notice", "acTemperature": 25, "customGuidelines": []},
     "rotateChoresWeekly": true,
     "chores": [
       {"id": "kitchen", "title": "Kitchen Wipe-down", "schedule": "Daily after dinner", "assignee": "shared", "completed": false},
       {"id": "trash", "title": "Recycling & Trash", "schedule": "Every Monday & Thursday", "assignee": "kanha", "completed": false},
       {"id": "vacuum", "title": "Living Room Vacuum", "schedule": "Bi-weekly Saturdays", "assignee": "host", "completed": true}
     ],
     "utilities": [
       {"id": "electricity", "kind": "electricity", "name": "Electricity (EDC Meter)", "dueNote": "Due 5th of every month", "monthlyTotal": 75, "isEstimate": true},
       {"id": "internet", "kind": "internet", "name": "Fiber Wi-Fi", "dueNote": "Fixed fee $28/mo", "monthlyTotal": 28, "isEstimate": false}
     ],
     "payments": {}
   }'::JSONB,
   now() - INTERVAL '15 days', now() - INTERVAL '1 day'),

  ('5eed0000-0000-4000-8000-100000000003', '5eed0000-0000-4000-8000-000000000007',
   'BKK1 Garden Loft', 'BKK1, Phnom Penh', 'St 294, above a bakery',
   760, '2026-12-01', '2027-11-30', 'private', 4, true,
   '{
     "joinCode": "e91b",
     "invitees": [],
     "rules": {"quietHours": {"start": "22:30", "end": "07:00"}, "guestPolicy": "anytime", "acTemperature": 25,
               "customGuidelines": ["Water the balcony plants on your chore week"]},
     "rotateChoresWeekly": true,
     "chores": [
       {"id": "kitchen", "title": "Deep Kitchen Clean", "schedule": "Weekly on Sundays", "assignee": "host", "completed": false},
       {"id": "plants", "title": "Balcony & Plant Watering", "schedule": "Every other day", "assignee": "shared", "completed": false}
     ],
     "utilities": [
       {"id": "electricity", "kind": "electricity", "name": "Electricity (EDC Meter)", "dueNote": "Due 5th of every month", "monthlyTotal": 96, "isEstimate": true},
       {"id": "water", "kind": "water", "name": "Clean Water (PPWSA)", "dueNote": "Due 10th of every month", "monthlyTotal": 16, "isEstimate": true},
       {"id": "internet", "kind": "internet", "name": "Fiber Wi-Fi", "dueNote": "Fixed fee $30/mo", "monthlyTotal": 30, "isEstimate": false}
     ],
     "payments": {}
   }'::JSONB,
   now() - INTERVAL '9 days', now() - INTERVAL '9 days'),

  ('5eed0000-0000-4000-8000-100000000004', '5eed0000-0000-4000-8000-000000000006',
   'Sen Sok Quiet Nest', 'Sen Sok, Phnom Penh', 'Near Aeon Mall Sen Sok',
   340, '2026-11-15', '2027-11-14', 'shared', 2, true,
   '{
     "joinCode": "4d08",
     "invitees": [],
     "rules": {"quietHours": {"start": "21:30", "end": "06:00"}, "guestPolicy": "never", "acTemperature": 27,
               "customGuidelines": ["Lights out by 10:30 on weekdays"]},
     "rotateChoresWeekly": false,
     "chores": [
       {"id": "floor", "title": "Sweep & Mop", "schedule": "Every Wednesday & Sunday", "assignee": "host", "completed": false},
       {"id": "trash", "title": "Recycling & Trash", "schedule": "Every Tuesday & Friday", "assignee": "shared", "completed": false}
     ],
     "utilities": [
       {"id": "electricity", "kind": "electricity", "name": "Electricity (EDC Meter)", "dueNote": "Due 5th of every month", "monthlyTotal": 38, "isEstimate": true},
       {"id": "internet", "kind": "internet", "name": "Fiber Wi-Fi", "dueNote": "Fixed fee $20/mo", "monthlyTotal": 20, "isEstimate": false}
     ],
     "payments": {}
   }'::JSONB,
   now() - INTERVAL '6 days', now() - INTERVAL '6 days'),

  ('5eed0000-0000-4000-8000-100000000005', '5eed0000-0000-4000-8000-000000000011',
   'Russian Market Duplex', 'Toul Tom Poung, Phnom Penh', 'St 450, two streets from the market',
   495, '2027-01-05', '2027-12-31', 'private', 3, true,
   '{
     "joinCode": "b6e4",
     "invitees": [],
     "rules": {"quietHours": {"start": "22:00", "end": "05:30"}, "guestPolicy": "with-notice", "acTemperature": 26, "customGuidelines": []},
     "rotateChoresWeekly": true,
     "chores": [
       {"id": "bathroom", "title": "Bathroom Scrub", "schedule": "Weekly on Saturdays", "assignee": "host", "completed": false},
       {"id": "kitchen", "title": "Kitchen Wipe-down", "schedule": "Daily after dinner", "assignee": "shared", "completed": false}
     ],
     "utilities": [
       {"id": "electricity", "kind": "electricity", "name": "Electricity (EDC Meter)", "dueNote": "Due 5th of every month", "monthlyTotal": 60, "isEstimate": true},
       {"id": "water", "kind": "water", "name": "Clean Water (PPWSA)", "dueNote": "Due 10th of every month", "monthlyTotal": 11, "isEstimate": true}
     ],
     "payments": {}
   }'::JSONB,
   now() - INTERVAL '2 days', now() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 5. Conversations between demo students. Only visible to the two people in
--    each one, so sign in as a demo account to see them.
-- ------------------------------------------------------------------------------
INSERT INTO public.messages (id, sender_id, receiver_id, content, read, created_at)
SELECT
  ('5eed0000-0000-4000-8000-2000000000' || lpad(m.n::TEXT, 2, '0'))::UUID,
  ('5eed0000-0000-4000-8000-' || lpad(m.sender::TEXT, 12, '0'))::UUID,
  ('5eed0000-0000-4000-8000-' || lpad(m.receiver::TEXT, 12, '0'))::UUID,
  m.content,
  m.read,
  now() - m.ago
FROM (VALUES
  -- Dara asks Sophea about Lotus Lane Flat (the last one is unread for Sophea).
  (1,  2, 1, 'Hi Sophea! I saw Lotus Lane Flat on Browse. Is one of the rooms still free for November?', true, INTERVAL '2 days 3 hours'),
  (2,  1, 2, 'Hi Dara! Yes, two rooms are still open. Fair warning, it''s a quiet house after 10pm.', true, INTERVAL '2 days 2 hours'),
  (3,  2, 1, 'That works, I use headphones when I study late. Could I come see it this weekend?', true, INTERVAL '2 days 1 hour'),
  (4,  1, 2, 'Sure, Saturday at 10am? I''ll send the pin on the day.', true, INTERVAL '1 day 20 hours'),
  (5,  2, 1, 'Saturday 10am is perfect. See you then!', false, INTERVAL '3 hours'),
  -- Lina asks Sophea about quiet hours (unread).
  (6,  11, 1, 'Hello! I''m a nursing student with early shifts. Are quiet hours strictly kept at your place?', false, INTERVAL '40 minutes'),
  -- Sreymom and Monika talk about BKK1 Garden Loft.
  (7,  9, 7, 'Hi Monika, your loft looks lovely. How far is it from RULE by tuk-tuk?', true, INTERVAL '4 days'),
  (8,  7, 9, 'About 10 minutes, 15 in rush hour. The balcony is great for studying too!', true, INTERVAL '3 days 22 hours'),
  (9,  9, 7, 'Amazing. Is the $190 share including Wi-Fi?', true, INTERVAL '3 days 20 hours'),
  (10, 7, 9, 'Rent is $190 each, bills are split separately, usually around $35 each.', false, INTERVAL '1 day'),
  -- Piseth and Vuthy about Riverside Study House.
  (11, 8, 4, 'Hey Vuthy, I''m a night owl but very quiet. Would that be okay at Riverside Study House?', true, INTERVAL '5 days'),
  (12, 4, 8, 'Should be fine as long as it''s quiet after 11. Kanha is joining too. Want to meet for coffee first?', true, INTERVAL '4 days 18 hours'),
  (13, 8, 4, 'Definitely. Brown Coffee near Wat Phnom on Thursday?', true, INTERVAL '4 days 17 hours')
) AS m(n, sender, receiver, content, read, ago)
ON CONFLICT (id) DO NOTHING;

COMMIT;
