-- Persist housing preferences and support user-owned listing drafts/publication.
alter table public.profiles
  add column if not exists housing_preferences jsonb;

alter table public.roommate_listings
  add column if not exists owner_id uuid references auth.users(id) on delete cascade,
  add column if not exists is_published boolean not null default true;

drop policy if exists "Anyone can view published listings" on public.roommate_listings;
create policy "Anyone can view published listings"
  on public.roommate_listings for select to anon, authenticated
  using (is_published = true or owner_id = auth.uid());

create policy "Users can create their own listings"
  on public.roommate_listings for insert to authenticated
  with check (owner_id = auth.uid());

create policy "Users can update their own listings"
  on public.roommate_listings for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "Users can delete their own listings"
  on public.roommate_listings for delete to authenticated
  using (owner_id = auth.uid());

