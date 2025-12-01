import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Bike from "./src/models/Bike.js";
import User from "./src/models/User.js";
import bcrypt from "bcrypt";

async function main(){
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB for seeding");

  await Bike.deleteMany({});
  await User.deleteMany({});

  const bikes = [
    { name: "Honda Activa", model: "2022", image: "https://via.placeholder.com/400x250?text=Activa", price: 400 },
    { name: "Bajaj Pulsar", model: "150", image: "https://via.placeholder.com/400x250?text=Pulsar", price: 600 },
    { name: "Royal Enfield Classic", model: "350", image: "https://via.placeholder.com/400x250?text=RE+Classic", price: 1200 }
  ];
  await Bike.insertMany(bikes);
  console.log("Sample bikes seeded");

  const adminPass = await bcrypt.hash("admin123", 10);
  await User.create({ name: "Admin", email: "admin@kolhapur.com", password: adminPass, role: "admin" });
  console.log("Admin created: admin@kolhapur.com / admin123");

  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
