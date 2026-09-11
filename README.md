# GMDware — Version 1.0

> High-performance digital flagship, bespoke enterprise software showcase, and integrated content management platform.

---

## Overview

GMDware is an enterprise-grade web application engineered from first principles to represent the modern software craftsmanship, systems architecture, and high-throughput solutions developed by GMDware.

The platform provides a dual-surface architecture:
1. **Public Digital Flagship**: An immersive, GPU-accelerated client experience featuring cinematic design tokens, interactive architectural system visualizations, proof metrics, case studies, service breakdowns, engineering insights, and client inquiry intake.
2. **Administrative Command Center (`/admin`)**: A cryptographically secured CMS and operational hub empowering authorized personnel to manage portfolio case studies, services, team members, proof metrics, media assets, social links, SEO tags, and inbound client inquiries with real-time audit logging.

---

## Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components, Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design system tokens & glassmorphism
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: Cryptographic JWT sessions via [`jose`](https://github.com/panva/jose) with `HttpOnly`, `SameSite=Strict`, `Secure` cookies and role-based access control (RBAC)
- **Password Security**: [bcryptjs](https://github.com/dcodeIO/bcrypt.js) salt factor 12 with constant-time verification
- **Animations & Graphics**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://greensock.com/), and [Three.js](https://threejs.org/)
- **Validation**: [Zod](https://zod.dev/) runtime schema validation on all API endpoints and intake forms
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) automated metadata extraction and blur placeholder generation

---

## Architecture

```
                                  [ HTTPS Traffic ]
                                          │
                                          ▼
                                   [ middleware.ts ]
                         ┌────────────────┴────────────────┐
                         ▼                                 ▼
               [ Public Web Engine ]              [ Admin API & Guard ]
              (SSR / RSC / Streaming)            (RBAC / JWT / Audit)
                         │                                 │
                         ▼                                 ▼
               [ Dynamic DataStore ]             [ Application Services ]
            (PostgreSQL / Seed Fallback)        (Auth, Contact, Media, CMS)
                         │                                 │
                         └────────────────┬────────────────┘
                                          ▼
                                   [ Prisma ORM ]
                                          ▼
                                [ PostgreSQL Database ]
```

- **Fault-Tolerant DataStore**: Seamlessly queries PostgreSQL via Prisma when online, falling back to cached baseline seed data if the database is undergoing maintenance, preventing catastrophic downtime.
- **Defense-in-Depth Middleware**: Enforces origin-based CSRF protection on mutating methods (`POST`, `PUT`, `DELETE`, `PATCH`), global sliding-window rate limiting, session authentication for `/admin/*`, and strict security headers (`CSP`, `HSTS`, `X-Frame-Options: DENY`, `nosniff`).
- **Granular RBAC**: Role-based permissions (`Administrator`, `Editor`, `Viewer`) enforced server-side on all admin endpoints.

---

## Requirements

- **Node.js**: `v20.x` or higher (LTS recommended)
- **Package Manager**: `npm` (v10+), `pnpm` (v9+), or `yarn` (v1.22+)
- **Database**: PostgreSQL `v15` or `v16`
- **Memory**: Minimum 1GB RAM (2GB+ recommended for production builds)

---

## Environment Variables

Copy `.env.example` to `.env.production` and configure the following variables:

### Server-Only (Confidential)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/gmdware?schema=public` |
| `AUTH_SECRET` | 32+ character entropy string for JWT signing | `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Initial production administrator email | `admin@yourdomain.com` |
| `ADMIN_PASSWORD` | Initial production administrator password | High-entropy random password |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `STORAGE_PROVIDER` | Media storage provider (`local`, `s3`, `r2`) | `local` |
| `STORAGE_LOCAL_PATH` | Filesystem upload directory | `./public/uploads` |
| `STORAGE_PUBLIC_BASE_URL` | Public prefix for media files | `/uploads` |
| `RATE_LIMIT_MAX_REQUESTS` | Maximum requests per sliding window | `120` |
| `RATE_LIMIT_WINDOW_MS` | Sliding window duration in milliseconds | `60000` |

### Public (Safe for Client Bundles)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Canonical domain for SEO and metadataBase | `https://gmdware.com` |
| `NEXT_PUBLIC_SITE_NAME` | Corporate brand name | `GMDware` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default locale | `en` |

---

## Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/GMDware/GMDware.git
   cd GMDware
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your local settings
   ```

4. **Start the local database (optional Docker Compose)**:
   ```bash
   docker compose up -d postgres
   ```

5. **Run Prisma migrations**:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Setup

1. **Deploy Migrations (Non-Destructive)**:
   ```bash
   npx prisma migrate deploy
   ```
   > **Note**: Never use `prisma migrate reset` or `db push --force-reset` in production environments as they are destructive.

2. **Seed Initial Production Baseline (Optional initial run)**:
   ```bash
   npx prisma db seed
   ```

3. **Inspect Database (Prisma Studio)**:
   ```bash
   npx prisma studio
   ```

---

## Production Build

To compile and validate the production bundle:

```bash
# 1. Validate TypeScript strict types
npx tsc --noEmit

# 2. Build production Next.js bundle
npm run build

# 3. Start production server
npm run start
```

---

## Deployment

Refer to [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the complete 25+ point pre-launch checklist and platform runbooks (Vercel, AWS, Docker, PM2).

### Standard Production Launch Sequence

```bash
# 1. Install locked dependencies
npm ci

# 2. Generate Prisma client
npx prisma generate

# 3. Deploy non-destructive database migrations
npx prisma migrate deploy

# 4. Build optimized Next.js application
npm run build

# 5. Start with process manager (e.g. PM2 or Systemd)
NODE_ENV=production pm2 start npm --name "gmdware" -- start
```

---

## Admin Access

The administrative command center is accessible at `/admin`.

> [!IMPORTANT]
> The production administrator credentials must be provisioned securely through the configured authentication mechanism.
> Actual administrator credentials must **never** appear in the source code, repository commits, or public documentation.

To access the administrative dashboard:
1. Navigate to `https://yourdomain.com/admin/login`.
2. Input the provisioned `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
3. Upon successful cryptographic verification, an `HttpOnly`, `SameSite=Strict`, `Secure` session cookie (`gmdware_admin_session`) is assigned.

---

## Security Notes

- **Zero Credential Exposure**: Form inputs on `/admin/login` initialize to empty strings; no demo or development helper credentials are displayed in production.
- **Strict Content Security Policy (CSP)**: In production, `connect-src` is restricted strictly to `'self' https:`, eliminating unneeded local development bindings.
- **Path Traversal & SVG XSS Prevention**: File uploads validate file size, extensions, magic-byte signatures, path containment (`path.resolve`), and inspect SVG payloads for embedded `<script>`, `<foreignObject>`, and event handlers.
- **Origin-Based CSRF Protection**: All mutating API requests (`POST`, `PUT`, `DELETE`, `PATCH`) enforce strict host and origin consistency checks.
- **Robots Disallow**: Administrative (`/admin/*`), internal API (`/api/*`), and administrative guides (`/guide/admin`) are barred from indexing via `robots.txt` and `noindex` headers.

---

## Testing

Run the automated verification and regression test suites:

```bash
# Security hardening tests (CSP, CSRF, Rate Limiting, SQL Injection, XSS)
npx tsx scripts/test-phase7-hardening.ts

# Quality assurance and permission regression tests
npx tsx scripts/test-phase8-qa.ts

# Social links, guide metadata, and SEO tests
npx tsx scripts/test-phase9-guide-socials.ts

# Public route presentation tests
npx tsx scripts/test-phase4-public.ts

# Contact submission & inquiry persistence tests
npx tsx scripts/test-contact-inquiries.ts
```

---

## Project Structure

```
GMDware/
├── prisma/                 # Database schema and seeding scripts
│   ├── schema.prisma       # Prisma data models and enums
│   └── seed.ts             # Baseline Version 1.0 database seed
├── public/                 # Static public assets (icons, logos, uploads)
├── scripts/                # Automated verification and regression test suites
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (admin)/        # Protected administrative routes (/admin/*)
│   │   ├── (public)/       # Public web pages (/, /work, /services, /about, /process, /insights, /contact, /guide)
│   │   ├── api/            # Serverless REST API endpoints
│   │   ├── globals.css     # Global CSS and design tokens
│   │   ├── layout.tsx      # Root HTML layout with fonts and metadataBase
│   │   ├── not-found.tsx   # Custom 404 page
│   │   ├── global-error.tsx# Custom root error boundary
│   │   ├── robots.ts       # Dynamic robots.txt generation
│   │   └── sitemap.ts      # Dynamic sitemap.xml generation
│   ├── components/         # Reusable UI and layout components
│   │   ├── admin/          # CMS management cards, forms, tables
│   │   ├── public/         # Landing hero, metrics, navigation, footer, canvas
│   │   └── ui/             # Core primitives (Button, Input, Card, Badge)
│   ├── lib/                # Shared utilities, security, database, and auth
│   │   ├── api/            # Guards, standardized response helpers
│   │   ├── auth/           # JWT signing/verification, session cookies
│   │   ├── db/             # Prisma client, DataStore fallback engine
│   │   ├── media/          # Local & cloud storage providers
│   │   └── security/       # Sliding-window rate limiter
│   ├── services/           # Domain business logic (Auth, Contact, Media, CMS)
│   └── types/              # TypeScript interfaces and schema models
├── .env.example            # Environment variables contract template
├── DEPLOYMENT.md           # Production pre-flight checklist and runbook
├── next.config.ts          # Next.js production configuration & security headers
└── tsconfig.json           # Strict TypeScript configuration
```
