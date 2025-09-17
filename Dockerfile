# ---- Dependencias (Debian) ----
FROM node:22-bookworm AS deps
WORKDIR /app
COPY package*.json ./
# Si usás npm: 
RUN npm ci
# (si usás pnpm/yarn, cambiá el comando)

# ---- Build ----
FROM node:22-bookworm AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Runner (imagen final, slim) ----
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# usuario no-root
RUN useradd -m nextjs

# Copia el output "standalone" de Next.js
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
USER nextjs
CMD ["node", "server.js"]
