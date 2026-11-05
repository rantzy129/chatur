# Web Application Security Review

**Review date:** 2026-11-05  
**Scope:** Read-only review of the web application in this repository.  
**Status:** Findings below are unremediated.

This is a focused code/configuration review, not a penetration test. Confirm database grants and deployed Supabase policies before determining actual exposure.

## Findings

| # | Severity | File and lines | Finding | Confidence |
|---|---|---|---|---:|
| 1 | HIGH | [`lib/discord-auth.ts`](./lib/discord-auth.ts), lines 31–36 | The helper prefers `user.user_metadata` values for the Discord account ID. User metadata may be user-editable. If a caller uses this ID to scope license, order, or download queries, an authenticated user could potentially substitute another Discord ID and access that account’s records or download entitlement. Resolve the ID from a verified provider identity or a trusted server-side mapping; do not authorize from editable metadata. | 9/10 |
| 2 | HIGH | [`schema_orders.sql`](./schema_orders.sql), lines 42–43; [`schema_settings.sql`](./schema_settings.sql), lines 38–39 | `FOR ALL USING (true)` policies have no role restriction. Depending on the project’s table grants and API exposure, these policies may permit public-key clients to read or modify order and settings rows. Order rows may contain payment references, receipt URLs, and license keys. Remove broad policies or restrict them to trusted server-side roles, and verify anon/authenticated grants and effective policies in Supabase. | 8/10 |

## Recommended actions

1. Change Discord identity resolution to use only an identity claim that is verified and immutable for the authenticated Discord provider. Review all callers to ensure authorization is never based on `user_metadata`.
2. Remove or narrowly scope the broad RLS policies. Check table grants for `anon` and `authenticated`, then test that public clients cannot read or mutate orders/settings while intended server-side workflows still work.
3. Treat any potentially exposed order or license data as sensitive; review access logs where available and rotate affected credentials if investigation shows exposure.
