import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Load .env file
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ===== Import Routes =====
import authRoutes from "./src/routes/auth.js";
import bikeRoutes from "./src/routes/bikes.js";
import bookingRoutes from "./src/routes/bookings.js";
import adminRoutes from "./src/routes/admin.js";
import contactRoutes from "./src/routes/contact.js";

// ===== Use Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/bikes", bikeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

// ===== Database Connection =====
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("🔥 MongoDB Connected Successfully"))
  .catch(err => console.log("❌ Database Connection Failed:", err));

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
