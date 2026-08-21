require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const chatRoutes = require("./routes/chatRoutes");
const historyRoutes = require("./routes/historyRoutes");

const app = express();

connectDB();

// Dynamic CORS origin handling
const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Smart Study Assistant API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/history", historyRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

// Listen on 0.0.0.0 for containerized deployment
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});