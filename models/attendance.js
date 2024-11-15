import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGODB_URL);

const attendanceSchema = new mongoose.Schema({
  employeeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee", // Reference to Employee Schema
    required: true,
  },
  total_hours: Number, // Calculated after check-out
  checkin_time: {
    type: Date,
    required: true,
  },
  checkout_time: {
    type: Date,
  },
  latitude: {
    type: String,
    required: true
  },
  longitude: {
    type: String,
    required: true
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
