import express, { json } from "express";
import "dotenv/config";
import connectDB from "./database/mongoConnector.js";
import path from "path";
import authRouter from "./routes/authRoutes.js";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";

const __dirname = path.resolve();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Handle preflight requests

app.use(
  cors({
    origin: `http://localhost:5173`,
    credentials: true,
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
);

app.use("/api/auth", authRouter);
app.use("/api/official", userRouter);

//route not found middleware
app.use((req, res, next) => {
  // if we have the wrong route
  const error = new Error("route not found");
  error.status = 404;
  next(error);
});

// Global error handler
app.use((error, req, res, next) => {
  // Centralized error processing
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";
  console.error(error.stack); // Log the stack trace
  // Development vs production responses
  if (process.env.NODE_ENV === "development") {
    res.status(status).json({
      error: {
        message,
        status: status,
        stack: error.stack,
        fullError: error,
      },
    });
  } else {
    res.status(status).json({ error: message });
  }
});

connectDB()
  .then(() =>
    app.listen(PORT, () => {
      console.log("server running on port:", PORT);
    })
  )
  .catch(() => {
    console.log("database connections failed", error);
  });
