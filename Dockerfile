# Build stage
FROM node:18-alpine AS builder
WORKDIR .
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR .
COPY --from=builder ./dist ./dist
COPY --from=builder ./node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000
CMD ["npm", "run", "start"]