import express from "express";
import ServiceController from "../controllers/service.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", ServiceController.getAllServices);
router.post("/", ServiceController.createService);
router.put("/:id", auth, ServiceController.updateService);
router.delete("/:id", auth, ServiceController.deleteService);

export default router;