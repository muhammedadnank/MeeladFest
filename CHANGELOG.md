# Changelog

All notable changes to the **MeeladFest** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- **Phase 2**: Teams, Categories, and Items admin management interfaces.
- **Phase 3**: Public Fest Page (`/[slug]`) with live countdown, program schedule, and theme layout.
- **Phase 4**: Admin participant & group entry management UI with chest number tracking.
- **Phase 5**: Real-time results entry, auto-calculated team leaderboards, and individual championships.
- **Phase 6**: PDF certificate generation (`@react-pdf/renderer`) for participation and winner badges.
- **Phase 7 & 8**: Cloudinary photo gallery grid, live updates feed, FAQs, and feedback system.

---

## [0.1.0] - 2026-07-28

### Added
- **Documentation Suite**:
  - `PRD.md`: Comprehensive Product Requirements Document defining problem statements, multi-tenant requirements, user personas (Super Admin, Sub-Admin, Public Visitor), and core features.
  - `TRD.md`: Technical Requirements Document outlining Next.js 14 App Router architecture, MongoDB/Mongoose data strategy, NextAuth Credentials auth, Resend email integration, Cloudinary image workflow, `@react-pdf/renderer` setup, and rate-limiting specs.
  - `DB-Schema.md`: Full Mongo schema specifications for all 16 collections, compound indexing rules, and soft-delete safeguards.
  - `Implementation-Plan.md`: Phased execution roadmap from Phase 0 to Phase 9.

- **Database Models (Mongoose & TypeScript)**:
  - `User`: Accounts and password hash storage.
  - `PasswordReset`: Forgot/reset password tokens with TTL indexes.
  - `Fest`: Fest configurations, points multipliers, and soft-deletion tracking.
  - `FestAdmin`: Multi-tenant access controls with toggleable granular permissions (`participants`, `results`, `updates`, `gallery`).
  - `Team`: Custom fest houses/teams.
  - `Category`: Age-group competition categories (Sub Junior, Junior, Senior, Super Senior).
  - `Item`: Single/group competition items with team capacity limits and points.
  - `Participant`: Student chest number registration and item assignments.
  - `GroupEntry`: Team registrations for group events with chest-number participant lists.
  - `Result`: Competition placements (1st, 2nd, 3rd) and calculated points.
  - `Program`: Fest event schedule items.
  - `Update`: Live updates and announcements.
  - `Gallery`: Photo gallery items linked to Cloudinary assets.
  - `Faq`: Frequently Asked Questions accordion content.
  - `Feedback`: Public visitor ratings and comments.
  - `ActivityLog`: Audit logging model for tracking sub-admin and owner actions.

- **Authentication & Core API Endpoints**:
  - NextAuth.js setup (`src/lib/auth.ts`, `/api/auth/[...nextauth]`) using JWT session strategy and Credentials provider.
  - Account registration API (`/api/auth/register`).
  - Fest Management API (`/api/fests`, `/api/fests/[festId]`) supporting creation, update, and soft-deletion.
  - Sub-Admin Management API (`/api/fests/[festId]/subadmins`, `/api/fests/[festId]/subadmins/[adminId]`) for invites, permission edits, and access revocation.
  - Public Fest Listing API (`/api/fests/public`).

- **Core Utilities**:
  - `src/lib/db.ts`: Serverless-optimized cached Mongoose connection handler.
  - `src/lib/permissions.ts`: `getFestPermission()` helper for validating owner vs. sub-admin permissions.
  - `src/lib/activity.ts`: `logActivity()` helper for audit logging.
  - `src/lib/email.ts`: Resend API integration helper.

- **User Interface Components & Pages**:
  - Auth Provider wrapper (`AuthProvider.tsx`).
  - Public Homepage (`src/app/page.tsx`) showcasing active fests, feature cards, and festival overview.
  - Admin Login (`src/app/(auth)/login/page.tsx`) and Register (`src/app/(auth)/register/page.tsx`) pages.
  - Admin Dashboard shell (`src/app/dashboard/page.tsx`).
