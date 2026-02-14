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

# Run prisma db push with a timeout (30s max), then always start the server.
# Using ; instead of && so the server starts even if db push fails.
CMD ["sh", "-c", "timeout 30 npx prisma db push --skip-generate; node dist/index.js"]
