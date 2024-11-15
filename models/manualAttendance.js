import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGODB_URL);

const manualAttendanceSchema = new mongoose.Schema({
  employeeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee", // Reference to Employee Schema
    required: true,
  },
  checkin_time: {
    type: Date,
    required: true,
  },
  checkout_time: {
    type: Date,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  is_manual: {
    type: Boolean,
    default: true, // Indicates manual attendance
  },
  suggested_location: {
    type: String, // This could be a custom location name or suggestion
    required: true,
  },
});

const ManualAttendance = mongoose.model(
  "ManualAttendance",
  manualAttendanceSchema
);
export default ManualAttendance;
