FROM node:18-alpine as builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* tsconfig.json ./
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build TypeScript code
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy compiled code from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/app.js"]