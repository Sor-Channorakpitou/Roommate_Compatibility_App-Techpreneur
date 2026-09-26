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
3. Open `.env` in the root of this project and paste your keys:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Restart your Vite development server:
   ```bash
   npm run dev
   ```

---

## 3. Apply Database Migrations

The app's current schema is defined by the timestamped files in
[`supabase/migrations`](./migrations). Apply them in order so profile
preferences, user listings, mutual-interest requests, and chat permissions are
all created consistently.

With the Supabase CLI installed and this project linked to your Supabase
project, run:

```bash
supabase db push
```

For the SQL Editor, run the migration files in timestamp order. Do not use the
older [`schema.sql`](./schema.sql) as a replacement; it predates the current
listing and matching schema.

---

## 4. Auth Settings (Optional Recommended Step)

For local development or testing without email confirmation:
1. In the Supabase dashboard, go to **Authentication** -> **Providers** -> **Email**.
2. Toggle **Confirm email** OFF (if you want users to sign in immediately without clicking an email verification link during development).
3. Click **Save**.
