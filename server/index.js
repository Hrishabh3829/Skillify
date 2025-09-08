import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./dataBase/dbConnect.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";

dotenv.config({});

const app = express();

// Behind Render proxy: needed so secure cookies + protocol detection work
app.set("trust proxy", 1);

const Port = process.env.PORT;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
// Supports:
// - FRONTEND_URL (single primary prod domain)
// - ALLOWED_ORIGINS (comma separated list)
// - Optional wildcard allowance for Vercel preview deployments when ALLOW_VERCEL_PREVIEWS=true
const primaryFrontend = process.env.FRONTEND_URL;
const additional = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);

const baseAllowed = [
  primaryFrontend,
  ...additional,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEWS === "true";
// Build regex list for dynamic origins (extend if you have other preview hosts)
const dynamicOriginTests = [];
if (allowVercelPreviews) {
  // e.g. https://skillify-<hash>-<project>.vercel.app
  dynamicOriginTests.push(/^https:\/\/.*vercel\.app$/i);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // server-to-server or curl
      if (baseAllowed.includes(origin)) return callback(null, true);
      if (dynamicOriginTests.some(r => r.test(origin))) return callback(null, true);
      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
  })
);

// Express 5 with path-to-regexp v6 can error on a bare "*" route; CORS middleware already handles preflight.

//api's
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);

app.get("/", (_, res) => {
  res.send("from backend");
});

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
//call Database
connectDB();
