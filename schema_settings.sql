-- ==============================================================================
-- RED LINE / ESMIRINGHOY — SYSTEM SETTINGS & VERSION CONTROL SCHEMA
-- Run this in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.esm_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    min_client_version TEXT DEFAULT '1.0.0',
    latest_client_version TEXT DEFAULT '1.0.0',
    download_url TEXT DEFAULT 'https://discord.gg/Whwxq9QAEN',
    enforce_version_check BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default row
INSERT INTO public.esm_settings (id, min_client_version, latest_client_version, download_url, enforce_version_check)
VALUES ('global', '1.0.0', '1.0.0', 'https://discord.gg/Whwxq9QAEN', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.esm_settings ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'esm_settings' AND policyname = 'Service role full access on settings'
    ) THEN
        CREATE POLICY "Service role full access on settings" ON public.esm_settings 
        FOR ALL USING (true);
    END IF;
END $$;

-- Reload Supabase PostgREST schema cache
NOTIFY pgrst, 'reload schema';

