import express from "express";
const router = express.Router();
import {
  signinHandler,
  signupHandler,
  joinOfficeHandler,
  getAttendanceByEmpIdHandler,
  getManualAttendanceByEmpIdHandler,
  markAttendanceHandler,
  markManualAttendanceHandler,
  getOfficeByEmpIdHandler,
  manualFeedback,
  GetFeedbacks,
  CreateRoomMateProfile
} from "../../controllers/User.js";

router.post("/signin", signinHandler);
router.post("/signup", signupHandler);
router.post("/joinOffice", joinOfficeHandler);
router.get('/getOfficeByEmpId/:empId', getOfficeByEmpIdHandler)
router.get("/getAttendanceByEmpId/:empId", getAttendanceByEmpIdHandler);
router.get("/getManualAttendanceByEmpId/:empId", getManualAttendanceByEmpIdHandler);
router.post("/markAttendance", markAttendanceHandler)
router.post("/markManualAttendance", markManualAttendanceHandler)
router.post("/markFeedback",manualFeedback);
router.get("/getFeeds",GetFeedbacks);
router.post("/createProfile",CreateRoomMateProfile);


export default router;
