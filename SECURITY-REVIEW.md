# Web Application Security Review

**Review date:** 2026-11-05  
**Scope:** Read-only review of the web application in this repository.  
**Status:** Application-code and schema fixes are prepared. The SQL hardening script must still be applied to the deployed Supabase database; until then, finding 2 may remain exposed in production.

This is a focused code/configuration review, not a penetration test. Confirm database grants and deployed Supabase policies before determining actual exposure.

## Findings

| # | Severity | File and lines | Finding | Confidence |
|---|---|---|---|---:|
| 1 | HIGH | [`lib/discord-auth.ts`](./lib/discord-auth.ts) | **Fixed in code.** Server authorization now requires a Discord identity from Supabase provider identity data and a valid Discord snowflake ID. It no longer trusts `user_metadata` or falls back to the Supabase UUID. Deploy this change to Vercel. | 9/10 |
| 2 | HIGH | [`schema_orders.sql`](./schema_orders.sql), [`schema_settings.sql`](./schema_settings.sql), and [`schema_security_hardening.sql`](./schema_security_hardening.sql) | **Fixed in schema files; production action required.** The broad policies are dropped, RLS stays enabled, and table privileges are revoked from `PUBLIC`, `anon`, and `authenticated`. Run `schema_security_hardening.sql` in the production Supabase SQL Editor to apply this to existing tables. | 8/10 |

## Recommended actions

1. Deploy the application change to Vercel and run `schema_security_hardening.sql` in Supabase.
2. Verify anon/authenticated roles cannot read or modify these tables, and confirm server-side customer, admin, and settings workflows still work.
3. Treat any potentially exposed order or license data as sensitive; review access logs where available and rotate affected credentials if investigation shows exposure.
