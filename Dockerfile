# Stage 1: Build the app
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

COPY package*.json ./
# CHANGE: Use npm ci (faster) and a cache mount (saves packages between builds)
RUN --mount=type=cache,target=/root/.npm npm ci

# Build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Vite outputs to the 'dist' folder by default
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]