-- ==============================================================================
-- ESMIRINGHOY VIP — WEB STORE ORDERS TABLE & STORAGE SCHEMA
-- Run this in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Create esm_orders table
CREATE TABLE IF NOT EXISTS public.esm_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    discord_id TEXT NOT NULL,
    discord_username TEXT NOT NULL,
    discord_avatar TEXT,
    tier TEXT NOT NULL,                  -- 'Monthly VIP' or 'Lifetime VIP'
    amount NUMERIC NOT NULL,             -- 1000 or 3000
    payment_method TEXT DEFAULT 'GCash QR',
    reference_number TEXT NOT NULL,
    sender_name TEXT,
    receipt_url TEXT,                    -- Base64 or uploaded image URL
    status TEXT DEFAULT 'pending',       -- 'pending', 'approved', 'rejected'
    admin_notes TEXT,
    license_key TEXT,                    -- Key assigned upon approval
    created_at TIMESTAMPTZ DEFAULT now(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by TEXT
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_esm_orders_discord_id ON public.esm_orders (discord_id);
CREATE INDEX IF NOT EXISTS idx_esm_orders_status ON public.esm_orders (status);
CREATE INDEX IF NOT EXISTS idx_esm_orders_created_at ON public.esm_orders (created_at DESC);

-- Enable RLS
ALTER TABLE public.esm_orders ENABLE ROW LEVEL SECURITY;

-- Allow public/service role access policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'esm_orders' AND policyname = 'Service role full access on orders'
    ) THEN
        CREATE POLICY "Service role full access on orders" ON public.esm_orders 
        FOR ALL USING (true);
    END IF;
END $$;

NOTIFY pgrst, 'reload schema';

