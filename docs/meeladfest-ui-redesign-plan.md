# 🌙 MeeladFest — Full UI Redesign Implementation Plan

> **Project:** MeeladFest — Multi-Tenant Madrasa Fest Management Platform
> **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS
> **Repo:** https://github.com/muhammedadnank/MeeladFest
> **Live:** https://meelad-fest-kerala.vercel.app
> **Plan Version:** v1.2.0 (Completed) · July 2026
> **Status:** ✅ 100% Completed & Merged into `main`

---

## 1. Design System Foundation

### 1.1 Color Palette

| Token Name        | Hex       | Usage                                      |
|-------------------|-----------|--------------------------------------------|
| `emerald-950`     | `#0f3d26` | Hero backgrounds, nav bar                  |
| `emerald-800`     | `#1a5c3a` | Fest card tops, section accents            |
| `emerald-600`     | `#2d7a52` | Mid-tone fills, avatar backgrounds         |
| `emerald-100`     | `#e8f5ee` | Feature icon backgrounds, hover states     |
| `gold-500`        | `#c8962a` | Primary CTA buttons, cert engine button    |
| `gold-200`        | `#f0d080` | Hero text accents, Arabic numeral display  |
| `gold-50`         | `#fdf6e3` | Gold-tinted chip backgrounds               |
| `cream`           | `#faf7f0` | Page background                            |
| `border-warm`     | `#e8e2d5` | Card borders, dividers                     |
| `text-dark`       | `#1a2a1e` | Primary body text                          |

### 1.2 Typography

| Role          | Family              | Weight  | Size      | Usage                              |
|---------------|---------------------|---------|-----------|------------------------------------|
| Display       | `Amiri` (serif)     | 700     | 32–38px   | Page H1, fest names                |
| Section Head  | `Amiri` (serif)     | 700     | 20–26px   | Card titles, leaderboard headers   |
| Arabic Script | `Amiri` (serif)     | 400     | 16–20px   | مَوْلِدُ النَّبِيِّ ﷺ hero line   |
| UI Body       | `Inter` (sans)      | 400/500 | 12–14px   | Labels, descriptions, metadata     |
| Numerals      | `Amiri` (serif)     | 700     | 20–24px   | Stats bar (Arabic numerals ١٢+)    |
| Captions      | `Inter` (sans)      | 400     | 10–11px   | Footer, timestamps, muted info     |

**Google Fonts import (add to `layout.tsx`):**

```tsx
import { Amiri, Inter } from 'next/font/google'

const amiri = Amiri({ subsets: ['arabic', 'latin'], weight: ['400', '700'] })
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'] })
```

### 1.3 Tailwind Config Extension (`tailwind.config.ts`)

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: '#0f3d26',
          800: '#1a5c3a',
          600: '#2d7a52',
          100: '#e8f5ee',
        },
        gold: {
          500: '#c8962a',
          200: '#f0d080',
          50:  '#fdf6e3',
        },
        cream: '#faf7f0',
        'border-warm': '#e8e2d5',
        'text-dark': '#1a2a1e',
      },
      fontFamily: {
        amiri: ['Amiri', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        pill: '100px',
      },
    },
  },
  plugins: [],
}

