# Frontend Dockerfile (Next.js 14)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm ci || npm install

FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Remove dev dependencies to slim down runtime deps
RUN npm prune --omit=dev || true

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# Copy pruned production node_modules
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
# Ensure package.json is present for npm start
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
