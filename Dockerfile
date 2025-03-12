FROM node:18-alpine as builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml* tsconfig.json ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY src/ ./src/

# Build TypeScript code
RUN pnpm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install pnpm globally in production image
RUN npm install -g pnpm

# Copy package files and install only production dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod

# Copy compiled code from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/app.js"]