import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";
import { adminSigninSchema, adminSignupSchema } from "../validation/schema.js";
import Office from "../models/office.js";
import Employee from "../models/employee.js";
import Attendance from "../models/attendance.js";
import ManualAttendance from "../models/manualAttendance.js";
import RoomMate from "../models/roomate.js";
import RoommatePair from "../models/roomMatepaired.js";

export const signinHandler = async (req, res) => {
  const adminPayload = req.body;
  const isValid = adminSigninSchema.safeParse(adminPayload);

  if (!isValid.success) {
    res.json({ message: "Invalid Information" });
    return;
  }

  const admin = await Admin.findOne({
    email: adminPayload.email,
    password: adminPayload.password,
  });

  if (admin) {
    const token = await jwt.sign({ admin }, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Admin signed in.",
      admin: admin,
      token: token,
    });
  } else {
    res.status(200).json({
      message: "Admin does not exist.",
      admin: null,
      token: null,
    });
  }
};

export const signupHandler = async (req, res) => {
  const adminPayload = req.body;
  const isValid = adminSignupSchema.safeParse(adminPayload);

  if (!isValid.success) {
    res.json({ message: "Invalid Information" });
    return;
  }

  const adminExists = await Admin.findOne({
    email: adminPayload.email,
  });

  if (!adminExists) {
    const admin = await Admin.create({
      name: adminPayload.name,
      email: adminPayload.email,
      phone: adminPayload.phone,
      password: adminPayload.password,
      company: adminPayload.company,
    });

    res.status(200).json({
      message: "Admin created.",
      admin: admin,
    });
  } else {
    res.status(200).json({
      message: "Admin exists.",
      admin: null,
    });
  }
};

export const addOfficeHandler = async (req, res) => {
  const { adminId, name, longitude, latitude } = req.body;

  try {
    const office = await Office.create({
      name,
      latitude,
      longitude,
    });

    const savedOffice = await office.save();
    await Admin.findByIdAndUpdate(
      adminId,
      { $push: { offices: savedOffice._id } }, // Add the new office ID to the offices array
      { new: true } // Return the updated admin document (optional)
    );

    return res.status(200).json({
      office: office,
      message: "Office Created!!"
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getOfficesByAdminIdHandler = async (req, res) => {
  const adminId = req.params.adminId;
  try {
    const adminWithOffices = await Admin.findById(adminId).populate("offices");
    if (!adminWithOffices) {
      res.status(200).json({ message: "Admin not found." });
      return null;
    }

    res.status(200).json({ offices: adminWithOffices.offices });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getEmployeesByOfficeIdHandler = async (req, res) => {
  const officeId = req.params.officeId;
  try {
    const employees = await Employee.find({ office: officeId });

    res.status(200).json(employees);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getAttendanceByEmpIdHandler = async (req, res) => {
  const empId = req.params.empId;
  try {
    const attendance = await Attendance.find({ employeeID: empId });
    res.status(200).json(attendance);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getManualAttendanceByEmpIdHandler = async (req, res) => {
  const empId = req.params.empId;
  try {
    const manualAttendance = await ManualAttendance.find({ employeeID: empId });
    res.status(200).json(manualAttendance);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


export const shuffleAndSaveHostelPairs = async (req, res) => {
  try {
    // console.log("here")
    const hostelId = req.params.HostelId; // Admin provides the hostel ID to shuffle
   // console.log(hostelId)

    // Find all RoomMate profiles for students in the specified hostel
    const roommatesInHostel = await RoomMate.find({ Hostel: hostelId }).populate("StudentId");
    console.log(roommatesInHostel)
    if (roommatesInHostel.length === 0) {
      return res.status(404).json({ message: "No students found in this hostel" });
    }

    // Shuffle logic: Sort RoomMate profiles based on preferences (e.g., budget, cleanliness level)
    roommatesInHostel.sort((a, b) => {
      if (a.budget !== b.budget) {
        return a.budget - b.budget; // Sort by budget (ascending)
      }
      // Further sort by cleanliness level if budgets are the same
      const cleanlinessOrder = { Low: 1, Medium: 2, High: 3 };
      return cleanlinessOrder[a.lifestyle.cleanlinessLevel] - cleanlinessOrder[b.lifestyle.cleanlinessLevel];
    });

    // Create roommate pairs and save them to the RoommatePair model
    let matches = [];
    for (let i = 0; i < roommatesInHostel.length - 1; i += 2) {
      const pair = {
        Hostel: hostelId,
        student1: roommatesInHostel[i].StudentId._id,
        student2: roommatesInHostel[i + 1] ? roommatesInHostel[i + 1].StudentId._id : null, // Null if no pair available
      };
      // Save the pair to the database

      const newPair = new RoommatePair(pair);
      await newPair.save();
      // Add the pair to the matches array for the response
      matches.push({
        student1: roommatesInHostel[i].StudentId.name,
        student2: roommatesInHostel[i + 1] ? roommatesInHostel[i + 1].StudentId.name : "No partner found",
      });
    }

    res.status(200).json({
      message: ` Roommate pairs created and saved successfully for hostel with ID: ${hostelId}`,
      matches,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPairsByHostelId = async (req, res) => {
  const HostelId = req.params.HostelId;
  try {
    const pairs = await RoommatePair.find({ Hostel: HostelId });
    res.status(200).json(pairs);
  } catch (error) {
    res.status(404).json({ message: "Don't Have any generated Pairs" })
  }
}