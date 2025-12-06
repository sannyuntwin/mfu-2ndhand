# Production Dockerfile for MFU 2ndHand Backend
FROM node:18-alpine AS builder

WORKDIR /app

# Prisma needs OpenSSL on Alpine
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including dev dependencies
RUN npm ci

# Copy source code
COPY . .

# Fix Prisma + TypeScript permissions
RUN chmod +x node_modules/.bin/prisma
RUN chmod +x node_modules/.bin/tsc

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build


# ------------------ PRODUCTION STAGE ------------------
FROM node:18-alpine AS production

WORKDIR /app

# Prisma needs OpenSSL in production too
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Create uploads directory (don't copy from builder since it doesn't exist there)
RUN mkdir -p ./uploads

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Set permissions
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node --version || exit 1

# Start the application
CMD ["npm", "run", "start:prod"]