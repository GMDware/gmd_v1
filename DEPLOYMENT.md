# GMDware v1.0 — Production Deployment Runbook & Checklist

This document details the production launch protocol, pre-flight verification checklist, and operational procedures for deploying **GMDware v1.0** to public infrastructure.

---

## Production Deployment Checklist

Before routing public traffic to the production instance, verify each item:

### Domain & DNS
- [ ] **Production Domain Configured**: Root domain and `www` sub-domain point to server/edge IP.
- [ ] **DNS Records Propagated**: A/AAAA/CNAME records resolved globally.
- [ ] **HTTPS / TLS Enabled**: Valid SSL/TLS certificate installed (Let's Encrypt, Cloudflare, or AWS ACM) with automatic renewal.

### Environment & Secrets
- [ ] **Production Environment Variables Configured**: All variables from `.env.example` set in target host or cloud secret manager.
- [ ] **AUTH_SECRET Generated**: High-entropy secret (min 32 bytes) generated via `openssl rand -base64 32`.
- [ ] **Admin Credentials Configured Securely**: `ADMIN_EMAIL` and `ADMIN_PASSWORD` provisioned via environment or database without hardcoded fallbacks.
- [ ] **Canonical URL Configured**: `NEXT_PUBLIC_SITE_URL` matches the exact production domain (e.g. `https://gmdware.com`).
- [ ] **n8n Webhook Configured (Optional)**: `N8N_WEBHOOK_URL` and `N8N_WEBHOOK_SECRET` set if routing leads to n8n automation.
- [ ] **No Secrets Committed**: Git repository scanned to ensure no `.env` files, private keys, or credentials are tracked.

### Database & State
- [ ] **PostgreSQL Database Connected**: Database reachable and SSL mode enabled (`sslmode=require`).
- [ ] **Prisma Production Migration Completed**: Ran `npx prisma migrate deploy` (zero data loss).
- [ ] **Test / Demo Content Removed**: Seed script sanitized; no `(Demo)` labels or mock client inquiries present in the database.
- [ ] **Initial Database Backup Completed**: Automated periodic snapshot policy active.

### Security & Access Controls
- [ ] **No Development Credentials Displayed**: Verified `/admin/login` renders clean, empty input fields without helper banners.
- [ ] **Security Headers Verified**: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `Permissions-Policy` present on responses.
- [ ] **HSTS Active**: `Strict-Transport-Security` header present with `includeSubDomains; preload`.
- [ ] **CSP Verified**: Content Security Policy blocks untrusted scripts and restricts `connect-src` to `'self' https:`.
- [ ] **Rate Limiting Verified**: Mutating API routes enforce sliding-window rate limiting with `429 Too Many Requests` responses.
- [ ] **CSRF Defense Verified**: Origin/Host validation active on mutating endpoints.
- [ ] **Media Upload Security Verified**: File size, extension, MIME type, magic bytes, path traversal containment, and SVG script rejection verified.

### SEO & Public Verification
- [ ] **robots.txt Verified**: Accessible at `/robots.txt` and explicitly disallows `/admin/`, `/api/`, and `/guide/admin`.
- [ ] **sitemap.xml Verified**: Accessible at `/sitemap.xml` with production domain URLs.
- [ ] **Canonical Tags Verified**: All pages declare canonical URLs matching `https://gmdware.com/...`.
- [ ] **Social Links Synchronized**: Verified links to Instagram, Facebook, TikTok, LinkedIn, GitHub, and email (`gmdware@gmail.com`).

### Quality & Operational Readiness
- [ ] **Production Build Passed**: `npm run build` exits with code 0.
- [ ] **TypeScript Compilation Passed**: `npx tsc --noEmit` exits with code 0.
- [ ] **Automated Test Suites Passed**: All test scripts in `scripts/` pass without regressions.
- [ ] **Contact Form Tested**: Inbound submission persists to PostgreSQL and appears in `/admin/inquiries`.
- [ ] **Custom Error Pages Tested**: Root `not-found.tsx` and `global-error.tsx` operational without leaking internal stack traces.
- [ ] **Responsive Smoke Test Passed**: Layout verified on viewports from 320px to 1920px.

---

## Step-by-Step Deployment Runbook

### Step 1: Provision Environment
Ensure Node.js `v20+` and PostgreSQL `v15+` are installed and running on your host:
```bash
node -v
# v20.x.x
```

### Step 2: Configure Environment Variables
Create your production `.env` (or configure via platform dashboard):
```bash
cp .env.example .env.production
```
Populate required variables:
```env
DATABASE_URL="postgresql://gmdware_user:<SECURE_PASSWORD>@<DB_HOST>:5432/gmdware_prod?schema=public&sslmode=require"
AUTH_SECRET="<GENERATED_HIGH_ENTROPY_KEY>"
ADMIN_EMAIL="admin@gmdware.com"
ADMIN_PASSWORD="<SECURE_ADMIN_PASSWORD>"
NEXT_PUBLIC_SITE_URL="https://gmdware.com"
STORAGE_PROVIDER="local"
STORAGE_LOCAL_PATH="./public/uploads"
STORAGE_PUBLIC_BASE_URL="/uploads"
RATE_LIMIT_MAX_REQUESTS="120"
RATE_LIMIT_WINDOW_MS="60000"
N8N_WEBHOOK_URL="https://n8n.yourdomain.com/webhook/<YOUR_WEBHOOK_PATH>"
N8N_WEBHOOK_SECRET="<SECURE_WEBHOOK_SECRET>"
```

### Step 3: Install Dependencies
Use `npm ci` to guarantee deterministic package installation:
```bash
npm ci --omit=dev
```
*(Note: If building on the host machine, install devDependencies during build, then prune)*:
```bash
npm ci
```

### Step 4: Run Prisma Migration & Client Generation
```bash
npx prisma generate
npx prisma migrate deploy
```
> [!CAUTION]
> **NEVER execute `prisma migrate reset` or `db push --force-reset` on a production database.** Always use `npx prisma migrate deploy`.

### Step 5: Compile Production Bundle
```bash
npm run build
```

### Step 6: Start Process via PM2 / Systemd
```bash
# Using PM2 process manager:
pm2 start npm --name "gmdware-prod" -- start

# Save PM2 state across reboots:
pm2 save
pm2 startup
```

### Step 7: Configure Reverse Proxy (Nginx Example)
```nginx
server {
    server_name gmdware.com www.gmdware.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl http2;
    # SSL certificate directives...
}
```

---

## Architectural Notes: Rate Limiting & Media Storage

### 1. In-Memory Rate Limiting
- **Current Architecture**: The application employs an in-memory sliding window rate limiter (`src/lib/security/rate-limit.ts`).
- **Guarantees**: Protects individual server instances and single-container deployments against abusive bursts and credential stuffing.
- **Limitation**: In horizontal scaling (multi-instance or serverless environments where requests route round-robin across different nodes), memory is isolated per node.
- **Roadmap / Future Upgrade**: For distributed multi-region clustering, replace the in-memory store with a managed Redis cluster (e.g., Upstash Redis or AWS ElastiCache) using the same rate-limiting interface.

### 2. Media Uploads & Ephemeral Filesystems
- In standard single-server deployments (VPS, Bare Metal, EC2), `STORAGE_PROVIDER="local"` persists files to `./public/uploads`.
- Ensure the `./public/uploads` directory has proper read/write permissions for the application user (`chown -R www-data:www-data public/uploads`).
- For serverless or ephemeral container deployments (Vercel, AWS ECS Fargate), set `STORAGE_PROVIDER="s3"` or `"r2"` to direct uploads to cloud object storage.

---

## Post-Deployment Verification (Smoke Test)

Run the following curl commands against your live domain:

```bash
# 1. Verify Public Homepage & Security Headers
curl -I https://gmdware.com/

# 2. Verify robots.txt contains disallow rules
curl -s https://gmdware.com/robots.txt | grep -E "admin|guide"

# 3. Verify sitemap.xml returns valid XML with production domain
curl -s https://gmdware.com/sitemap.xml | head -n 10

# 4. Verify admin login page does NOT reveal credentials
curl -s https://gmdware.com/admin/login | grep -i "GMDware2026"
# (Output must be completely EMPTY)

# 5. Verify unauthorized access to protected admin API is rejected
curl -s -o /dev/null -w "%{http_code}\n" https://gmdware.com/api/v1/dashboard/stats
# (Output must be 401)
```
