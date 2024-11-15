import mongoose from "mongoose";
import dotenv from "dotenv";
import { string } from "zod";
dotenv.config();

mongoose.connect(process.env.MONGODB_URL);

const manualFeedback = new mongoose.Schema({
  employeeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  title : {
    type : String,
    required : true
  },
  content : {
    type : String,
    required : true
  }
});

const ManualAttendance = mongoose.model(
  "Feedback",manualFeedback);
export default ManualAttendance;
