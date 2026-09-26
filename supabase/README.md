# Supabase Setup Guide

This project is configured to use [Supabase](https://supabase.com) for authentication, user profiles, compatibility quiz data, and messaging.

---

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in or create an account.
2. Click **New project**.
3. Choose your organization, give your project a name (e.g., `roommate-compatibility`), set a database password, and select a region close to your users (e.g., `Singapore - ap-southeast-1`).
4. Wait a few moments for your database to finish provisioning.

---

## 2. Copy API Keys into `.env`

1. In your Supabase Dashboard, go to **Project Settings** (gear icon) -> **API**.
2. Find the following values:
   - **Project URL**
   - **Project API Keys** -> `anon` / `public`
3. Open `.env.local` (or `.env`) in the root of this project and paste your keys:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Restart your Vite development server:
   ```bash
   npm run dev
   ```

---

## 3. Run the Database Schema

1. In your Supabase Dashboard, click on **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Copy the entire contents of [`supabase/schema.sql`](./schema.sql).
4. Paste it into the SQL Editor and click **Run**.
5. You should see `Success. No rows returned`.

This will:
- Create the `profiles` table.
- Create the `compatibility_responses` table.
- Create the `messages` table.
- Configure automatic user sync on signup via PostgreSQL triggers (`on_auth_user_created`).
- Set up Row Level Security (RLS) policies.
- Enable Supabase Realtime for messages.

---

## 4. Create the Rooms Table

The Create Room wizard (`/rooms/new`) and My Rooms page (`/rooms`) need one more script.

1. In the **SQL Editor**, open a new query.
2. Paste the contents of [`supabase/migrations/20260926000000_create_rooms.sql`](./migrations/20260926000000_create_rooms.sql) and click **Run** (or run `supabase db push`).

This creates the `rooms` table with SELECT, INSERT, UPDATE and DELETE policies so each signed-in user can only see and change their own rooms. The script is safe to re-run.

---

## 5. Publish Room Listings

Browse and the landing page show other hosts' open rooms. Rooms themselves stay
owner-only, so run one more script:

1. In the **SQL Editor**, open a new query.
2. Paste [`supabase/migrations/20260927000000_public_room_listings.sql`](./migrations/20260927000000_public_room_listings.sql) and click **Run** (or run `supabase db push`).

This adds `list_open_rooms()`, which returns only listing-safe columns (never
invitee contacts or join codes) for rooms that are accepting roommates. It also
stops the `profiles.email` column from being readable through the API: profiles
stay public so students can find each other, but emails don't.

Until it's applied, the Places tab on Browse stays empty and explains why.

---

## 6. Demo Data (Optional)

To make the site feel lived-in, paste [`supabase/seed.sql`](./seed.sql) into the
**SQL Editor** and click **Run** after the migrations above. It adds 14 demo
students (12 with quiz answers), 5 open rooms, and a few conversations.

- Every demo account signs in with the password `RoomieDemo!2026`. Try
  `sophea.chan@example.com`: she hosts a room and has unread messages.
- Re-running it is safe; it skips rows that already exist.
- Before launching to real students, run
  [`supabase/seed_cleanup.sql`](./seed_cleanup.sql). It deletes only the demo
  accounts (ids starting `5eed0000-`, `@example.com` emails) and everything
  attached to them.

---

## 7. Auth Settings (Optional Recommended Step)

For local development or testing without email confirmation:
1. In the Supabase dashboard, go to **Authentication** -> **Providers** -> **Email**.
2. Toggle **Confirm email** OFF (if you want users to sign in immediately without clicking an email verification link during development).
3. Click **Save**.
