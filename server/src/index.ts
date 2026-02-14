import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { roomRoutes } from "./routes/rooms";
import { setupSocketHandlers } from "./socket/handler";

const app = express();
const httpServer = createServer(app);

// Support multiple CORS origins: comma-separated CLIENT_URL or wildcard in dev
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const allowedOrigins = CLIENT_URL.split(",").map((s) => s.trim());

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ["GET", "POST"],
};

const io = new Server(httpServer, { cors: corsOptions });

const prisma = new PrismaClient();

app.use(cors(corsOptions));
app.use(express.json());

// Health check – always return 200 so Railway knows the process is alive.
// DB status is informational only; a disconnected DB should not block deploys.
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected" });
  } catch {
    res.json({ status: "ok", db: "disconnected" });
  }
});

// API routes
app.use("/api", roomRoutes(prisma, io));

// Socket.IO handlers
setupSocketHandlers(io, prisma);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🧧 Tet Envelope server running on port ${PORT}`);
  console.log(`   Allowed origins: ${allowedOrigins.join(", ")}`);
});
