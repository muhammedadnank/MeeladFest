# 🌙 MeeladFest

> **Multi-Tenant Madrasa Fest Management Platform**  
> A modern, serverless Next.js web application empowering madrasas across Kerala to seamlessly organize, manage, and showcase their annual Meelad Fest (Arts & Cultural Competition) with live leaderboards, granular sub-admin access, activity audit logs, FAQ & feedback support, and self-service PDF certificates.

---

## 🌟 Key Features

- 🎪 **Multi-Tenant Fest Hosting**: Any madrasa admin/ustad can register and instantly create a custom fest page with a unique URL slug (`/fests/your-fest-slug`).
- 🔐 **Granular Sub-Admin Permissions**: Fest owners can assign sub-admins with section-based permission controls (`participants`, `results`, `updates`, `gallery`) and full activity auditing.
- 📋 **Data Entry & Chest Number Tracking**: Admin/sub-admin streamlined data entry for single and group items with Chest Number / Fest ID tracking and team capacity validation (`maxParticipantsPerTeam`).
- 🏆 **Live Leaderboard & Championship**:
  - **Team Leaderboard**: Real-time category-wise and overall team point aggregation with standard tie handling.
  - **Individual Championship**: Individual competition points tracking per participant.
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

---

## 📁 Project Structure

```
MeeladFest/
├── PRD.md                   # Product Requirements Document
├── TRD.md                   # Technical Requirements Document
├── DB-Schema.md             # MongoDB Schema & Indexing Specifications
├── Implementation-Plan.md  # Phased Development Execution Plan
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

- 📄 [Product Requirements Document (PRD)](PRD.md)
- ⚙️ [Technical Requirements Document (TRD)](TRD.md)
- 🗄️ [Database Schema & Indexing Specifications](DB-Schema.md)
- 🗺️ [Implementation Plan](Implementation-Plan.md)
- 📜 [Changelog Index](CHANGELOG.md)

---

## 📜 License

This project is open-source under the MIT License.
