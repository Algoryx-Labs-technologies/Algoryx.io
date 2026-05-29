# syntax=docker/dockerfile:1
# Build from the monorepo root:
#   docker build -f apps/apiv2/Dockerfile -t algoryx-apiv2 .
# Or use docker compose from apps/apiv2 (see README).

ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Production dependencies only (hoisted workspace install)
FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/apiv2/package.json ./apps/apiv2/package.json
RUN npm ci --workspace=@algoryx/apiv2 --include-workspace-root --omit=dev

# Compile bundle (esbuild) with dev tooling
FROM base AS build
COPY package.json package-lock.json ./
COPY apps/apiv2/package.json ./apps/apiv2/package.json
RUN npm ci --workspace=@algoryx/apiv2 --include-workspace-root
COPY apps/apiv2 ./apps/apiv2
WORKDIR /app/apps/apiv2
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app/apps/apiv2

RUN addgroup -S apiv2 && adduser -S apiv2 -G apiv2

COPY --from=deps --chown=apiv2:apiv2 /app/node_modules /app/node_modules
COPY --from=deps --chown=apiv2:apiv2 /app/apps/apiv2/package.json ./package.json
COPY --from=build --chown=apiv2:apiv2 /app/apps/apiv2/dist/server.js ./dist/server.js

USER apiv2

EXPOSE 4001

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||4001)+'/api/'+(process.env.API_VERSION||'v2')+'/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/server.js"]
