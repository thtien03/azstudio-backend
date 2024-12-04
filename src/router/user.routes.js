import UserController from "../controllers/user.controller.js";
import express from "express";

const router = express.Router();

router.post("/login", UserController.login);

router.get("/logout", UserController.logout);

router.get("/refresh_token", UserController.getAccessToken);

router.post("/register", UserController.register);
router.put("/block/:userId", UserController.blockUser);

export default router;
