# Algoryx API Server

A modular Node.js backend server using Express, Prisma ORM, and Supabase.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## Project Structure

```
apps/api/
├── prisma/
│   ├── schema.prisma      # Prisma schema definition
│   └── seed.ts            # Database seeding script
├── src/
│   ├── config/            # Configuration files
│   │   ├── database.ts    # Prisma client setup
│   │   ├── supabase.ts    # Supabase client setup
│   │   └── env.ts         # Environment validation
│   ├── controllers/       # Request handlers
│   │   └── user.controller.ts
│   ├── services/          # Business logic
│   │   └── user.service.ts
│   ├── routes/            # Route definitions
│   │   ├── index.ts
│   │   └── user.routes.ts
│   ├── middleware/        # Express middleware
│   │   ├── auth.ts        # Authentication middleware
│   │   ├── errorHandler.ts
│   │   ├── notFound.ts
│   │   ├── rateLimiter.ts
│   │   └── validate.ts    # Request validation
│   ├── utils/             # Utility functions
│   │   ├── errors.ts      # Error handling
│   │   └── logger.ts      # Logging utilities
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── app.ts             # Express app setup
│   └── server.ts          # Server entry point
├── .env.example           # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials and database URL.

3. **Set up Prisma**:
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   
   # (Optional) Seed database
   npm run prisma:seed
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed the database
- `npm run lint` - Run ESLint
- `npm run type-check` - Type check without building

## API Structure

### Base URL
```
http://localhost:4000/api/v1
```

### Endpoints

- `GET /health` - Health check
- `GET /users/profile` - Get user profile (authenticated)
- `PATCH /users/profile` - Update user profile (authenticated)

## Adding New Features

### 1. Create a new model in Prisma
Edit `prisma/schema.prisma` and add your model.

### 2. Create a service
Create a new file in `src/services/` (e.g., `post.service.ts`) with business logic.

### 3. Create a controller
Create a new file in `src/controllers/` (e.g., `post.controller.ts`) to handle requests.

### 4. Create routes
Create a new file in `src/routes/` (e.g., `post.routes.ts`) and add it to `src/routes/index.ts`.

### 5. Run migrations
```bash
npm run prisma:migrate
```

## Authentication

The API uses Supabase Auth. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

Errors are automatically handled by the error middleware. Custom errors can be thrown using the `AppError` class:

```typescript
throw new AppError(404, 'Resource not found');
```

## Validation

Request validation is done using Zod schemas in the route definitions:

```typescript
const schema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

router.post('/endpoint', validate(schema), controller.handler);
```

