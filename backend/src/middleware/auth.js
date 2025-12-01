import jwt from "jsonwebtoken"; 
import User from "../models/User.js"; 

const JWT_SECRET = process.env.JWT_SECRET || "secret"; 

export const auth = async (req, res, next) => { const header = req.headers.authorization; if (!header) return res.status(401).json({ message: "Authorization required" }); 

const token = header.split(" ")[1]; 
try { const payload = jwt.verify(token, JWT_SECRET); req.user = await User.findById(payload.id).select("-password"); 
  if (!req.user) return res.status(401).json({ message: "User not found" }); 
  next(); 
} catch (err) { 
  return res.status(401).json({ message: "Invalid token" }); 
} 
}; 

export const adminOnly = (req, res, next) => { if (!req.user) return res.status(401).json({ message: "Auth required" }); 
if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" }); 
next(); 
};