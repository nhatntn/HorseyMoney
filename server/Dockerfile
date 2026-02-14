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
# Seed cần prisma/seed.ts + src/data/wishes.ts
COPY --from=builder /app/src/data ./src/data

EXPOSE 3001

# 1) Push schema, 2) Seed bảng Wish (lời chúc), 3) Start server
# Dùng ; để server vẫn chạy nếu push/seed lỗi (vd: DB chưa sẵn sàng)
CMD ["sh", "-c", "timeout 30 npx prisma db push --skip-generate --accept-data-loss; (npx tsx prisma/seed.ts || true); node dist/index.js"]
