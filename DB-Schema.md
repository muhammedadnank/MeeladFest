# 3. DB Schema (MongoDB / Mongoose)

## `users`
```js
{ _id, name, email /* unique */, passwordHash, createdAt }
```

## `password_resets` (forgot-password token flow)
```js
{ _id, userId /* ref users */, token /* random, hashed before storing */, expiresAt /* short-lived, e.g. 1 hour — TTL index */, usedAt /* set once consumed, prevents token reuse */, createdAt }
```

## `fests`
```js
{
  _id, ownerId /* ref users — the Super Admin who created the fest */, slug /* unique */,
  festName, madrasaName, area, district, date, venue, description, bannerImageUrl,
  pointsConfig: { first: Number /* default 5 */, second: Number /* default 3 */, third: Number /* default 1 */, groupMultiplier: Number /* default 1.5 */ },
  isActive /* fest is currently ongoing/live — controls homepage "active fests" listing; manual owner toggle only, no automatic date-based flip */,
  isDeleted: Boolean /* default false — owner "delete" is a soft-delete: hides fest everywhere, all child data (teams/participants/results/etc.) is kept as-is, nothing cascade-deleted */,
  deletedAt /* set when isDeleted flips true; owner can restore by flipping back */,
  createdAt, updatedAt
}
```

## `fest_admins` (Super Admin + invited Sub-Admins per fest)
```js
{
  _id, festId /* indexed */, userId /* ref users, null until invite accepted */,
  invitedEmail /* used to match on signup/login before userId is linked */,
  role: String /* 'owner' | 'subadmin' */,
  permissions: {
    participants: Boolean /* default false */,
    results: Boolean /* default false */,
    updates: Boolean /* default false */,
    gallery: Boolean /* default false */
  } /* ignored/always-true when role='owner' */,
  status: String /* 'pending' | 'accepted' | 'revoked' */,
  invitedAt, acceptedAt, revokedAt /* set when owner revokes access; row kept for audit history, not deleted */
}
```
> One row per fest per owner too (role='owner', all permissions implicitly true, created automatically when fest is created).
> Unique index on `{ festId, invitedEmail }` — no duplicate invites for the same email on the same fest.
> Revoke = soft delete: `status` set to `'revoked'` + `revokedAt` stamped. `getFestPermission()` treats `revoked` same as no access. Row stays for "who had access when" history; owner can re-invite (flip back to `pending`/`accepted`) without losing the audit trail.

## `teams`
```js
{ _id, festId /* indexed */, name, color }
```
> No manual `order` field — teams list sorted alphabetically by `name` in the UI.
> Delete rule: edit always allowed (name/color changes); **delete blocked** if any `participants`, `group_entries`, or `results` row references this `teamId` — same reasoning as categories/items below.

## `categories`
```js
{ _id, festId /* indexed */, name, ageRange }
```
> No manual `order` field — categories list sorted alphabetically by `name` in the UI.
> Delete rule: edit always allowed (name/ageRange changes); **delete blocked** if any `results` row references this `categoryId` (via its items) — prevents orphaned results and broken leaderboard aggregation. API returns a 409 with a clear message; owner must remove the underlying results first if they really want to delete.

## `items`
```js
{
  _id, festId /* indexed */, categoryId /* ref categories */,
  name, description,
  type: String /* 'single' | 'group' */,
  maxParticipantsPerTeam: Number /* optional, null = no limit — caps how many participants from one team can be entered for this single item; only meaningful for type='single' */
}
```
> No manual `order` field — items list (within a category) sorted alphabetically by `name` in the UI.
> Delete rule: edit always allowed (name/description/type changes); **delete blocked** if any `results` row references this `itemId`, or any `group_entries` row references it (for group items) — prevents orphaned results/entries. API returns a 409; owner must remove the underlying results/entries first.

## `participants`
```js
{
  _id, festId /* indexed */, chestNo: String /* Chest Number / Fest ID, e.g. '101', 'J-05' — used for certificate lookup */,
  name, phone /* optional contact number */, teamId /* ref teams */, categoryId /* ref categories */,
  itemIds: [ObjectId] /* single items this participant is competing in */,
  addedBy /* ref users — admin/sub-admin who entered this record (no public self-registration) */,
  addedAt
}
```

## `group_entries` (group item registrations — one per team per group item)
```js
{
  _id, festId /* indexed */, itemId /* ref items, type=group */, teamId /* ref teams */,
  participants: [{ name: String, chestNo: String /* Chest No / Fest ID for self-service certificate lookup */ }],
  addedBy /* ref users — admin/sub-admin who entered this record */,
  addedAt
}
```
> Unique index on `{ festId, itemId, teamId }` — one entry per team per group item (prevents duplicate registration).

## `results`
```js
{
  _id, festId /* indexed */, itemId /* ref items */, categoryId, teamId,
  itemType: String /* 'single' | 'group' */,
  participantId: ObjectId /* set if itemType=single, else null */,
  groupEntryId: ObjectId /* set if itemType=group, else null */,
  position: Number /* 1, 2, 3 */,
  points: Number /* copied from pointsConfig at entry time, group items × groupMultiplier */,
  enteredAt
}
```

## `programs`
```js
{ _id, festId /* indexed */, time, title, description, order }
```

## `updates`
```js
{ _id, festId /* indexed */, text, imageUrl, postedAt /* desc indexed */ }
```

## `gallery`
```js
{ _id, festId /* indexed */, imageUrl, cloudinaryPublicId, uploadedAt }
```

## `faqs`
```js
{ _id, festId /* indexed */, question, answer, order }
```

## `feedback`
```js
{ _id, festId /* indexed */, name /* optional */, rating: Number /* 1-5, required */, comment /* optional */, submittedAt }
```

## `activity_log` (owner-visible audit trail of admin/sub-admin actions)
```js
{
  _id, festId /* indexed */, userId /* ref users — who performed the action */,
  role: String /* 'owner' | 'subadmin', snapshot at time of action */,
  action: String /* e.g. 'participant.create', 'participant.update', 'result.create', 'update.create', 'gallery.upload', 'gallery.delete' */,
  entityType: String /* 'participant' | 'group_entry' | 'result' | 'update' | 'gallery' */,
  entityId: ObjectId,
  summary: String /* short human-readable line, e.g. "Added participant Ahmed to Team Fatah" */,
  createdAt /* desc indexed */
}
```
> Written automatically by every mutating route gated by a permission (participants/results/updates/gallery) — both owner and sub-admin actions logged, so owner can see everyone's activity in one place, not just sub-admins'.
> Not used for structural changes (teams/categories/items/fest settings) in v1 — those are owner-only anyway.

## Indexes Summary
`users.email` unique · `password_resets.token`, `password_resets.expiresAt` (TTL) · `fests.slug` unique · `fests.ownerId` · `fest_admins: { festId, invitedEmail }` unique · `fest_admins.userId`, `fest_admins.festId` · all child collections indexed on `festId` · `items.categoryId` · `participants: { festId, chestNo }` unique (no duplicate chest number within the same fest) · `participants.teamId`, `participants.categoryId`, `participants.chestNo` · `group_entries.itemId` · `group_entries: { festId, itemId, teamId }` unique (no duplicate team registration per group item) · `results.teamId`, `results.categoryId`, `results.participantId` (for leaderboard + championship aggregation) · `results: { festId, itemId, position }` unique where `itemType='single'` (no two participants sharing the same position) · `results: { festId, itemId, teamId, position }` unique where `itemType='group'` (no two teams sharing the same position) · `updates.postedAt` desc · `activity_log.festId`, `activity_log.createdAt` desc.


