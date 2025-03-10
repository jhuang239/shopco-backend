# Build stage
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Copy package files first (better layer caching)
COPY package*.json ./
RUN npm ci  # Use ci instead of install for more reliable builds

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /usr/src/app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /usr/src/app/dist ./dist

# Add healthcheck (optional but recommended)
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Use non-root user for security
USER node

EXPOSE 3000
CMD ["npm", "run", "start"]