-- Removes everything supabase/seed.sql created. Run it in the SQL Editor
-- before launching to real students.
--
-- Deleting the auth users cascades to their profiles, quiz answers, rooms and
-- messages. Real accounts are untouched: only ids starting 5eed0000- with an
-- @example.com email match.
DELETE FROM auth.users
WHERE id::TEXT LIKE '5eed0000-%'
  AND email LIKE '%@example.com';
