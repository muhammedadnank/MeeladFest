# TRD — MeeladFest

## 1. Stack
- **Framework:** Next.js 14 (App Router), TypeScript
- **DB:** MongoDB Atlas (free M0), Mongoose
- **Auth:** NextAuth.js (Credentials), bcrypt — JWT session strategy (no `sessions`/`accounts` DB collection needed for Credentials provider)
- **Email:** Resend (free tier) — used for password-reset emails and sub-admin invite emails
- **Image storage:** Cloudinary (free tier)
- **PDF generation:** `@react-pdf/renderer` (serverless-friendly, no headless browser)
- **Hosting:** Vercel (free/hobby)
- **Styling:** Tailwind CSS

## 2. API Routes
```
/api/auth/*
/api/auth/change-password                   POST (logged-in, current password + new password)
/api/auth/forgot-password                   POST (email → sends reset link via Resend if account exists; always returns generic success message, no email-enumeration leak)
/api/auth/reset-password                    POST (token + new password → validates token, updates passwordHash, invalidates token)
/api/fests                                  GET (list), POST (create)
/api/fests/[slug]                           GET, PUT, DELETE (owner-only, DELETE is soft-delete: sets isDeleted=true, all data kept, fest just hidden from public/dashboard listing)
/api/fests/[slug]/admins                    GET, POST (invite sub-admin), PUT (edit permissions), DELETE (owner-only, soft-delete: sets status='revoked', row not removed)
/api/fests/[slug]/teams                     GET, POST, PUT, DELETE (owner-only; DELETE returns 409 if referenced by participants/group-entries/results)
/api/fests/[slug]/categories                GET, POST, PUT, DELETE (owner-only; DELETE returns 409 if referenced by results via its items)
/api/fests/[slug]/items                     GET, POST, PUT, DELETE (owner-only; DELETE returns 409 if referenced by results/group-entries)
/api/fests/[slug]/participants              GET, POST, PUT, DELETE (owner + sub-admin with 'participants' permission)
/api/fests/[slug]/group-entries             GET, POST, PUT, DELETE (owner + sub-admin with 'participants' permission)
/api/fests/[slug]/results                   GET (public), POST/PUT (owner + sub-admin with 'results' permission)
/api/fests/[slug]/leaderboard/team          GET (public, computed)
/api/fests/[slug]/leaderboard/individual    GET (public, computed)
/api/fests/[slug]/certificates              GET (public, ?chestNo=xxxx — returns a flat list of available certificate "slots": one participation entry per (participantId, itemId) pair for single items, one per group-entry the chestNo appears in, plus one winner entry per result where this participant/group-entry placed 1st/2nd/3rd)
/api/fests/[slug]/certificates/[participantId]      GET (PDF stream — single item's participation cert: `?itemId=xxx&type=participation`, or a winner cert: `?resultId=xxx&type=winner`; chestNo re-verified via query param)
/api/fests/[slug]/certificates/group/[groupEntryId] GET (PDF stream, one per named participant in a group entry — `?type=participation` or `?type=winner&resultId=xxx`; chestNo re-verified via query param)
/api/fests/[slug]/programs                  POST/PUT/DELETE (owner-only)
/api/fests/[slug]/updates                   GET (public), POST (owner + sub-admin with 'updates' permission)
/api/fests/[slug]/gallery                   POST (owner + sub-admin with 'gallery' permission), DELETE
/api/fests/[slug]/faqs                      GET (public), POST/PUT/DELETE (owner-only)
/api/fests/[slug]/feedback                  GET (owner-only), POST (public submit)
/api/fests/[slug]/activity-log              GET (owner-only, paginated — shows all admin/sub-admin actions on this fest)
/api/upload/sign
```

