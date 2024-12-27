import auth from "../middlewares/auth.middleware.js";
import express from "express";
import AppointmentController from "../controllers/appointment.controller.js";

const router = express.Router();
router.get("/", AppointmentController.getListAppointments);
router.post("/", AppointmentController.createAppointment);
router.get("/:id", AppointmentController.getAppointment);
router.put("/:id/approve", AppointmentController.approvedAppointment);
router.put("/:id/reject", AppointmentController.rejectAppointment);

export default router;
