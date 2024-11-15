import Employee from "../models/employee.js";
import jwt from "jsonwebtoken";
import { userSigninSchema, userSignupSchema } from "../validation/schema.js";
import Attendance from "../models/attendance.js";
import Feedback from "../models/feedback.js";
import RoomMate from "../models/roomate.js";

export const signinHandler = async (req, res) => {
  const userPayload = req.body;
  const isValid = userSigninSchema.safeParse(userPayload);

  if (!isValid.success) {
    res.json({ message: "Invalid Information" });
    return;
  }

  const employee = await Employee.findOne({
    email: userPayload.email,
    password: userPayload.password,
  });

  if (employee) {
    const token = await jwt.sign({ employee }, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Employee signed in.",
      employee: employee,
      token: token,
    });
  } else {
    res.status(200).json({
      message: "Employee does not exist.",
      employee: null,
      token: null,
    });
  }
};

export const signupHandler = async (req, res) => {
  const userPayload = req.body;
  const isValid = userSignupSchema.safeParse(userPayload);

  console.log(userPayload)

  if (!isValid.success) {
    res.json({ message: "Invalid Information" });
    return;
  }

  const employeeExists = await Employee.findOne({
    email: userPayload.email,
  });

  if (!employeeExists) {
    const employee = await Employee.create({
      name: userPayload.name,
      email: userPayload.email,
      phone: userPayload.phone,
      password: userPayload.password,
    });

    const token = await jwt.sign({employee}, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Employee created.",
      token : token
    });
  } else {
    res.status(200).json({
      message: "Employee exists.",
      employee: null,
    });
  }
};

export const joinOfficeHandler = async (req, res) => {
  const { empId, officeId } = req.body;

  try {
    const employee = await Employee.updateOne(
      { _id: empId },
      {
        office: officeId,
      }
    );
    res.status(200).json(employee);
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

export const markAttendanceHandler = async (req, res) => {
  const {
    employeeID,
    checkin_time,
    checkout_time,
    latitude,
    longitude,
    total_hours,
  } = req.body;

  try {
    const attendance = await Attendance.create({
      employeeID,
      checkin_time,
      checkout_time,
      latitude,
      longitude,
      total_hours
    });

    res
      .status(200)
      .json({
        attendance: attendance,
        message: "Attendance marked successfully.",
      });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const markManualAttendanceHandler = async (req, res) => {
  const {
    employeeID,
    checkin_time,
    checkout_time,
    latitude,
    longitude,
    total_hours,
    isManual,
    suggested_location,
  } = req.body;

  try {
    const attendance = await Attendance.create({
      employeeID,
      checkin_time,
      checkout_time,
      latitude,
      longitude,
      total_hours,
      isManual,
      suggested_location,
    });

    res
      .status(200)
      .json({
        attendance: attendance,
        message: "Attendance marked successfully.",
      });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const manualFeedback = async (req,res) => {
  const {
    employeeID,
    content,
    title,
  } = req.body

  if(!employeeID || !content || !title) {
    return res.json({
        status : "failed",
        message : "all Fields are not present"
    })
  }

  try {
    const feedback = await Feedback.create({
      employeeID,
      content,
      title
    })

    return res.json({
      status : "success",
      message : "feedback registered"
    })
  }
  catch(e) {
    res.status(500).json({ error: e.message });
  }
}

export const getOfficeByEmpIdHandler = async (req, res) => {
  const empId = req.params.empId

  try {
    const user = await Employee.findById(empId).populate("office")

    res.status(200).json({office: user.office});

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const GetFeedbacks = async (req,res) => {
    const feeds = await Feedback.find({});

    return res.json(feeds);
}

export const markFeedBack = async (req, res) => {
  const {
    employeeID,
    title,
    content
  } = req.body;

  try {
    const attendance = await Attendance.create({
      employeeID,
      checkin_time,
      checkout_time,
      latitude,
      longitude,
      total_hours,
      isManual,
      suggested_location,
    });

    res
      .status(200)
      .json({
        attendance: attendance,
        message: "Attendance marked successfully.",
      });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const CreateRoomMateProfile = async (req, res) => {
  const { StudentId, budget, lifestyle, location, hobbies } = req.body;
  console.log("here")
  try {
    // Step 1: Find the student to get the Hostel ID
    const student = await Employee.findById(StudentId); 
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Step 2: Extract Hostel ID from student
    const { office } = student;
    const Hostel = office

    // Step 3: Check if the RoomMateMatch already exists for this student
    let roomMate = await RoomMate.findOne({ StudentId });
    
    if (roomMate) {
      // If the RoomMateMatch already exists, update it
      roomMate = await RoomMate.findOneAndUpdate(
        { StudentId },
        { budget, lifestyle, location, hobbies, Hostel }, // Add Hostel to the update
        { new: true }
      );
      return res.status(200).json({ message: "Room Profile Updated successfully", roomMate });
    }

    // Step 4: If the RoomMateMatch doesn't exist, create a new one
    let createRoomMate = await RoomMate.create({
      StudentId,
      budget,
      lifestyle,
      location,
      hobbies,
      Hostel // Add Hostel to the new RoomMate profile
    });

    return res.status(200).json({ message: "Room Profile Created Successfully", roomMate : createRoomMate });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};