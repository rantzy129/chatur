-- ==============================================================================
-- RED LINE VIP — SUPABASE PRODUCTION DATABASE HARDENING SCRIPT
-- Execute in Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Hardening esm_orders
ALTER TABLE IF EXISTS public.esm_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access on orders" ON public.esm_orders;
REVOKE ALL PRIVILEGES ON TABLE public.esm_orders FROM PUBLIC, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.esm_orders TO service_role;

-- 2. Hardening esm_licenses (Protects all keys, HWIDs, Discord IDs from anon inspection)
ALTER TABLE IF EXISTS public.esm_licenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access on licenses" ON public.esm_licenses;
REVOKE ALL PRIVILEGES ON TABLE public.esm_licenses FROM PUBLIC, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.esm_licenses TO service_role;

-- 3. Hardening esm_settings
ALTER TABLE IF EXISTS public.esm_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access on settings" ON public.esm_settings;
REVOKE ALL PRIVILEGES ON TABLE public.esm_settings FROM PUBLIC, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.esm_settings TO service_role;

-- 4. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
