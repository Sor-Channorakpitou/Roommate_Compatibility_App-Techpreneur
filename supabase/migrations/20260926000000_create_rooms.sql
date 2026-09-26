-- ==============================================================================
-- Rooms (Create Room wizard + My Rooms page)
-- Apply with `supabase db push`, or paste into the SQL Editor. Safe to re-run.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Defaults to the signed-in user, so the client never has to send it.
  owner_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 80),
  district TEXT NOT NULL CHECK (char_length(btrim(district)) > 0),
  street TEXT NOT NULL DEFAULT '',
  monthly_rent NUMERIC(10, 2) NOT NULL CHECK (monthly_rent > 0),
  move_in_date DATE NOT NULL,
  lease_end_date DATE NOT NULL,
  arrangement TEXT NOT NULL DEFAULT 'private' CHECK (arrangement IN ('private', 'shared')),
  member_count SMALLINT NOT NULL CHECK (member_count BETWEEN 2 AND 6),
  accepting_roommates BOOLEAN NOT NULL DEFAULT true,
  -- Wizard extras (invitees, house rules, chores, utilities) kept as one document.
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT rooms_lease_ends_after_move_in CHECK (lease_end_date > move_in_date)
);

CREATE INDEX IF NOT EXISTS rooms_owner_id_idx ON public.rooms (owner_id);

-- Keep updated_at honest on every edit.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS rooms_set_updated_at ON public.rooms;
CREATE TRIGGER rooms_set_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Row Level Security: owners can only see and change their own rooms.
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners can view their rooms" ON public.rooms;
CREATE POLICY "Owners can view their rooms"
  ON public.rooms FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS "Owners can create rooms" ON public.rooms;
CREATE POLICY "Owners can create rooms"
  ON public.rooms FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS "Owners can update their rooms" ON public.rooms;
CREATE POLICY "Owners can update their rooms"
  ON public.rooms FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = owner_id)
  WITH CHECK ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS "Owners can delete their rooms" ON public.rooms;
CREATE POLICY "Owners can delete their rooms"
  ON public.rooms FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = owner_id);
