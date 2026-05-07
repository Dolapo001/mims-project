# Stage 1: Build Environment
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy code and build production bundle
COPY . .
# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1
# Fetch Google Fonts over HTTP inside standard build
ENV NEXT_FONT_GOOGLE_PRECONNECT 0
RUN npm run build


# Stage 2: Runner Environment
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 7000
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy essential build artifacts and node modules
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 7000

# Run Next.js production server
CMD ["npm", "run", "start"]
