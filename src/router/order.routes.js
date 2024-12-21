import OrderController from "../controllers/order.controller.js";
import auth from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();
router.get("/", OrderController.getListOrders);
router.post("/", OrderController.createOrder);
router.put("/approve", OrderController.approveOrder);

export default router;
