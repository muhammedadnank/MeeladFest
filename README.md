<div align="center">

# 🌙 MeeladFest

### *Multi-Tenant Madrasa Fest Management Platform*

[![Live Demo](https://img.shields.io/badge/Live_Demo-meelad--fest--kerala.vercel.app-0f3d26?style=for-the-badge&logo=vercel&logoColor=white)](https://meelad-fest-kerala.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-gold?style=for-the-badge)](LICENSE)

**A modern, serverless web platform empowering madrasas across Kerala to seamlessly organize, manage, and showcase annual Meelad Fest cultural & arts competitions.**

[Explore Live Demo](https://meelad-fest-kerala.vercel.app/) · [Read Documentation](docs/PRD.md) · [View Release Notes](changelogs/v1.2.0.md)

</div>

---

## 📖 Overview

**MeeladFest** is an enterprise-grade, multi-tenant competition management system specifically tailored for Madrasa Arts & Cultural Festivals (Meelad Fest). Built with **Next.js 16 (App Router)**, **MongoDB Atlas**, and **Tailwind CSS v4**, it provides an elegant **Islamic Modern Design System** featuring gold accents, deep emerald tones, custom Arabic typography (Amiri), and rich micro-interactions.

### 🎨 Visual Theme & Branding (v1.2.0)
- **Colors**: Deep Emerald (`#0f3d26`), Warm Gold (`#c8962a`), Soft Cream (`#faf7f0`), Warm Border (`#e8e2d5`).
- **Typography**: `Amiri` for headlines and Arabic numbers (`١`, `٢`, `٣`), `Inter` for clean tabular data.
- **Components**: Geometric arabesque patterns, podium showcases, live status badges, and official watermark chips.

---

## 🌟 Key Capabilities

### 🎪 Multi-Tenant Festival Engine
- **Instant Festival Onboarding**: Any Madrasa admin or ustad can register and launch a custom festival page with a dedicated URL slug (`/fests/your-fest-slug`).
- **Granular Sub-Admin RBAC**: Assign co-admins with section-specific privileges (`participants`, `results`, `updates`, `gallery`).
- **Audit Trails**: Built-in `activity_log` tracking all administrative actions with IP and timestamp metadata.
- **Soft-Delete Protection**: Safe data deletion safeguards ensure historical scores, teams, and logs are never permanently lost.

### 🏆 Live Leaderboards & Champion Podiums
- **Top 3 Winner Podiums**: Styled 1st (Gold 🥇), 2nd (Silver 🥈), and 3rd (Bronze 🥉) rank highlights for overall teams and individual champions.
- **Category Filtering & Search**: Filter instantly by age categories (*Sub-Junior, Junior, Senior, Super Senior*) or search by chest number and participant name.
- **Real-Time Point Aggregation**: Animated progress bars with 30-second background auto-polling for live festival updates.

### 📜 Self-Service QR & PDF Certificates
- **Instant Certificate Generation**: Powered by `@react-pdf/renderer` with embedded Malayalam typography (`Noto Sans Malayalam`).
- **Self-Service Verification**: Visitors enter their Chest Number or Fest ID on `/verify/[code]` to instantly generate and download official participation and winner certificates.

### 🖼️ Public Gallery, Live Updates & FAQ System
- **Cloudinary Integration**: Cloudinary signed uploads for high-resolution event media galleries.
- **Public Feed & Feedback**: Real-time announcement streams and public inquiry/feedback response management.

---

## 🏗️ System Architecture

```mermaid
graph TD
    A[Public Visitors & Admin Users] -->|HTTPS / WAF| B[Cloudflare Global CDN]
    B --> C[Vercel Serverless Platform Next.js 16 App Router]
    C -->|JWT Auth| D[NextAuth.js]
    C -->|Mongoose ORM| E[(MongoDB Atlas M0)]
    C -->|Signed Uploads| F[Cloudinary Media Storage]
    C -->|Email Gateway| G[Resend API]
    C -->|PDF Engine| H[@react-pdf/renderer]
```

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | React Server Components, Server Actions & Route Handlers |
| **Language** | TypeScript 5 | Strict type checking & API contracts |
| **Styling** | Tailwind CSS v4 | Custom `@theme` tokens, HSL colors & Arabesque geometry |
| **Database** | MongoDB Atlas & Mongoose | Multi-tenant schema design with indexed queries |
| **Authentication**| NextAuth.js | Credentials Provider, JWT session strategy & bcrypt hashing |
| **Media Handling** | Cloudinary API | Signed uploads & auto-optimized image delivery |
| **Certificates** | `@react-pdf/renderer` | Client & server PDF rendering with Malayalam font support |
| **Email Gateway** | Resend API | Sub-admin invitation tokens & transaction notifications |
| **Deployment** | Vercel (Hobby Tier) | Serverless edge deployment with zero server maintenance |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **MongoDB Atlas**: Free M0 Cluster URI
- **Cloudinary Account**: Cloud Name, API Key & Secret
- **Resend API Key**: Free tier credentials

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/muhammedadnank/MeeladFest.git

# Navigate into project directory
cd MeeladFest

# Install dependencies
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/meeladfest?retryWrites=true&w=majority

# Authentication
NEXTAUTH_SECRET=your_super_secret_jwt_key
NEXTAUTH_URL=http://localhost:3000

# Resend Email Gateway
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx

# Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Seed Test Data (Optional)
Populate realistic demo festivals, categories, teams, items, and leaderboard results:
```bash
npm run seed
```

---

## 🌐 Production Deployment Guide (100% Free Stack)

MeeladFest is architected to run on a **100% Zero-Cost (Free-Tier)** serverless stack while delivering production-grade reliability and speed.

| Provider | Free Tier Entitlement | Application Role |
|---|---|---|
| **Vercel** | 100 GB Bandwidth, Serverless Executions | Next.js Hosting & API Serverless Functions |
| **MongoDB Atlas** | 512 MB Storage, Shared RAM | Fest Data, Teams, Results & Audit Logs |
| **Cloudinary** | 25 Credits/Month (~25 GB) | Gallery Storage & Banner Assets |
| **Resend** | 3,000 Emails/Month (100/day) | Admin Invites & Notification Emails |
| **Cloudflare** | Unlimited Bandwidth & WAF | DNS, Free SSL/TLS & DDoS Protection |

---

## 📁 Repository Structure

```
MeeladFest/
├── docs/                    # Architecture Specs & Guides
│   ├── PRD.md               # Product Requirements Document
│   ├── TRD.md               # Technical Requirements Document
│   ├── DB-Schema.md         # MongoDB Collection Schemas & Indexes
│   └── Implementation-Plan.md # Development Milestones
├── changelogs/              # Version Release Notes
│   └── v1.2.0.md            # v1.2.0 Islamic Modern UI Changelog
├── src/
│   ├── app/                 # Next.js App Router (Pages & REST Endpoints)
│   │   ├── (auth)/          # Login & Registration Screens
│   │   ├── api/             # RESTful API Route Handlers
│   │   ├── dashboard/       # Administrative Control Center
│   │   └── fests/[slug]/    # Public Festival Portal Pages
│   ├── components/          # Design System & UI Components
│   │   ├── fest/            # Podium, TabBar, LeaderboardRow, FestBanner
│   │   ├── home/            # HeroSection, StatsBar, FestCard, FeatureGrid
│   │   ├── layout/          # Navbar & Footer
│   │   └── ui/              # GeometricPattern, OfficialChip, LiveBadge
│   ├── lib/                 # Core Helpers (DB, Auth, Permissions, Audit Log)
│   ├── models/              # Mongoose Data Models
│   └── types/               # TypeScript Definitions
```

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
<br />
Crafted with ❤️ for Madrasa Cultural Festivals across Kerala.
</div>
