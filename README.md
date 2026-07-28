# 🌙 MeeladFest

> **Multi-Tenant Madrasa Fest Management Platform**  
> A modern, serverless Next.js web application empowering madrasas across Kerala to seamlessly organize, manage, and showcase their annual Meelad Fest (Arts & Cultural Competition) with live leaderboards, granular sub-admin access, activity audit logs, FAQ & feedback support, and self-service PDF certificates.
>
> 🚀 **Live Demo:** [meelad-fest-kerala.vercel.app](https://meelad-fest-kerala.vercel.app)

---

## 🌟 Key Features

- 🎪 **Multi-Tenant Fest Hosting**: Any madrasa admin/ustad can register and instantly create a custom fest page with a unique URL slug (`/fests/your-fest-slug`).
- 🔐 **Granular Sub-Admin Permissions**: Fest owners can assign sub-admins with section-based permission controls (`participants`, `results`, `updates`, `gallery`) and full activity auditing.
- 📋 **Data Entry & Chest Number Tracking**: Admin/sub-admin streamlined data entry for single and group items with Chest Number / Fest ID tracking and team capacity validation (`maxParticipantsPerTeam`).
- 🏆 **Live Leaderboard & Championship**:
  - **Top 3 Winner Podiums**: Styled 1st (Gold 🥇), 2nd (Silver 🥈), and 3rd (Bronze 🥉) rank showcases for teams and individual champions.
  - **Category Filtering & Search**: Instant filtering by age categories (Sub-Junior, Junior, Senior, etc.) and chest number/name searches.
  - **Team Leaderboard**: Real-time category-wise and overall team point aggregation with animated progress bars and 30-second live auto-polling.
  - **Individual Championship**: Points tracking per participant across single and group competition items.
- 📜 **Self-Service PDF Certificates**: Fast `@react-pdf/renderer` PDF generation with embedded Malayalam typography (Noto Sans Malayalam). Visitors enter their Chest No to download participation and winner certificates without needing an account.
- 🖼️ **Live Feed & Gallery**: Cloudinary-powered image gallery and real-time announcement feed for public visitors.
- ❓ **FAQ & Feedback System**: Public visitors can view FAQs and submit feedback, while fest admins can add, update, and manage FAQs and review incoming feedback.
- 📝 **Activity Audit Logs**: Detailed audit logging (`activity_log`) tracking administrative operations across all modules for full operational transparency.
- 🛡️ **Soft-Delete Safeguards**: Fest deletion and sub-admin access revocation use soft-deleting—ensuring no historical data or audit logs are permanently lost.

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) & TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | MongoDB Atlas (M0 Free Tier) & Mongoose ORM |
| **Authentication** | NextAuth.js (Credentials Provider, JWT Session Strategy, bcrypt) |
| **Email Service** | Resend API |
| **Image Storage** | Cloudinary (Signed Uploads) |
| **PDF Generation** | `@react-pdf/renderer` (Serverless-friendly) |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm / yarn / pnpm / bun
- MongoDB Atlas Database URI
- Cloudinary Cloud Name, API Key, and API Secret
- Resend API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/muhammedadnank/MeeladFest.git
   cd MeeladFest
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/meeladfest?retryWrites=true&w=majority

   # NextAuth
   NEXTAUTH_SECRET=your_super_secret_jwt_key
   NEXTAUTH_URL=http://localhost:3000

   # Resend (Email Service)
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx

   # Cloudinary (Media Uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **(Optional) Seed Test Data**:
   Populate realistic demo teams, items, participants, and results for local testing:
   ```bash
   npm run seed
   ```

---

## 🌐 Production Deployment Guide (100% Free Stack)

MeeladFest is architected from the ground up to run on a **100% Zero-Cost (Free-Tier)** serverless stack while maintaining production-grade reliability, security, and performance.

### 💰 Free-Tier Infrastructure Breakdown

