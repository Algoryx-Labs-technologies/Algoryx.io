# Algoryx API v2

Modular Express API server (TypeScript). This is the greenfield successor to `apps/api`; database and auth layers can be added module-by-module.

## Structure

```
apps/apiv2/
├── src/
│   ├── config/         # env validation
│   ├── controllers/    # HTTP handlers
│   ├── services/       # business logic
│   ├── routes/         # route wiring
│   ├── middleware/     # express middleware
│   ├── utils/          # logger, errors
│   ├── types/          # shared types
│   ├── app.ts          # express app factory
│   └── server.ts       # entry point
├── .env.example
└── package.json
```

## Scripts

From the monorepo root:

```bash
npm install
npm run dev --workspace=@algoryx/apiv2
```

Or from this directory:

```bash
npm run dev
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | API info |
| GET | `/api/v2/health` | Health check |
| POST | `/api/v2/landing-requirements` | Submit landing contact form |
| POST | `/api/v2/landing-chat` | Algoryx Labs AI assistant (Gemini) |
| POST | `/api/v2/support` | Submit support ticket (multipart form) |

Default port: **4001** (v1 API uses 4000).

### Support tickets

`POST /api/v2/support` accepts `multipart/form-data`:

| Field | Required | Notes |
|-------|----------|--------|
| `name` | yes | |
| `email` | yes | |
| `subject` | yes | |
| `category` | yes | `general`, `technical`, `billing`, `feature-request`, `account`, `other` |
| `priority` | yes | `low`, `medium`, `high`, `urgent` |
| `description` | yes | |
| `attachment` | no | PDF, images, plain text, Word, Excel — max 5 MB |

IP address, user agent, and referer are stored automatically in `client`.

Collection: `support_tickets`

### MongoDB

Database name: **Algoryx** (set in `MONGODB_URI`, e.g. `mongodb://127.0.0.1:27017/Algoryx`).

Collection: `landing_requirements`

**Atlas `mongodb+srv://` and `querySrv ECONNREFUSED`:** The URI can be correct; Node still must resolve `_mongodb._tcp.<cluster>.mongodb.net` via DNS SRV. Some routers/VPNs block that while `nslookup` works. Fix options: change Windows DNS to `8.8.8.8` / `1.1.1.1`, use Atlas’s standard (non-SRV) connection string, or add `MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1` in `.env`.
