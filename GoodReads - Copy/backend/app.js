const express = require("express");
const cookieParser = require("cookie-parser");
const user = require("./routes/user");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db/connection");

const app = express();

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local dev
      "https://readsync-frontend.onrender.com" // Production frontend
    ],
    credentials: true,
  })
);
app.options('*', cors({
  origin: 'https://readsync-frontend.onrender.com',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use(user);

// Connect to DB and start server
const PORT = process.env.PORT || 8000;

connectDB(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  });
