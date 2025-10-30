import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";


const app = express();  // create the app

// Doors/security/logging for every request:
app.use(helmet());  // security seatbelts
app.use(cors({ origin: true, credentials: true }));  // allow frontend to call API
app.use(express.json());  // read JSON bodies
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));  // logging
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Quick heartbeat route:
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "tasktrackr-api",
    time: new Date().toISOString(),
    env: process.env.NODE_ENV || "development"
  });
});

// If no route matched:
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Start the server:
const PORT = process.env.PORT || 4000;
const start = async () => {
    await connectDB(process.env.MONGODB_URI);  // connect to database (safe to skip if empty)
    app.listen(PORT, () => console.log(`[Server]  http://localhost: ${PORT}`));
};

start();  // kick it off