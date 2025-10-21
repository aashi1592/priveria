# Installation Guide

This guide provides detailed instructions for installing and setting up the DPIA Platform.

## Table of Contents

- [System Requirements](#system-requirements)
- [Quick Install](#quick-install)
- [Detailed Setup](#detailed-setup)
- [Lovable Cloud Setup](#lovable-cloud-setup)
- [Self-Hosted Supabase Setup](#self-hosted-supabase-setup)
- [Docker Installation](#docker-installation)
- [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements

- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher (or yarn 1.22+)
- **Git**: 2.30 or higher
- **RAM**: 4GB minimum
- **Disk Space**: 1GB available

### Recommended for Development

- **Node.js**: 20.x LTS
- **RAM**: 8GB or more
- **VS Code** with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

---

## Quick Install

For users who want to get started quickly:

```bash
# 1. Clone the repository
git clone https://github.com/yourorg/dpia-platform.git
cd dpia-platform

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Set up Lovable Cloud (recommended)
# - Visit https://lovable.dev
# - Create account and enable Cloud
# - Your .env is auto-configured!

# 5. Start development server
npm run dev

# Visit http://localhost:8080
```

---

## Detailed Setup

### Step 1: Clone Repository

```bash
# Clone via HTTPS
git clone https://github.com/yourorg/dpia-platform.git

# OR clone via SSH (if configured)
git clone git@github.com:yourorg/dpia-platform.git

# Navigate to project directory
cd dpia-platform
```

### Step 2: Install Dependencies

```bash
# Using npm (recommended)
npm install

# OR using yarn
yarn install

# OR using pnpm
pnpm install
```

**Expected output:**
```
added 1234 packages, and audited 1235 packages in 1m
```

### Step 3: Environment Configuration

```bash
# Copy the environment template
cp .env.example .env
```

Open `.env` and configure:

```bash
# ============================================
# Backend Configuration (Choose ONE option)
# ============================================

# OPTION A: Lovable Cloud (Recommended - Auto-configured)
# No manual setup needed - handled automatically

# OPTION B: Self-Hosted Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key

# ============================================
# Enterprise License (Optional)
# ============================================
VITE_LICENSE_KEY=your_enterprise_license_key

# ============================================
# AI Features (Optional)
# ============================================
LOVABLE_API_KEY=your_lovable_ai_key
```

---

## Lovable Cloud Setup

**Lovable Cloud is the recommended backend option** - zero configuration required!

### Benefits

- ✅ **Zero Setup**: No manual database configuration
- ✅ **Auto-Configured**: Environment variables handled automatically
- ✅ **Free Tier**: Generous free usage included
- ✅ **Integrated**: Seamless deployment and hosting

### Setup Steps

1. **Create Lovable Account**
   ```
   Visit: https://lovable.dev
   Sign up with GitHub or email
   ```

2. **Create New Project**
   ```
   Click "New Project"
   Choose "Import from GitHub"
   Select your fork/clone
   ```

3. **Enable Lovable Cloud**
   ```
   In project settings: Enable Cloud
   Wait 30 seconds for provisioning
   ✅ Done! Your .env is auto-configured
   ```

4. **Verify Connection**
   ```bash
   npm run dev
   # Visit http://localhost:8080
   # Try creating an account
   ```

### Lovable Cloud Features

- **Database**: PostgreSQL with automatic migrations
- **Authentication**: Email/password, Google, GitHub
- **Storage**: File uploads and management
- **Edge Functions**: Serverless API endpoints
- **Secrets**: Secure environment variable management

---

## Self-Hosted Supabase Setup

For users who want full control or on-premise deployment:

### Step 1: Create Supabase Project

1. Visit [supabase.com](https://supabase.com)
2. Sign up / log in
3. Click "New Project"
4. Choose:
   - **Project name**: `dpia-platform`
   - **Database password**: (secure password)
   - **Region**: (closest to you)

### Step 2: Get Credentials

1. Go to Project Settings → API
2. Copy:
   - **Project URL**: `https://xxx.supabase.co`
   - **Anon public key**: `eyJhbGc...`

3. Update `.env`:
   ```bash
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
   ```

### Step 3: Run Database Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
npm run db:migrate
```

**Expected output:**
```
✅ Created table: profiles
✅ Created table: user_roles
✅ Created table: assessments
✅ Created table: vendors
✅ Created table: enterprise_licenses
✅ Applied RLS policies
```

### Step 4: Configure Authentication

1. Go to Authentication → Settings
2. Enable providers:
   - ✅ Email/Password
   - ✅ Google (optional)
   - ✅ GitHub (optional)

3. Set redirect URLs:
   ```
   Site URL: http://localhost:8080
   Redirect URLs:
   - http://localhost:8080
   - http://localhost:8080/auth/callback
   ```

---

## Docker Installation

For containerized deployment:

### Prerequisites

- Docker 24.0+
- Docker Compose 2.20+

### Quick Start

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Docker Compose Configuration

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}
    volumes:
      - ./src:/app/src
    depends_on:
      - db

  db:
    image: supabase/postgres:15
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]
```

---

## Verification

After installation, verify everything works:

### 1. Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in 200 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

### 2. Database Connection

Visit `http://localhost:8080` and:
1. Click "Sign Up"
2. Create test account
3. Verify dashboard loads

### 3. Build Test

```bash
npm run build
```

**Expected output:**
```
✓ built in 5s
✓ 234 modules transformed
```

---

## Troubleshooting

### Common Issues

#### Port 8080 Already in Use

```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or use different port
npm run dev -- --port 3000
```

#### Database Connection Error

```
Error: Failed to connect to database
```

**Solution:**
1. Verify `.env` credentials
2. Check Supabase project status
3. Ensure network connectivity
4. Try regenerating API keys

#### Build Errors

```
Error: Cannot find module '@/components/...'
```

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
npm run clean
npm run build
```

#### TypeScript Errors

```
Type error: Property 'x' does not exist
```

**Solution:**
```bash
# Regenerate types from database
npm run db:types

# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

---

## Next Steps

After successful installation:

1. **[Configuration Guide](CONFIGURATION.md)** - Configure features and integrations
2. **[API Reference](API_REFERENCE.md)** - Learn the API
3. **[Architecture Guide](ARCHITECTURE.md)** - Understand the system
4. **[Contributing Guide](../CONTRIBUTING.md)** - Start contributing

---

## Getting Help

- **GitHub Issues**: [Report bugs](https://github.com/yourorg/dpia-platform/issues)
- **Discord**: [Join community](https://discord.gg/dpia-platform)
- **Email**: support@yourcompany.com

---

**Installation complete! 🎉**
