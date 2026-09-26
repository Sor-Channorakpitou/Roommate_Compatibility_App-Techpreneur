-- Run with `supabase db push`, or paste into the Supabase SQL Editor.
-- The profile trigger uses sign-up metadata so the browser never needs elevated keys.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  university text not null,
  gender text not null check (gender in ('Male', 'Female', 'Other')),
  created_at timestamptz not null default now()
);

create table if not exists public.compatibility_responses (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  responses jsonb not null,
  completed_at timestamptz not null default now()
);

-- A database representation of the fields in src/features/find-roommates/data/roommates-data.ts.
create table if not exists public.roommate_listings (
  id text primary key,
  type text not null check (type in ('roommate', 'place', 'has_room')),
  badge_label text not null,
  name text not null,
  age integer,
  match_score integer check (match_score between 0 and 100),
  price_min integer not null,
  price_max integer not null,
  subtitle text not null,
  location text not null,
  available_date text not null,
  quote text not null,
  tags text[] not null default '{}',
  housing_type text not null,
  area_category text not null,
  lifestyle_rhythms text[] not null default '{}',
  move_in_horizon text not null,
  bio text,
  habit_comparisons jsonb not null default '[]'::jsonb,
  breakdown jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.compatibility_responses enable row level security;
alter table public.roommate_listings enable row level security;

create policy "Users can read their own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "Users can update their own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "Users can read their responses" on public.compatibility_responses for select to authenticated using (user_id = auth.uid());
create policy "Users can save their responses" on public.compatibility_responses for insert to authenticated with check (user_id = auth.uid());
create policy "Anyone can view published listings" on public.roommate_listings for select to anon, authenticated using (true);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email, university, gender)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'university', ''),
    coalesce(new.raw_user_meta_data ->> 'gender', 'Other')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
