-- ==============================================================================
-- RED LINE / ESMIRINGHOY — SYSTEM SETTINGS & VERSION CONTROL SCHEMA
-- Run this in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.esm_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    min_client_version TEXT DEFAULT '1.0.0',
    latest_client_version TEXT DEFAULT '1.0.0',
    download_url TEXT DEFAULT 'https://discord.gg/Whwxq9QAEN',
    peace_cleaner_min_version TEXT DEFAULT '1.0.1',
    peace_cleaner_latest_version TEXT DEFAULT '1.0.1',
    peace_cleaner_download_url TEXT DEFAULT 'https://wjpwsrciijwprbgdhgtg.supabase.co/storage/v1/object/public/updates/PeaceCleaner.exe',
    enforce_version_check BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure columns exist if table was already created
ALTER TABLE public.esm_settings ADD COLUMN IF NOT EXISTS peace_cleaner_min_version TEXT DEFAULT '1.0.1';
ALTER TABLE public.esm_settings ADD COLUMN IF NOT EXISTS peace_cleaner_latest_version TEXT DEFAULT '1.0.1';
ALTER TABLE public.esm_settings ADD COLUMN IF NOT EXISTS peace_cleaner_download_url TEXT DEFAULT 'https://wjpwsrciijwprbgdhgtg.supabase.co/storage/v1/object/public/updates/PeaceCleaner.exe';

-- Insert default row
INSERT INTO public.esm_settings (id, min_client_version, latest_client_version, download_url, enforce_version_check)
VALUES ('global', '1.0.0', '1.0.0', 'https://discord.gg/Whwxq9QAEN', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.esm_settings ENABLE ROW LEVEL SECURITY;

-- Settings are managed through authenticated server routes only.
-- Do not add a public/authenticated policy for this table.
DROP POLICY IF EXISTS "Service role full access on settings" ON public.esm_settings;
REVOKE ALL PRIVILEGES ON TABLE public.esm_settings FROM PUBLIC, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.esm_settings TO service_role;

-- Reload Supabase PostgREST schema cache
NOTIFY pgrst, 'reload schema';
