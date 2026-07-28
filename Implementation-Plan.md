# 4. Implementation Plan

## Phase 0 — Setup
Next.js + TypeScript + Tailwind scaffold · MongoDB Atlas + `lib/db.ts` · Mongoose models (all collections above) · Cloudinary + env vars · NextAuth setup · Resend account + env var · `@react-pdf/renderer` install.

## Phase 1 — Auth + Fest CRUD + Sub-Admins
Signup/login (Super Admin & Sub-Admins share same login) · Change-password page (logged-in) · Forgot/reset-password flow (Resend email, token in `password_resets`) · Dashboard shell (`/dashboard`) · Fest create (slug gen, auto-creates `fest_admins` owner row) · Edit/Delete fest · Sub-admin invite UI (email + permission toggles: participants/results/updates/gallery) — invite email sent via Resend · Sub-admin accept-invite flow (signup if new, else auto-link on next login) · `getFestPermission(festId, userId)` helper + route guards for owner-only vs permission-gated actions · `logActivity()` helper scaffolding (writes to `activity_log`, called by Phase 4/5/7 routes).

## Phase 2 — Teams, Categories, Items Setup
Admin UI: teams CRUD · categories CRUD (age range) · items CRUD (category assign + single/group type + custom points + optional max-participants-per-team limit for single items). Lists sorted alphabetically by name — no drag-and-drop reorder UI needed.

## Phase 3 — Public Fest Page (base)
`/[slug]` route · Hero + countdown · Program schedule · Dynamic OG meta · Homepage fest listing.

## Phase 4 — Participant & Group Entry Data Entry (Admin-only)
Admin/sub-admin dashboard form (gated by `participants` permission): `chestNo` (Chest No / Fest ID), `name`, `phone` (optional), `team`, `category`, single items multi-select — no public-facing form · enforce item's `maxParticipantsPerTeam` limit if set · Group entry admin UI (team + item + participant names + `chestNo` list — `chestNo` needed for self-service certificate lookup) · Participants/group-entries list + CSV export · `logActivity()` call on every create/update/delete.

## Phase 5 — Results, Team Leaderboard, Individual Championship
Admin "enter result" UI per item, gated by `results` permission (single: pick participant; group: pick team) · points auto-calc (incl. group multiplier) · Team leaderboard aggregation API (public, ties get equal rank) · Individual championship aggregation API (public, same tie rule) · Public components with 30s polling · `logActivity()` call on every result entered/edited.

## Phase 6 — Certificates
Participation + winner PDF templates (`@react-pdf/renderer`) — one PDF per item (not combined multi-item PDF) · Malayalam font embed · Public certificate lookup (`chestNo` → flat list of participation/winner slots per item → download; see TRD 2.5/8) · Admin bulk generate (optional v1.1).

## Phase 7 — Gallery & Live Updates
Signed Cloudinary upload · Admin gallery upload/delete (gated by `gallery` permission) · Public gallery grid · Admin "post update" form (gated by `updates` permission) · Public updates feed with polling · `logActivity()` call on gallery/update actions.

## Phase 8 — FAQ & Feedback
Admin FAQ CRUD (owner-only) · Public FAQ accordion component · Public feedback form (rating + comment) · Admin feedback list view (owner-only).

## Phase 9 — Polish & Hardening
Mobile responsiveness pass · empty states · fest/account creation limits (anti-abuse) · per-IP rate limit on certificate lookup + feedback (Mongo `rate_limits` collection, see TRD 2.6.1 — public registration removed from this list since it no longer exists) · duplicate-entry validation (one group entry per team per item, one result per position — see DB-Schema Indexes Summary) · Owner-only Activity Log viewer page (paginated, filterable by sub-admin) · error handling/toasts · final Vercel deploy.

## Suggested Order
Phase 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9, ഓരോ phase-ഉം സ്വയം deployable/demoable ആയിരിക്കും.
