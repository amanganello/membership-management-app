# Build stage
FROM node:20.20-alpine AS builder

WORKDIR /app

# Copy shared module
COPY shared ./shared

# Setup Backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci

COPY backend/tsconfig.json ./
COPY backend/src ./src

RUN npm run build

# Production stage
FROM node:20.20-alpine

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

WORKDIR /app

# Copy shared module (needed for dependencies resolution)
COPY shared ./shared

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/backend/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
