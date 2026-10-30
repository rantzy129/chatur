# ⚡ RED LINE VIP — Web Store & Customer Portal

Modern, stream-proof tactical web store for **Red Line VIP**. Built using **Next.js 15 (App Router)**, **Tailwind CSS**, and **Supabase**, ready to deploy directly to **Vercel**.

---

## 🎯 Features

1. **Discord Authentication**:
   - Customers authenticate via Discord OAuth or instant connect.
   - All purchases, active licenses, and hardware locks are permanently bound to the customer's Discord ID.

2. **Pricing & Plans**:
   - **Weekly VIP**: ₱500 PHP (7 Days Full Engine Access)
   - **Monthly VIP**: ₱1,000 PHP (30 Days Full Engine Access)
   - **Lifetime VIP Pass**: ₱3,000 PHP (Permanent Access, Lifetime Updates, Free HWID Resets)

3. **GCash QR Checkout & Discord Staff Notifications**:
   - Displays tactical GCash QR and copyable phone number.
   - Customers enter their GCash Reference Number and upload their receipt screenshot.
   - Instant rich embed notification sent to your **Discord Staff Webhook** channel with order details and receipt image.

4. **Staff Admin Gateway (`/redgate`)**:
   - Protected by `ADMIN_SECRET_KEY`.
   - Live revenue metrics & pending order counters.
   - **[Approve Order]**: Instantly generates an `ESM-XXXX-XXXX-XXXX` license, binds it to the user's Discord ID, sets expiration (7 days, 30 days, or Lifetime), and updates Supabase.
   - **[Reject Order]**: Marks payment as rejected with custom notes.
   - **[Reset HWID]**: Clears a user's hardware lock with 1 click when they upgrade their PC.
   - **[Ban / Unban]** & **[Delete]** license keys.

5. **Customer License Portal (`/dashboard`)**:
   - Shows user's Discord avatar, name, and ID.
   - Shows active license key (with hide/reveal toggle and 1-click copy).
   - Displays remaining time countdown or Permanent Lifetime VIP status.
   - Displays real-time PC Hardware ID binding status.
   - Client `.zip` download link and launch guide.

---

## 🚀 Setup & Deployment Guide

### Step 1: Run the Database Schema in Supabase
Open your [Supabase SQL Editor](https://supabase.com/dashboard/project/wjpwsrciijwprbgdhgtg/sql), copy the contents of `schema_orders.sql`, and execute it:

```sql
-- Creates the esm_orders table with RLS enabled
CREATE TABLE IF NOT EXISTS public.esm_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    discord_id TEXT NOT NULL,
    discord_username TEXT NOT NULL,
    discord_avatar TEXT,
    tier TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    payment_method TEXT DEFAULT 'GCash QR',
    reference_number TEXT NOT NULL,
    sender_name TEXT,
    receipt_url TEXT,
    status TEXT DEFAULT 'pending',
    admin_notes TEXT,
    license_key TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by TEXT
);
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env.local` or set these in **Vercel Project Settings -> Environment Variables**:

Never commit `.env.local`. The service-role key and admin secret must only be configured as private environment variables. Rotate any credentials that were previously exposed in source code before deploying.

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | `https://wjpwsrciijwprbgdhgtg.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Secret | `sb_secret_...` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | Public anon key |
| `ADMIN_SECRET_KEY` | Private secret passcode for the `/redgate` admin portal | Generate a long random value |
| `DISCORD_WEBHOOK_URL` | Discord webhook for staff payment alerts | `https://discord.com/api/webhooks/...` |
| `NEXT_PUBLIC_DISCORD_CLIENT_ID` | Discord Bot Application Client ID | `1561348357614735451` |
| `NEXT_PUBLIC_GCASH_NAME` | GCash Account Name | `ESMIRINGHOY VIP` |
| `NEXT_PUBLIC_GCASH_NUMBER` | GCash Mobile Number | `0912-345-6789` |
| `NEXT_PUBLIC_DISCORD_INVITE` | Official Discord Invite Link | `https://discord.gg/Whwxq9QAEN` |

---

## ☁️ Deploying to Vercel

### Option A: Via GitHub (Recommended)
1. Push your repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository and set the **Root Directory** to `web`.
4. Paste the Environment Variables listed above.
5. Click **Deploy**!

### Option B: Local Testing
Double-click `start_web.bat` or run:
```bash
node node_modules/next/dist/bin/next dev -p 3000
```
Then open `http://localhost:3000` in your browser.
