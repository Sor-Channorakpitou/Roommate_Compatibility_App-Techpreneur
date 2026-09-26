-- ==============================================================================
-- Public room listings + profile email privacy
-- Apply with `supabase db push`, or paste into the SQL Editor. Safe to re-run.
-- ==============================================================================

-- Rooms stay owner-only under RLS. Browse and the landing page read open rooms
-- through this function instead, which returns only listing-safe columns: never
-- invitee contacts or the join code stored in `settings`.
CREATE OR REPLACE FUNCTION public.list_open_rooms()
RETURNS TABLE (
  id UUID,
  owner_id UUID,
  owner_name TEXT,
  name TEXT,
  district TEXT,
  monthly_rent NUMERIC,
  move_in_date DATE,
  lease_end_date DATE,
  arrangement TEXT,
  member_count SMALLINT,
  open_spots INTEGER,
  guest_policy TEXT,
  quiet_hours_start TEXT,
  quiet_hours_end TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    r.id,
    r.owner_id,
    p.name,
    r.name,
    r.district,
    r.monthly_rent,
    r.move_in_date,
    r.lease_end_date,
    r.arrangement,
    r.member_count,
    GREATEST(
      r.member_count - 1 - COALESCE(jsonb_array_length(r.settings -> 'invitees'), 0),
      0
    )::INTEGER,
    r.settings #>> '{rules,guestPolicy}',
    r.settings #>> '{rules,quietHours,start}',
    r.settings #>> '{rules,quietHours,end}',
    r.created_at
  FROM public.rooms r
  LEFT JOIN public.profiles p ON p.id = r.owner_id
  WHERE r.accepting_roommates
  ORDER BY r.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.list_open_rooms() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_open_rooms() TO anon, authenticated;

-- Profiles are publicly readable so students can find each other, but the
-- email column must not be. Swap the table-wide grant for a column list.
REVOKE SELECT ON public.profiles FROM anon, authenticated;
GRANT SELECT (id, name, university, gender, bio, avatar_url, created_at, updated_at)
  ON public.profiles TO anon, authenticated;
