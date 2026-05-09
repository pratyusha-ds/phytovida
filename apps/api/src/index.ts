import "dotenv/config"; // Load environment variables from .env file
import express from "express";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import appRoutes from "./routes/index.js";
import dashboardRoutes from "./routes/dashboard.js";
import plantRoutes from "./routes/plantlibrary.js";
import pushRoutes from "./routes/push.js";
import { startScheduler } from "./jobs/scheduler.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
const allowedOrigins = [
  "https://phytovida.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(clerkMiddleware());

// API Routes
app.use("/api", appRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/auth/register/clerk", express.raw({ type: "application/json" }));
app.use("/api/push", pushRoutes);

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
  startScheduler();
});
