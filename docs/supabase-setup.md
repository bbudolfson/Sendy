# Supabase setup for Sendy

## 1. Environment

Copy `env.example` to `.env.local` and add your **anon key** from  
[Supabase Dashboard → Project Settings → API](https://supabase.com/dashboard/project/chuieqzbufmjdwtnoenq/settings/api).

```bash
cp env.example .env.local
```

Required:

- `NEXT_PUBLIC_SUPABASE_URL` — already set to your project
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — paste from dashboard

Optional:

- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — real card charges
- Without Stripe, checkout **confirms reservations without charging** (dev mode)

## 2. Run the database migration

In the Supabase SQL editor, run the full contents of:

`supabase/migrations/20250515000000_initial_schema.sql`

This creates tables, RLS policies, storage bucket `bike-photos`, and seeds markets (Moab, Bend, Boulder).

## 3. Auth redirect URLs

**Authentication → URL Configuration**

| Setting | Value |
|---------|--------|
| Site URL | `http://localhost:3000` |
| Redirect URLs | `http://localhost:3000/auth/callback` |

Add production URLs when you deploy.

## 4. Email auth

Enable **Email** provider under Authentication → Providers.  
For local dev you can disable “Confirm email” under Authentication → Providers → Email.

## 5. Create accounts

| Role | How |
|------|-----|
| **Rider** | `/create-account` or sign-in modal |
| **Shop** | `/shop` → Create account (metadata `role: shop` creates a `shops` row) |

After shop signup, set **market** on the shop profile (e.g. Bend) so bikes appear in rider search for that location.

## 6. Shop workflow

1. Sign in at `/shop`
2. Complete profile (city/state used for listings)
3. **Inventory → Add bike** — photos upload to Storage when Supabase is configured
4. Connect payments (demo toggles status in DB; Stripe Connect is a follow-up)
5. Riders search by market name (e.g. “Bend”) on `/dashboard`

## 7. Troubleshooting

- **“Invalid API key”** — check anon key in `.env.local`, restart `npm run dev`
- **RLS errors** — ensure migration ran and you are signed in
- **Overlap booking error** — another reservation exists for those dates
- **Photos fail** — confirm `bike-photos` bucket exists (created by migration)
