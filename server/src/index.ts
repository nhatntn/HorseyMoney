import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { roomRoutes } from "./routes/rooms";
import { setupSocketHandlers } from "./socket/handler";

const app = express();
const httpServer = createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

const prisma = new PrismaClient();

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// API routes
app.use("/api", roomRoutes(prisma, io));

// Socket.IO handlers
setupSocketHandlers(io, prisma);

const PORT = process.env.PORT || 3001;
httpServer.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🧧 Tet Envelope server running on 0.0.0.0:${PORT}`);
  console.log(`   Accepting clients from ${CLIENT_URL}`);
});
