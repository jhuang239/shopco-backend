# Build stage
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /usr/src/app

# Copy built files and dependencies
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000
CMD ["npm", "run", "start"]