FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

# 1) Push schema, 2) Seed bảng Wish (chạy bằng node, không cần tsx), 3) Start server
CMD ["sh", "-c", "timeout 30 npx prisma db push --skip-generate --accept-data-loss; (node dist/scripts/seed.js || true); node dist/index.js"]
