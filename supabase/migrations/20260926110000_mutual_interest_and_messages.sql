-- Connect requests become matches only when the listing owner accepts them.
alter table public.roommate_listings
  add column if not exists owner_name text;

create table if not exists public.listing_interests (
  id uuid primary key default gen_random_uuid(),
  listing_id text not null references public.roommate_listings(id) on delete cascade,
  interested_user_id uuid not null references auth.users(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  interested_name text not null,
  owner_name text not null,
  listing_name text not null,
  listing_location text not null,
  price_min integer not null,
  price_max integer not null,
  available_date text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  unique (listing_id, interested_user_id),
  check (interested_user_id <> owner_id)
);

alter table public.listing_interests enable row level security;

create policy "Participants can view listing interests"
  on public.listing_interests for select to authenticated
  using (interested_user_id = auth.uid() or owner_id = auth.uid());

create policy "Users can express interest in published listings"
  on public.listing_interests for insert to authenticated
  with check (
    interested_user_id = auth.uid()
    and interested_user_id <> owner_id
    and exists (
      select 1 from public.roommate_listings listing
      where listing.id = public.listing_interests.listing_id
        and listing.owner_id = public.listing_interests.owner_id
        and listing.is_published = true
    )
  );

create policy "Listing owners can respond to interest"
  on public.listing_interests for update to authenticated
  using (owner_id = auth.uid() and status = 'pending')
  with check (owner_id = auth.uid() and status in ('accepted', 'declined'));

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  interest_id uuid not null references public.listing_interests(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  receiver_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (length(trim(content)) between 1 and 4000),
  read boolean not null default false,
  created_at timestamptz not null default now(),
  check (sender_id <> receiver_id)
);

alter table public.messages
  add column if not exists interest_id uuid references public.listing_interests(id) on delete cascade;

create index if not exists messages_interest_created_idx
  on public.messages (interest_id, created_at);

alter table public.messages enable row level security;

-- Remove broad policies from the older schema.sql so only mutual matches can chat.
drop policy if exists "Users can see messages they sent or received" on public.messages;
drop policy if exists "Users can send messages" on public.messages;
drop policy if exists "Recipients can update message read status" on public.messages;

create policy "Matched participants can read messages"
  on public.messages for select to authenticated
  using (
    (sender_id = auth.uid() or receiver_id = auth.uid())
    and exists (
      select 1 from public.listing_interests interest
      where interest.id = interest_id
        and interest.status = 'accepted'
        and (interest.owner_id = auth.uid() or interest.interested_user_id = auth.uid())
    )
  );

create policy "Matched participants can send messages"
  on public.messages for insert to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.listing_interests interest
      where interest.id = interest_id
        and interest.status = 'accepted'
        and (
          (interest.owner_id = sender_id and interest.interested_user_id = receiver_id)
          or (interest.interested_user_id = sender_id and interest.owner_id = receiver_id)
        )
    )
  );

create policy "Message recipients can mark messages read"
  on public.messages for update to authenticated
  using (receiver_id = auth.uid())
  with check (receiver_id = auth.uid());

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end;
$$;
