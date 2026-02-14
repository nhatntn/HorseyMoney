# 🧧 Lì Xì Tết — Lucky Envelope App

A realtime room-based web app for Vietnamese Tet (Lunar New Year) celebrations. Users create rooms, invite participants, and each person opens a lucky envelope to receive a random monetary amount and a festive Tet wish — all updated in realtime.

## Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Express + Socket.IO + Prisma ORM
- **Database:** SQLite (dev) / PostgreSQL (prod)
- **Realtime:** Socket.IO WebSockets

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Install all dependencies (root + server + client)
npm run setup
```

This will:
1. Install all npm dependencies
2. Push the Prisma schema to SQLite
3. Seed the database with Vietnamese Tet wishes

### Run Development

```bash
# Start both server (port 3001) and client (port 3000)
npm run dev
```

Or run individually:

```bash
# Terminal 1 — Server
cd server && npm run dev

# Terminal 2 — Client
cd client && npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## How It Works

1. **Create a Room** — Set a name, max participants, envelope amounts (in thousand VND), and wish tone
2. **Share the Code** — Give the 6-character room code to your group
3. **Join** — Enter a display name to join the room
4. **Open Envelope** — Tap the lucky envelope to receive a random amount and Tet wish
5. **Leaderboard** — See who got the luckiest in realtime!

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rooms` | Create a new room |
| POST | `/api/rooms/:code/join` | Join a room |
| POST | `/api/rooms/:code/open` | Open an envelope |
| GET | `/api/rooms/:code` | Get room state |

## Socket.IO Events

| Direction | Event | Description |
|-----------|-------|-------------|
| Client → Server | `room:subscribe` | Subscribe to room updates |
| Server → Client | `room:state` | Initial room state |
| Server → Client | `room:update` | Room state after join/open |
| Server → Client | `room:error` | Error message |

## Deployment

### Option 1: Docker Compose (VPS / self-hosted)

```bash
# Clone the repo
git clone <your-repo-url> && cd HorseMoney

# Create .env for production
cp .env.example .env.production

# Edit .env.production with your domain/IP
# Then run:
docker compose --env-file .env.production up -d --build
```

Your app will be at `http://your-server-ip:3000`.

### Option 2: Railway (recommended, easiest)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) and create a new project
3. Add a **PostgreSQL** database service
4. Add a new service from your GitHub repo → set **Root Directory** = `server`
   - Add env vars: `DATABASE_URL` (copy from Railway PostgreSQL), `PORT=3001`, `CLIENT_URL=https://your-client.vercel.app`
   - Build command: `npm run build`
   - Start command: `npx prisma db push --skip-generate --accept-data-loss && npm start`
5. Deploy **client** on Vercel (see below)

### Option 3: Vercel (client) + Railway/Render (server)

**Client on Vercel:**
1. Import `client/` folder on [vercel.com](https://vercel.com)
2. Set Root Directory = `client`
3. Add env vars:
   - `NEXT_PUBLIC_API_URL` = your server URL (e.g. `https://horsemoney-server.up.railway.app`)
   - `NEXT_PUBLIC_SOCKET_URL` = same as above
4. Deploy

**Server on Railway or Render:**
1. Create a new Web Service from `server/` folder
2. Add a PostgreSQL database
3. Set env vars: `DATABASE_URL`, `PORT=3001`, `CLIENT_URL=https://your-app.vercel.app`
4. Build: `npm run build` | Start: `npx prisma db push --skip-generate --accept-data-loss && npm start`

### Environment Variables

| Variable | Where | Example |
|----------|-------|---------|
| `DATABASE_URL` | Server | `postgresql://user:pass@host:5432/horsemoney` |
| `PORT` | Server | `3001` |
| `CLIENT_URL` | Server | `https://your-client.vercel.app` |
| `NEXT_PUBLIC_API_URL` | Client (build-time) | `https://your-server.railway.app` |
| `NEXT_PUBLIC_SOCKET_URL` | Client (build-time) | `https://your-server.railway.app` |

### Seed wishes (first time)

After deploying the server, run the seed to populate Vietnamese Tet wishes:

```bash
# On Railway: use the Railway CLI
railway run npx tsx prisma/seed.ts

# Or with Docker:
docker compose exec server npx tsx prisma/seed.ts
```

## Project Structure

```
├── server/                 # Express + Socket.IO backend
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema (PostgreSQL)
│   │   └── seed.ts         # Wish data seeder
│   ├── src/
│   │   ├── index.ts         # Server entry point
│   │   ├── routes/rooms.ts  # REST API routes
│   │   ├── socket/handler.ts # Socket.IO event handlers
│   │   ├── lib/raceManager.ts # In-memory race state
│   │   ├── lib/roomState.ts  # Shared room state query
│   │   └── data/wishes.ts    # Vietnamese Tet wishes
│   └── Dockerfile
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Landing page
│   │   │   ├── create/page.tsx   # Create room form
│   │   │   └── room/[code]/      # Room view (race track, lobby, results)
│   │   ├── components/Horse.tsx   # Animated horse SVG
│   │   └── lib/socket.ts         # Socket.IO client
│   └── Dockerfile
├── docker-compose.yml      # Full-stack production deploy
├── .env.example            # Environment variables template
└── package.json            # Root scripts
```