| Layer | Provider | Free Tier Entitlement | Usage in MeeladFest |
|---|---|---|---|
| **App Hosting** | **Vercel** (Hobby) | 100 GB Bandwidth, Serverless Functions | Next.js App Router & Serverless API Routes |
| **Database** | **MongoDB Atlas** (M0) | 512 MB Storage, Shared RAM | All Fest Collections, Teams, Scores & Audit Logs |
| **Media & Images** | **Cloudinary** (Free) | 25 Credits/Month (~25 GB) | Festival Gallery Images & Image Uploads |
| **Email Gateway** | **Resend** (Free) | 3,000 Emails/Month (100/day) | Sub-Admin Invitations & Admin Alerts |
| **Security & CDN** | **Cloudflare** (Free) | Unlimited Bandwidth & WAF | DNS, Free SSL/TLS, & Global DDoS Protection |

---

### 🚀 Deploying to Vercel (Step-by-Step)

1. **Push your code to GitHub**:
   Ensure your latest code is pushed to your GitHub repository:
   ```bash
   git push origin main
   ```

2. **Import Project into Vercel**:
   - Log in to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New" -> "Project"**.
   - Select your `MeeladFest` GitHub repository.

3. **Configure Environment Variables**:
   In the **Environment Variables** section on Vercel, add:
   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/meeladfest?retryWrites=true&w=majority
   NEXTAUTH_SECRET=your_generated_secure_jwt_secret
   NEXTAUTH_URL=https://your-app-name.vercel.app
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Deploy**:
   Click **Deploy**. Vercel will automatically build and deploy your dynamic Next.js 14 web application within 1-2 minutes!

---

### 🛡️ Setting Up Cloudflare (DNS, Free SSL & DDoS Protection)

To connect a custom domain (e.g., `meeladfest.org` or your madrasa domain) with enterprise-grade security for free:

1. **Add Domain to Cloudflare**:
   - Log in to your free [Cloudflare Dashboard](https://dash.cloudflare.com/) and click **Add a Site**.
   - Enter your custom domain name and select the **Free Plan**.

2. **Update Nameservers**:
   - Update your domain registrar's nameservers to Cloudflare's provided nameservers.

3. **Link Cloudflare DNS to Vercel**:
   - In Cloudflare DNS management, add a **CNAME** record pointing `@` or `www` to `cname.vercel-dns.com`.
   - Ensure the Proxy status is toggled to **Proxied (Orange Cloud)** to enable Cloudflare's free DDoS protection and global CDN.

---

## 📁 Project Structure

```
MeeladFest/
├── docs/                    # Core Documentation & Architecture Specs
│   ├── PRD.md               # Product Requirements Document
│   ├── TRD.md               # Technical Requirements Document
│   ├── DB-Schema.md         # MongoDB Schema & Indexing Specifications
│   └── Implementation-Plan.md # Phased Development Execution Plan
├── CHANGELOG.md             # Main Changelog Index
├── changelogs/              # Version Release Notes
├── public/                  # Static Public Assets
└── src/
    ├── app/                 # Next.js 14 App Router Pages & API Endpoints
    │   ├── (auth)/          # Authentication Pages (Login & Register)
    │   ├── api/             # REST API Routes (fests, faqs, feedback, activity-logs, subadmins, etc.)
    │   └── dashboard/       # Administrative Control Center
    ├── components/          # Reusable UI Components & Providers
    ├── lib/                 # Core Helpers (DB, Auth, Permissions, Activity Logging)
    ├── models/              # Mongoose Data Models
    └── types/               # TypeScript Type Definitions
```

---

## 📖 Documentation & Architecture

- 📄 [Product Requirements Document (PRD)](docs/PRD.md)
- ⚙️ [Technical Requirements Document (TRD)](docs/TRD.md)
- 🗄️ [Database Schema & Indexing Specifications](docs/DB-Schema.md)
- 🗺️ [Implementation Plan](docs/Implementation-Plan.md)
- 📜 [Changelog Index](CHANGELOG.md)

---

## 📜 License

This project is open-source under the MIT License.
