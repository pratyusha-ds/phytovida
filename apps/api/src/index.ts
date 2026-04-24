import "dotenv/config"; // Load environment variables from .env file
import express from "express";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import appRoutes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());

app.use(express.json());
app.use(clerkMiddleware({}));

// API Routes
app.use("/api", appRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date(Date.now()).toUTCString(),
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});