export default config
```

### 1.4 Signature Design Element

**Islamic Geometric Hexagon Pattern** — SVG-based, rendered as a reusable component. Used as a subtle overlay (`opacity-[0.06]–opacity-[0.08]`) on all dark green hero/card backgrounds. This is the one element that makes MeeladFest visually unmistakable.

```tsx
// src/components/ui/GeometricPattern.tsx
export function GeometricPattern({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <polygon points="130,10 250,75 250,185 130,250 10,185 10,75"
        stroke="white" strokeWidth="1" fill="none" />
      <polygon points="130,40 220,90 220,170 130,220 40,170 40,90"
        stroke="white" strokeWidth="0.5" fill="none" />
      <polygon points="130,70 190,105 190,155 130,190 70,155 70,105"
        stroke="white" strokeWidth="0.5" fill="none" />
      <circle cx="130" cy="130" r="60" stroke="white" strokeWidth="0.5" fill="none" />
      <circle cx="130" cy="130" r="40" stroke="white" strokeWidth="0.5" fill="none" />
    </svg>
  )
}
```

---

## 2. Component Inventory

### 2.1 Shared / Global Components

| Component             | File Path                                | Description                                              |
|-----------------------|------------------------------------------|----------------------------------------------------------|
| `<Navbar />`          | `src/components/layout/Navbar.tsx`       | Dark emerald nav with logo, back link, admin button      |
| `<Footer />`          | `src/components/layout/Footer.tsx`       | Crescent logo, copyright, footer links                   |
| `<GeometricPattern />` | `src/components/ui/GeometricPattern.tsx` | Reusable Islamic hex SVG overlay                         |
| `<LiveBadge />`       | `src/components/ui/LiveBadge.tsx`        | Animated green dot + "Live Now" text                     |
| `<OfficialChip />`    | `src/components/ui/OfficialChip.tsx`     | Gold-tinted "Official Page" chip                         |
| `<SectionTitle />`    | `src/components/ui/SectionTitle.tsx`     | Emerald left-border label + uppercase letter-spacing     |
| `<EmptyState />`      | `src/components/ui/EmptyState.tsx`       | Invitation-style empty state (no "Nothing here yet")     |
| `<LoadingSkeleton />` | `src/components/ui/LoadingSkeleton.tsx`  | Skeleton loaders for leaderboard, gallery, schedule      |

### 2.2 Homepage Components (`src/app/page.tsx`)

| Component           | File Path                                    | Description                                         |
|---------------------|----------------------------------------------|-----------------------------------------------------|
| `<HeroSection />`   | `src/components/home/HeroSection.tsx`        | Dark hero with Arabic script, CTA, geometric SVG    |
| `<StatsBar />`      | `src/components/home/StatsBar.tsx`           | 3-col emerald bar with Arabic numeral stats         |
| `<FestCard />`      | `src/components/home/FestCard.tsx`           | Fest card with dark-green top + meta info + CTA     |
| `<FeatureGrid />`   | `src/components/home/FeatureGrid.tsx`        | 2×2 grid of platform features with emerald icons   |

### 2.3 Fest Detail Components (`src/app/fests/[slug]/page.tsx`)

| Component                | File Path                                         | Description                                               |
|--------------------------|---------------------------------------------------|-----------------------------------------------------------|
| `<FestBanner />`         | `src/components/fest/FestBanner.tsx`              | Emerald hero with fest name, org, meta pills, chips       |
| `<FestTabBar />`         | `src/components/fest/FestTabBar.tsx`              | Sticky tab bar: Leaderboard, Updates, Schedule, Gallery, FAQ |
| `<TeamLeaderboard />`    | `src/components/fest/TeamLeaderboard.tsx`         | Podium + ranked rows with animated progress bars          |
| `<IndividualChampionship />` | `src/components/fest/IndividualChampionship.tsx` | Individual points table with category filter              |
| `<AnnouncementFeed />`   | `src/components/fest/AnnouncementFeed.tsx`        | Real-time announcement cards with timestamps              |
| `<ProgramSchedule />`    | `src/components/fest/ProgramSchedule.tsx`         | Timeline-style event sequence with stage info             |
| `<PhotoGallery />`       | `src/components/fest/PhotoGallery.tsx`            | Masonry Cloudinary image grid                             |
| `<CertificateEngine />`  | `src/components/fest/CertificateEngine.tsx`       | Dark green card with chest-no input + PDF download        |
| `<FaqAccordion />`       | `src/components/fest/FaqAccordion.tsx`            | Collapsible FAQ list                                      |
| `<FeedbackForm />`       | `src/components/fest/FeedbackForm.tsx`            | Star rating + comment form                                |
| `<Podium />`             | `src/components/fest/Podium.tsx`                  | Gold/Silver/Bronze three-column podium display            |
| `<LeaderboardRow />`     | `src/components/fest/LeaderboardRow.tsx`          | Single rank row: avatar, name, progress bar, points       |

### 2.4 Auth Pages

| Page            | File Path                          | Description                                  |
|-----------------|------------------------------------|----------------------------------------------|
| Login           | `src/app/(auth)/login/page.tsx`    | Centered card on cream bg, emerald accents   |
| Register        | `src/app/(auth)/register/page.tsx` | Multi-step madrasa registration form         |

### 2.5 Dashboard Components

| Component               | File Path                                       | Description                                        |
|-------------------------|-------------------------------------------------|----------------------------------------------------|
| `<DashboardSidebar />`  | `src/components/dashboard/Sidebar.tsx`          | Emerald sidebar with icon-nav items                |
| `<DashboardHeader />`   | `src/components/dashboard/Header.tsx`           | Top bar with fest selector + user avatar           |
| `<ParticipantTable />`  | `src/components/dashboard/ParticipantTable.tsx` | Sortable data table with chest-no, name, team      |
| `<ResultEntry />`       | `src/components/dashboard/ResultEntry.tsx`      | Inline result entry form per item                  |
| `<SubAdminManager />`   | `src/components/dashboard/SubAdminManager.tsx`  | Permission toggle grid per sub-admin               |
| `<ActivityLogTable />`  | `src/components/dashboard/ActivityLogTable.tsx` | Timestamped audit log with user + action           |
| `<GalleryUploader />`   | `src/components/dashboard/GalleryUploader.tsx`  | Cloudinary drag-drop upload with preview           |

---

## 3. Page-by-Page Redesign Spec

### 3.1 Homepage (`/`)

**Layout:**
```
┌─────────────────────────────────────┐
│  NAVBAR (dark emerald, sticky)      │
├─────────────────────────────────────┤
│  HERO SECTION                       │
│  · Arabic line (مَوْلِدُ النَّبِيِّ)  │
│  · H1: "Meelad Fest Management"     │
│  · Subtext (14px, muted)            │
│  · Geometric SVG (absolute, 8% op.) │
│  · CTA: Browse Festivals / Login    │
│  · Gold ✦ ✦ ✦ divider              │
├─────────────────────────────────────┤
│  STATS BAR (emerald-800, 3 cols)    │
│  ١٢+ Programs · ٢٤٠+ Participants  │
├─────────────────────────────────────┤
│  ACTIVE FESTIVALS                   │
│  · Section title (left border)      │
│  · FestCard × N (vertical list)     │
├─────────────────────────────────────┤
│  FEATURE GRID (2 × 2)              │
│  Leaderboard · Certs · Perms · Gal  │
├─────────────────────────────────────┤
│  FOOTER                             │
└─────────────────────────────────────┘
```

**Key styling decisions:**
- Hero background: `bg-emerald-950`, geometric SVG at `opacity-[0.07]` (absolute, top-right)
- Stats bar numbers: `font-amiri text-gold-200` (Arabic-numeral string literals)
- FestCard dark top: `bg-gradient-to-br from-emerald-800 to-emerald-600`
- Feature icons: `bg-emerald-100 text-emerald-800`, 34×34px rounded-lg

---

### 3.2 Fest Detail Page (`/fests/[slug]`)

**Layout:**
```
┌─────────────────────────────────────┐
│  NAVBAR (dark, back arrow)          │
├─────────────────────────────────────┤
│  FEST BANNER                        │
│  · Live chip + Official chip        │
│  · H2: Fest name (Amiri)            │
│  · Org name, meta pills             │
│  · Geometric SVG (top-right)        │
├─────────────────────────────────────┤
│  TAB BAR (sticky on scroll)         │
│  Leaderboard · Updates · Schedule   │
│  · Gallery · FAQ                    │
├─────────────────────────────────────┤
│  [TAB CONTENT — conditionally shown]│
│                                     │
│  LEADERBOARD TAB:                   │
│  · Section header + Live 30s badge  │
│  · Podium (2nd | 1st | 3rd)        │
│  · Rows 4–N (rank, avatar, bar, pts)│
│  · Toggle: Teams / Individual       │
│                                     │
│  UPDATES TAB:                       │
│  · Announcement cards (timestamp)   │
│                                     │
│  SCHEDULE TAB:                      │
│  · Timeline with item + time + venue│
│                                     │
│  GALLERY TAB:                       │
│  · Masonry grid (Cloudinary)        │
│                                     │
│  FAQ TAB:                           │
│  · Accordion + Feedback form below  │
├─────────────────────────────────────┤
│  CERTIFICATE ENGINE (always visible)│
│  · Dark emerald card                │
│  · Chest No input + Download PDF    │
├─────────────────────────────────────┤
│  FOOTER                             │
└─────────────────────────────────────┘
```

**Key styling decisions:**
- Banner: `bg-emerald-800`, geometric SVG `opacity-[0.06]`, absolute top-right
- Live chip: `bg-green-900/20 border border-green-400/30 text-green-300`
- Tab bar: `sticky top-0 z-10 bg-white border-b border-border-warm`
- Active tab indicator: `border-b-2 border-emerald-800 text-emerald-800`
- Podium center (1st): slightly taller card + `bg-amber-50 border border-amber-200`
- Progress bars: `bg-emerald-800` fill, `bg-gray-100` track, `h-[5px] rounded-full`
- Certificate engine: `bg-gradient-to-br from-emerald-950 to-emerald-800`

---

### 3.3 Login Page (`/login`)

**Layout:**
```
┌─────────────────────────────────────┐
│  Full-page cream background         │
│                                     │
│         ☽ MeeladFest               │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Admin Login                │    │
│  │  ─────────────────────────  │    │
│  │  Email ________________     │    │
│  │  Password _____________     │    │
│  │                             │    │
│  │  [Sign In ──────────────]   │    │
│  │                             │    │
│  │  Forgot password?           │    │
│  └─────────────────────────────┘    │
│                                     │
│  Don't have a fest? Register →      │
└─────────────────────────────────────┘
```

**Key styling decisions:**
- Card: `bg-white border border-border-warm rounded-card shadow-sm max-w-sm mx-auto`
- Sign In button: `bg-emerald-800 text-white hover:bg-emerald-950`
- Logo above card: `font-amiri text-2xl text-emerald-950 flex items-center gap-2`
- Crescent: rendered as `☽` unicode in emerald color

---

### 3.4 Dashboard (`/dashboard`)

**Layout:**
```
┌──────────┬──────────────────────────┐
│          │  HEADER (fest selector)  │
│ SIDEBAR  ├──────────────────────────┤
│          │                          │
│ · Dash   │  MAIN CONTENT AREA       │
│ · Parts  │  (changes per nav item)  │
│ · Results│                          │
│ · Updates│                          │
│ · Gallery│                          │
│ · Admins │                          │
│ · Logs   │                          │
│          │                          │
│ · Logout │                          │
└──────────┴──────────────────────────┘
```

**Key styling decisions:**
- Sidebar: `bg-emerald-950 text-white w-56 min-h-screen fixed`
- Active nav item: `bg-emerald-800 text-white rounded-lg`
- Inactive nav item: `text-emerald-100/60 hover:bg-emerald-800/40 rounded-lg`
- Header: `bg-white border-b border-border-warm h-14 flex items-center px-6`
- Content area: `bg-cream ml-56 min-h-screen p-6`
- Data tables: `bg-white border border-border-warm rounded-card`
- Table header: `bg-emerald-950 text-white text-xs uppercase tracking-wider`

---

## 4. Reusable UI Primitives (Tailwind class recipes)

### Buttons

```tsx
// Primary CTA
'bg-gold-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium
 hover:bg-[#b07d20] transition-colors'

// Emerald solid
'bg-emerald-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium
 hover:bg-emerald-950 transition-colors'

// Ghost (on dark bg)
'bg-transparent text-white/80 border border-white/25 px-5 py-2.5
 rounded-lg text-sm hover:bg-white/10 transition-colors'

// Emerald light (secondary action)
'bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg text-xs
 font-medium hover:bg-[#d0eddf] transition-colors'
```

### Chips / Badges

```tsx
// Live chip
'inline-flex items-center gap-1.5 bg-green-900/20 border border-green-400/30
 text-green-300 text-[10px] font-medium tracking-widest uppercase
 rounded-full px-2.5 py-1'

// Gold official chip
'bg-gold-500/18 border border-gold-500/35 text-gold-200 text-[10px]
 font-medium tracking-widest uppercase rounded-full px-2.5 py-1'

// Section label
'text-xs font-medium text-text-dark uppercase tracking-[0.07em]
 flex items-center gap-2 before:content-[""] before:inline-block
 before:w-[3px] before:h-[13px] before:bg-emerald-800 before:rounded-sm'
```

### Cards

```tsx
// Fest card wrapper
'bg-white border border-border-warm rounded-card overflow-hidden
 cursor-pointer transition-colors hover:border-emerald-800'

// Fest card dark top
'bg-gradient-to-br from-emerald-800 to-emerald-600
 p-5 relative overflow-hidden'

// Feature card
'bg-white border border-border-warm rounded-[10px] p-4
 flex gap-2.5 items-start'

// Certificate engine card
'bg-gradient-to-br from-emerald-950 to-emerald-800
 rounded-card p-5 relative overflow-hidden'
```

### Podium

```tsx
// 1st place
'bg-gradient-to-b from-amber-50 to-amber-100 border border-amber-200
 rounded-[10px] p-3 text-center'

// 2nd place (slightly lower, mt-4)
'bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200
 rounded-[10px] p-3 text-center mt-4'

// 3rd place (slightly lower, mt-4)
'bg-gradient-to-b from-orange-50 to-orange-100 border border-orange-200
 rounded-[10px] p-3 text-center mt-4'
```

---

## 5. Implementation Phases

### Phase 1 — Design System Setup (Day 1)

- [x] `tailwind.config.ts` — extend colors, fonts, borderRadius
- [x] `src/app/layout.tsx` — Amiri + Inter font imports via `next/font/google`
- [x] `src/app/globals.css` — CSS custom properties for cream background, border-warm
- [x] Create `src/components/ui/` folder with shared primitives:
  - `GeometricPattern.tsx`
  - `LiveBadge.tsx`
  - `SectionTitle.tsx`
  - `LoadingSkeleton.tsx`
  - `EmptyState.tsx`

### Phase 2 — Homepage Redesign (Day 2)

- [x] `HeroSection.tsx` — dark hero with Arabic script, CTA, geometric SVG
- [x] `StatsBar.tsx` — 3-col stats with Arabic numerals
- [x] `FestCard.tsx` — replace existing card with new dark-top design
- [x] `FeatureGrid.tsx` — 2×2 feature grid
- [x] Update `src/app/page.tsx` to compose new components

### Phase 3 — Fest Detail Page (Day 3–4)

- [x] `FestBanner.tsx` — redesign banner with chips, meta pills, SVG
- [x] `FestTabBar.tsx` — new sticky tab bar with icons
- [x] `Podium.tsx` — gold/silver/bronze three-column component
- [x] `LeaderboardRow.tsx` — rank, avatar, name, progress bar, points
- [x] `TeamLeaderboard.tsx` — compose Podium + rows + live header
- [x] `CertificateEngine.tsx` — dark card with input + download CTA
- [x] Update `src/app/fests/[slug]/page.tsx`

### Phase 4 — Auth Pages (Day 5)

- [x] Login page (`/login`) — centered card, emerald button
- [x] Register page (`/register`) — multi-step form with progress indicator

### Phase 5 — Dashboard Redesign (Day 6–7)

- [x] `Sidebar.tsx` — dark emerald fixed sidebar with icon nav
- [x] `DashboardHeader.tsx` — fest selector dropdown + avatar
- [x] Participant table, result entry, sub-admin manager, activity log
- [x] Mobile: sidebar collapses to hamburger menu

### Phase 6 — Polish & QA (Day 8)

- [x] Dark mode audit (all colors use CSS vars or semantic tokens)
- [x] Mobile responsive check (all pages ≥ 375px)
- [x] Lighthouse performance check (image optimization, font preload)
- [x] Accessibility: focus rings, aria-labels on icon buttons, sr-only labels
- [x] `prefers-reduced-motion` — disable animated dot pulse for users who prefer it

---

## 6. File Change Summary

### New files to create

```
src/
├── components/
│   ├── ui/
│   │   ├── GeometricPattern.tsx   ← NEW
│   │   ├── LiveBadge.tsx          ← NEW
│   │   ├── SectionTitle.tsx       ← NEW
│   │   ├── LoadingSkeleton.tsx    ← NEW
│   │   └── EmptyState.tsx         ← NEW
│   ├── home/
│   │   ├── HeroSection.tsx        ← NEW
│   │   ├── StatsBar.tsx           ← NEW
│   │   ├── FestCard.tsx           ← REPLACE
│   │   └── FeatureGrid.tsx        ← NEW
│   ├── fest/
│   │   ├── FestBanner.tsx         ← REPLACE
│   │   ├── FestTabBar.tsx         ← REPLACE
│   │   ├── Podium.tsx             ← NEW
│   │   ├── LeaderboardRow.tsx     ← NEW
│   │   ├── TeamLeaderboard.tsx    ← REPLACE
│   │   └── CertificateEngine.tsx  ← REPLACE
│   └── dashboard/
│       ├── Sidebar.tsx            ← REPLACE
│       └── DashboardHeader.tsx    ← REPLACE
```

### Files to modify

```
tailwind.config.ts         ← extend colors, fonts
src/app/layout.tsx         ← add Amiri + Inter fonts
src/app/globals.css        ← add CSS custom props
src/app/page.tsx           ← compose new home components
src/app/fests/[slug]/page.tsx ← compose new fest components
src/app/(auth)/login/page.tsx ← redesign layout
src/app/dashboard/page.tsx    ← compose new dashboard
```

---

## 7. Quick Reference: Design Decisions Rationale

| Decision                        | Reason                                                                 |
|---------------------------------|------------------------------------------------------------------------|
| Emerald green palette           | Islamic tradition color — madrasa context without being clichéd       |
| Amiri serif for headings        | Arabic-origin typeface, dignified but readable in Malayalam/English    |
| Arabic numerals in stats bar    | Subtle cultural authenticity; numerals are universally readable        |
| Arabic script hero line         | Grounds the page in the مَوْلِدُ النَّبِيِّ ﷺ occasion meaningfully  |
| Islamic hex pattern SVG         | Single signature element; geometric not figurative — fits madrasa UI   |
| Gold CTA buttons                | Warm contrast against emerald; festive without being garish            |
| Cream page background           | Off-white is warmer than #fff; suits the cultural tone                 |
| Podium: 2nd–3rd flanking 1st   | Visual hierarchy mirrors physical podium; standard but clear           |
| Sticky tab bar on fest page     | Long scroll page needs anchor; tabs are the navigation pattern here    |
| Certificate engine always pinned| Most used public feature; should not be buried in a tab               |

---

*Plan prepared for MeeladFest UI Redesign — July 2026*
*Implement phase by phase; commit after each phase with `feat(ui): phase-N redesign`*
