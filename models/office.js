import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGODB_URL);

const officeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  latitude: {
    type: String, // Latitude of the office
    required: true,
  },
  longitude: {
    type: String, // Longitude of the office
    required: true,
  },
  Students:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Student"
  }],
  radius: {
    type: Number, // Geofence radius in meters
    default: 200,
  },
});

const Office = mongoose.model("Office", officeSchema);
export default Office;
