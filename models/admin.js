import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGODB_URL);

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  offices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Office", // Many-to-Many relationship with offices
    },
  ],
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
