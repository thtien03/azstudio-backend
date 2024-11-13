import express from "express";
import CategoryController from "../controllers/category.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", CategoryController.getAllCategories);
router.post("/", CategoryController.createCategory);
router.put("/:id", auth, CategoryController.updateCategory);
router.delete("/:id", auth, CategoryController.deleteCategory);

router.get("/:id", CategoryController.getCategory);

export default router;