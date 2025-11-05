# Install shared workspace dependencies once
FROM node:20-alpine AS deps
WORKDIR /workspace

COPY package.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

RUN npm install --workspaces --include-workspace-root

# Backend runtime image
FROM node:20-alpine AS backend
WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY backend/package.json backend/package.json
COPY --from=deps /workspace/node_modules ./node_modules
COPY backend ./backend
COPY content ./content
COPY .env.example ./.env.example

EXPOSE 5000

CMD ["npm", "run", "start", "--workspace", "backend"]

# Frontend build stage
FROM deps AS frontend-build
WORKDIR /workspace

COPY frontend ./frontend
COPY .env.example ../.env.example

RUN npm run build --workspace frontend

# Frontend runtime image (static hosting via nginx)
FROM nginx:1.25-alpine AS frontend

COPY --from=frontend-build /workspace/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
