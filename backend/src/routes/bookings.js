import express from "express";
import Booking from "../models/Booking.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Auth middleware
function auth(req, res, next) {
  const bearerHeader = req.headers.authorization;

  if (!bearerHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = bearerHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    // Make sure user exists in DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  });
}

// Create booking
router.post("/", auth, async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      userId: req.user._id   // FIXED: storing actual MongoDB user reference
    });

    await booking.save();
    res.json({ message: "Booking Successfully Created", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
});

// Fetch all bookings
router.get("/", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

export default router;
