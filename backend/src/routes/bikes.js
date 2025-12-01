import express from "express";
import Bike from "../models/Bike.js";
import { auth, adminOnly } from "./../middleware/auth.js";

const router = express.Router();

// list bikes
router.get("/", async (req, res) => {
  try {
    const bikes = await Bike.find().sort({ createdAt: -1 });
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// add bike (admin only)
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const bike = await Bike.create(req.body);
    res.json({ message: "Bike added successfully", bike });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
