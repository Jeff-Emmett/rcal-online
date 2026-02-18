# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY rcal-online/package.json rcal-online/package-lock.json* ./

# Copy prisma schema
COPY rcal-online/prisma ./prisma/

# Copy local SDK dependency (package.json references file:../encryptid-sdk)
COPY encryptid-sdk /encryptid-sdk/

# Install dependencies
RUN npm ci || npm install

# Ensure SDK is properly linked in node_modules
RUN rm -rf node_modules/@encryptid/sdk && \
    mkdir -p node_modules/@encryptid && \
    cp -r /encryptid-sdk node_modules/@encryptid/sdk

# Generate Prisma client
RUN npx prisma generate

# Copy source files
COPY rcal-online/ .

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy prisma for migrations
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