## 3. Auth & Authorization (Sub-Admins)
- NextAuth Credentials provider; session-ൽ `userId` store ചെയ്യും. Session strategy: **JWT**.
- ഓരോ fest-നും `fest_admins` collection-ൽ ഒരു entry per admin (owner ഉൾപ്പെടെ — fest create ചെയ്യുമ്പോൾ owner row auto-create ചെയ്യും).
- Middleware/helper `getFestPermission(festId, userId)` → `{ role: 'owner'|'subadmin', permissions: {...} }` return ചെയ്യും; `status: 'revoked'` ആണെങ്കിൽ `null`/no-access return ചെയ്യും (row delete ചെയ്യില്ല — audit history-ന് വേണ്ടി nilanilkkum, owner-ന് പിന്നീട് re-invite ചെയ്യാം).
- **Owner-only actions** (fest settings, delete, teams/categories/items structure, sub-admin management, programs, FAQs): `role === 'owner'` check.
- **Permission-gated actions** (participants, results, updates, gallery): owner ആണെങ്കിൽ എപ്പോഴും allow; sub-admin ആണെങ്കിൽ `permissions.<action> === true` check ചെയ്യും.
- Public GET routes-ന് auth വേണ്ട.
- Passwords bcrypt (cost 10) വെച്ച് hash ചെയ്യും.

## 3.1 Fest Soft-Delete
- Owner "delete fest" sets `fests.isDeleted: true` + `deletedAt` — no data (teams/categories/items/participants/results/gallery/etc.) is ever removed.
- Public routes (`/[slug]` page, all public GET APIs): treat `isDeleted: true` as 404 — deleted fest is fully hidden from visitors.
- Homepage discovery listing: excludes `isDeleted: true` fests (in addition to the existing `isActive` filter).
- Owner dashboard (`GET /api/fests`): shows deleted fests separately (e.g. a "Deleted" tab) with a **Restore** action that flips `isDeleted` back to `false` — no re-creation needed since nothing was lost.

