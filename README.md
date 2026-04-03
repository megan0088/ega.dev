# Muhamad Ega Nugraha — Portfolio

> Personal portfolio website with a fullstack admin dashboard to manage experience and projects dynamically — no code editing required.

**Live:** [portofolio-ega-zeta.vercel.app](https://portofolio-ega-zeta.vercel.app)

---

## About

This is my personal portfolio built from scratch using modern web technologies. It features a public-facing portfolio site and a protected admin dashboard where I can add, edit, or delete my experience and projects directly from the browser — without touching the code.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Email + Google OAuth) |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Notifications | react-hot-toast |
| Deployment | Vercel |

---

## Features

### Public Portfolio
- **Hero** — Introduction, tech badges, social links
- **About** — Skills breakdown by category
- **Experience** — Dynamic timeline pulled from database (work, education, competition)
- **Projects** — Project cards with tech stack, GitHub & live demo links
- **Contact** — Contact info with direct links

### Admin Dashboard (`/admin`)
- Protected route — login required
- Google OAuth + Email/Password login
- Full CRUD for **Experience** (add, edit, delete)
- Full CRUD for **Projects** (add, edit, delete, featured toggle)
- Modal forms with validation
- Toast notifications for every action
- Real-time optimistic UI updates

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx               # Public portfolio (server component)
│   ├── admin/
│   │   ├── page.tsx           # Admin dashboard
│   │   └── login/page.tsx     # Login page
│   └── auth/callback/         # OAuth callback handler
├── components/
│   ├── sections/              # Portfolio sections (Hero, About, etc.)
│   ├── admin/                 # Admin UI (tables, forms)
│   └── ui/                    # Shared components (Button, Modal, Input...)
├── lib/
│   ├── supabase/              # Supabase client (browser, server, middleware)
│   ├── api/                   # CRUD functions (experiences, projects)
│   ├── validations.ts         # Zod schemas
│   └── utils.ts               # Helper functions
├── hooks/                     # useExperiences, useProjects
├── types/                     # TypeScript interfaces
└── proxy.ts                   # Route protection for /admin
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/eganugraha08/portfolio-ega.git
cd portfolio-ega
npm install
```

### 2. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste the contents of [`supabase-schema.sql`](./supabase-schema.sql) → click **Run**
3. Go to **Authentication → Users → Add user** → create your admin account

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in your values from **Supabase → Project Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — portfolio is live.
Open [http://localhost:3000/admin](http://localhost:3000/admin) — admin dashboard.

---

## Deploy to Vercel

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Add the same environment variables in Vercel project settings
4. Click **Deploy**

Vercel auto-detects Next.js — no extra config needed.

---

## Google OAuth Setup (Optional)

To enable "Continue with Google" on the login page:

1. Go to [Google Cloud Console](https://console.cloud.google.com) → **Credentials → Create OAuth Client ID**
2. Add authorized redirect URI:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
3. Copy **Client ID** and **Client Secret**
4. In Supabase → **Authentication → Providers → Google** → paste credentials → Save

---

## Contact

**Muhamad Ega Nugraha**
- Email: [eganeue@gmail.com](mailto:eganeue@gmail.com)
- LinkedIn: [linkedin.com/in/ega-nugraha](https://linkedin.com/in/ega-nugraha)
- Instagram: [@eganugraha08](https://instagram.com/eganugraha08)
- Phone: +62 812-9314-8932

---

© 2025 Muhamad Ega Nugraha. Built with Next.js & Supabase.
