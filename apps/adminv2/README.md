# Admin v2

React + Vite admin frontend skeleton, aligned with `apps/admin`.

## Setup

```bash
cp .env.example .env
# Points at apiv2 (default http://localhost:4001)
```

Configure admin credentials in `apps/apiv2/.env` (`ADMIN_ID`, `ADMIN_PASSWORD`, `ADMIN_MPIN`).

From the monorepo root:

```bash
npm install
npm run dev --workspace=@algoryx/adminv2
```

Dev server: [http://localhost:5175](http://localhost:5175)

## Structure

- `src/app/App.tsx` — routes (auth + dashboard + placeholder pages)
- `src/app/components/AppLayout.tsx` — sidebar shell shared by pages
- `src/app/components/PlaceholderPage.tsx` — stub for unimplemented sections
- `src/app/contexts/` — theme, sidebar, auth (JWT via apiv2)
- `src/lib/` — API client, auth storage, utilities

Copy feature implementations from `apps/admin` into the matching route folders as you build them out.
