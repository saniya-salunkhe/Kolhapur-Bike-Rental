import mongoose from "mongoose";
const { Schema } = mongoose;

const bookingSchema = new mongoose.Schema({
  userId: String,
  bikeId: String,
  location: String,
  pickupDate: String,
  pickupTime: String,
  dropDate: String,
  dropTime: String,
  status: { type: String, default: "pending" }
});


export default mongoose.model("Booking", bookingSchema);
