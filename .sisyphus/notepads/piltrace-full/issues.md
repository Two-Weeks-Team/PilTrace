# Issues — PilTrace Full

## Known Gotchas
- Supabase Free tier: 1-week inactivity pause during development → access project weekly
- Drizzle + Supabase: `drizzle-kit push` causes timeouts → always use `drizzle-kit migrate`
- Next.js 16 uses `proxy.ts` instead of `middleware.ts` for auth session refresh
- `create-next-app` into existing directory: use `.` and accept any prompts with --yes
- Tailwind v4 config may differ from v3 — check latest docs