## 3.2 Activity Log
- Every permission-gated mutating route (participants, group-entries, results, updates, gallery) writes an `activity_log` row after a successful write — regardless of whether the actor is the owner or a sub-admin.
- A shared helper `logActivity({festId, userId, role, action, entityType, entityId, summary})` is called at the end of each such route handler (fire-and-forget, doesn't block the response).
- `GET /api/fests/[slug]/activity-log` — owner-only, paginated, newest first — lets the owner see who (owner or which sub-admin) did what and when.
- Structural/owner-only routes (teams/categories/items/fest settings/sub-admin management) are **not** logged in v1 — only owner can touch them anyway, so there's nothing to audit against another actor.

## 4. Sub-Admin Invite Flow
- Super Admin email നൽകി invite ചെയ്യും → Resend വഴി ഒരു invite email അയക്കും (login/signup link സഹിതം) → ആ email-ൽ ഇതിനകം account ഇല്ലെങ്കിൽ, invite accept ചെയ്യുമ്പോൾ signup ചെയ്യാൻ പ്രേരിപ്പിക്കും (`fest_admins` row `status: 'pending'`, `invitedEmail` matched at signup/login time to auto-link `userId` and set `status: 'accepted'`).
- Invite ചെയ്യുമ്പോൾ തന്നെ permissions (participants/results/updates/gallery toggles) സെറ്റ് ചെയ്യും — പിന്നീട് owner-ന് edit ചെയ്യാം.
- Unique index `{festId, invitedEmail}` — ഒരേ email-ന് ഒരു fest-ന് ഒരു invite മാത്രം.

## 5. Participant & Group Entry Data (No Public Registration)
- Public-facing registration form ഇല്ല. Admin/sub-admin dashboard-ൽ ഒറ്റ ഫോമിൽ (gated by `participants` permission): `chestNo` (Chest No / Fest ID), `name`, `phone` (optional contact info), `team`, `category`, single items multi-select. `addedBy` (userId) record ചെയ്യും.
- Group items-ന് പ്രത്യേകം group-entry form: item + team + `participants: [{name, chestNo}]` list (`chestNo` needed for that person to self-lookup a certificate later).
- App/DB level unique constraint: ഒരു team ഒരു group item-ന് ഒരു entry മാത്രം (`{festId, itemId, teamId}` unique).
- **Max participants per team (single items)**: item-ന് `maxParticipantsPerTeam` set ചെയ്തിട്ടുണ്ടെങ്കിൽ, participant add/edit ചെയ്യുമ്പോൾ ആ team-ൽ നിന്ന് ആ item-ന് ഇതിനകം എത്ര പേർ ഉണ്ടെന്ന് count ചെയ്ത് limit കടക്കുന്നെങ്കിൽ API 400 return ചെയ്യും (app-level check, `participants.itemIds` array-ൽ കൂടി query ചെയ്യും).

## 6. Leaderboard & Championship Computation
- **Team leaderboard**: `results` → $match festId → $group by `categoryId + teamId` (category-wise) and `teamId` alone (overall) → $sum `points`.
- **Individual championship**: `results` where `itemType == 'single'` → $group by `categoryId + participantId` and `participantId` alone (overall) → $sum `points`.
- Group item results points `teamId`-ന് മാത്രം add ചെയ്യും, individual aggregation-ൽ ഉൾപ്പെടില്ല.
- **Tie handling**: points equal ആണെങ്കിൽ ഒരേ rank കൊടുക്കും (standard competition ranking, e.g. two teams tied at rank 1 → next team is rank 3, not 2). No secondary tiebreaker (like most-1st-places) — computed purely from `points`, sorted desc, equal points = equal rank. Individual championship-നും ഇതേ rule ബാധകം.
- On-the-fly MongoDB aggregation, caching വേണ്ട (v1-ന്, data size ചെറുത്).

## 7. Group Items Handling
- Item `type: 'group'` ആണെങ്കിൽ entry group-entry level ആണ് (`participants: [{name, chestNo}]`, reference only — result/points team-ന് പോകും).
- Result entry `groupEntryId` reference ചെയ്യും, `participantId` null.
- Result entry-യിലും duplicate position തടയാൻ unique constraint വേണം: `{festId, itemId, position}` (single), `{festId, itemId, teamId, position}` (group) — DB-Schema Indexes Summary കാണുക.

## 8. Certificates
- `@react-pdf/renderer` ഉപയോഗിച്ച് participation + winner templates (server-side React component → PDF).
- Certificate-ൽ `fests.date` (overall fest date) മാത്രമേ print ചെയ്യൂ — ഓരോ item-ന്റെയും specific competition date (`results.enteredAt`) track ചെയ്യുന്നില്ല, v1-ന് simple ആയി വെക്കുന്നു.
- **One certificate PDF per item** — ഒരു participant 3 single items-ൽ register ചെയ്തിട്ടുണ്ടെങ്കിൽ, participation certificate 3 separate PDF files ആയിരിക്കും (ഓരോ item-നും ഓരോന്ന്), ഒരു combined multi-page PDF അല്ല. Winner certificates-ഉം ഇതേ പോലെ, result/item ഒന്നിന് ഒന്ന്.
- Public flow: (1) Chest No / Fest ID നൽകി `GET /certificates?chestNo=xxxx` → ലഭ്യമായ എല്ലാ certificate slots-ഉം (participation per item + winner per result) ഒരു flat list ആയി കാണിക്കും → (2) select ചെയ്ത slot-ന്റെ PDF `GET /certificates/[participantId]?itemId=...&type=participation` (അല്ലെങ്കിൽ `?resultId=...&type=winner`), group items-ന് `/certificates/group/[groupEntryId]` വഴി stream ചെയ്യും — login വേണ്ട, ഓരോ PDF request-ലും `chestNo` re-verify ചെയ്യും.
- Group item-ൽ മാത്രം പങ്കെടുത്തയാൾക്ക് certificate വേണമെങ്കിൽ group entry-യിൽ അവരുടെ Chest No (`chestNo`) ഉണ്ടായിരിക്കണം.
- Malayalam font (Noto Sans Malayalam) embed ചെയ്യും.

## 9. Image Uploads
Cloudinary signed upload — namespace: `meeladfest/[slug]/[uuid]`.

## 10. Rate Limiting Storage
Vercel serverless functions stateless ആയതിനാൽ in-memory counters use ചെയ്യാൻ പറ്റില്ല. Rate limit state ഒരു Mongo collection-ൽ store ചെയ്യും:
```js
// rate_limits
{ _id, key /* e.g. "cert-lookup:<ip>:<festId>" */, windowStart, count, expiresAt /* TTL index */ }
```
Applies to: certificate lookup, feedback submission (public registration route ഇപ്പോൾ ഇല്ലാത്തതിനാൽ ആ item ഒഴിവാക്കി). Alternative: Upstash Redis (free tier) — വേണമെങ്കിൽ `UPSTASH_REDIS_URL`/`UPSTASH_REDIS_TOKEN` env vars add ചെയ്യാം; v1-ന് Mongo-based approach മതി.

## 11. Environment Variables
```
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
```

## 12. Non-Functional
Mobile-first, dynamic OG meta per fest, Malayalam UTF-8 text no special handling, certificate PDF Malayalam font embed.
