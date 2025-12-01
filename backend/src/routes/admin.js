import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Bike from "../models/Bike.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";

const router = express.Router();

/* --------------------
    ADMIN AUTH MIDDLEWARE
---------------------- */
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(403).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* --------------------
   REGISTER ADMIN (ONLY FIRST TIME)
---------------------- */
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

/* --------------------
   ADMIN LOGIN
---------------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login Successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

/* --------------------
   ADD BIKE (Admin Protected)
---------------------- */
router.post("/bike", verifyAdmin, async (req, res) => {
  try {
    const bike = new Bike(req.body);
    await bike.save();
    res.status(201).json({ message: "Bike added successfully", bike });
  } catch (error) {
    res.status(500).json({ message: "Error adding bike", error });
  }
});

/* --------------------
  DELETE BIKE
---------------------- */
router.delete("/bike/:id", verifyAdmin, async (req, res) => {
  try {
    await Bike.findByIdAndDelete(req.params.id);
    res.json({ message: "Bike deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bike", error });
  }
});

/* --------------------
  DASHBOARD STATS
---------------------- */
router.get("/dashboard", verifyAdmin, async (req, res) => {
  try {
    const countBikes = await Bike.countDocuments();
    const countBookings = await Booking.countDocuments();
    const countUsers = await User.countDocuments();

    res.json({
      bikes: countBikes,
      bookings: countBookings,
      users: countUsers
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving dashboard data", error });
  }
});

/* --------------------
  VERIFY LOGIN SESSION
---------------------- */
router.get("/verify", verifyAdmin, (req, res) => {
  res.json({ message: "Admin verified", admin: req.admin });
});

export default router;
