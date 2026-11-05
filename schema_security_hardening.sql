-- Apply in the Supabase SQL Editor to harden already-deployed tables.
-- Run after esm_orders and esm_settings have been created.

ALTER TABLE public.esm_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access on orders" ON public.esm_orders;
REVOKE ALL PRIVILEGES ON TABLE public.esm_orders FROM PUBLIC, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.esm_orders TO service_role;

ALTER TABLE public.esm_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access on settings" ON public.esm_settings;
REVOKE ALL PRIVILEGES ON TABLE public.esm_settings FROM PUBLIC, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.esm_settings TO service_role;

NOTIFY pgrst, 'reload schema';
