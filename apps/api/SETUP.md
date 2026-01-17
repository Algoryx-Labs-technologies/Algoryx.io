# Setup Guide

## How Prisma + Supabase PostgreSQL Works

**Yes, this setup works perfectly!** Here's how:

### Architecture Overview

1. **Prisma ORM** → Connects to **Supabase PostgreSQL** database using the connection string
2. **Supabase Client** → Used for **Supabase Auth** (authentication)

These are **two separate things**:
- **Database operations** (CRUD) → Use **Prisma** with Supabase's PostgreSQL URL
- **Authentication** (login, signup, JWT) → Use **Supabase Auth** via Supabase client

## Environment Variables Setup

### Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** → `SUPABASE_ANON_KEY`
   - **service_role key** (optional, for admin operations) → `SUPABASE_SERVICE_ROLE_KEY`

4. Navigate to **Settings** → **Database**
5. Copy the **Connection string** → This is your `DATABASE_URL`

### Step 2: Configure Your .env File

Create a `.env` file in `apps/api/` with:

```env
# Server Configuration
NODE_ENV=development
PORT=3001
API_VERSION=v1

# Supabase Configuration (for Authentication)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database (Supabase PostgreSQL Connection Strings)
# Connection pooling - for regular queries (recommended for production)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection - for migrations (required)
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# JWT Configuration (optional, if using custom JWT)
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Important Notes:

1. **DATABASE_URL**: Connection pooling URL (port 6543) - Used for regular queries
   - Format: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true`
   - Better performance and handles more concurrent connections
   - Recommended for production

2. **DIRECT_URL**: Direct connection URL (port 5432) - Used for migrations
   - Format: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres`
   - Required for Prisma migrations (migrations don't work through connection pooler)
   - Can also use: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

3. **SUPABASE_URL & SUPABASE_ANON_KEY**: Used for Supabase Auth (authentication)

4. **SUPABASE_SERVICE_ROLE_KEY**: Optional, for admin operations that bypass RLS (Row Level Security)

## How It Works Together

```
┌─────────────────────────────────────────┐
│         Your API Server                 │
├─────────────────────────────────────────┤
│                                         │
│  Prisma Client                          │
│  └─> Connects to Supabase PostgreSQL   │
│      (via DATABASE_URL)                 │
│      • CRUD operations                 │
│      • Database queries                 │
│                                         │
│  Supabase Client                        │
│  └─> Connects to Supabase Auth          │
│      (via SUPABASE_URL + KEY)          │
│      • User authentication             │
│      • JWT token validation            │
│      • User management                 │
└─────────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────────┐  ┌──────────────────┐
│ Supabase        │  │ Supabase Auth    │
│ PostgreSQL DB   │  │ Service          │
└─────────────────┘  └──────────────────┘
```

## Initial Setup Steps

1. **Install dependencies**:
   ```bash
   cd apps/api
   npm install
   ```

2. **Set up environment variables**:
   - Copy the example above and fill in your Supabase credentials

3. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```
   This reads your `schema.prisma` and generates the Prisma Client that connects to your Supabase PostgreSQL database.

4. **Run your first migration**:
   ```bash
   npm run prisma:migrate
   ```
   This will create the tables in your Supabase database based on your Prisma schema.

5. **Start the server**:
   ```bash
   npm run dev
   ```

## Example: How They Work Together

When a user makes an authenticated request:

1. **Request comes in** with `Authorization: Bearer <supabase-jwt-token>`
2. **Auth middleware** uses Supabase client to validate the JWT token
3. **Controller** receives the authenticated user info
4. **Service** uses Prisma to query/update data in Supabase PostgreSQL
5. **Response** is sent back

```typescript
// Example: Getting user profile
// 1. Supabase Auth validates the token
const user = await supabase.auth.getUser(token);

// 2. Prisma queries the database
const userData = await prisma.user.findUnique({
  where: { email: user.email }
});
```

## Troubleshooting

### Connection Issues

- **Prisma can't connect**: Check your `DATABASE_URL` format
- **Supabase Auth fails**: Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- **SSL required**: Add `?sslmode=require` to your DATABASE_URL if needed

### Common DATABASE_URL Formats

```env
# Direct connection
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres

# With SSL
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?sslmode=require

# Connection pooler (recommended)
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

This setup is **production-ready** and follows best practices! ✅

