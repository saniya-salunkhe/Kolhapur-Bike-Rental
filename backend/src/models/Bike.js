import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema({
  name: String,
  model: String,
  price: Number,
  image: String,
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Bike", bikeSchema);
