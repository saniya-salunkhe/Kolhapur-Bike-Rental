import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await Contact.create({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    });

    res.json({ message: "Message received. We will contact you soon!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
