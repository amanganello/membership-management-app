# Build stage
FROM node:20.20-alpine AS builder

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

# Copy shared module
COPY shared ./shared

# Setup Frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci

# Copy source code
COPY frontend/ ./

RUN npm run build

# Production stage - serve with nginx
FROM nginx:1.27-alpine

COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY --from=builder /app/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
