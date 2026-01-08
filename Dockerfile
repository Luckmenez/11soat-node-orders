# Base stage - Install dependencies
FROM node:20-alpine AS base
WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY src/infrastructure/persistence/prisma ./src/infrastructure/persistence/prisma/

# Development dependencies stage
FROM base AS deps

# Configure npm authentication for private packages
ARG NPM_TOKEN
RUN echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" > .npmrc && \
    echo "@vineco77:registry=https://npm.pkg.github.com/" >> .npmrc

RUN npm ci

# Remove .npmrc for security
RUN rm -f .npmrc

# Build stage
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate --schema=./src/infrastructure/persistence/prisma/schema.prisma

# Build application
RUN npm run build

# Remove dev dependencies and install only production
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl curl

# Copy necessary files from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/src/infrastructure/persistence/prisma ./src/infrastructure/persistence/prisma

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["node", "dist/main.js"]
