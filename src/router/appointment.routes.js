import auth from "../middlewares/auth.middleware.js";
import express from "express";
import AppointmentController from "../controllers/appointment.controller.js";

const router = express.Router();
router.get("/", auth, AppointmentController.getListAppointments);
router.post("/", AppointmentController.createAppointment);
router.get("/:id", auth, AppointmentController.getAppointment);

export default router;
