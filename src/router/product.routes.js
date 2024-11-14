import express from "express";
import ProductController from "../controllers/product.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", ProductController.getAllProducts);
router.get("/:categoryId", ProductController.getAllProductsByCategory);
router.post("/", ProductController.createProduct);
router.put("/:id", auth, ProductController.updateProduct);
router.delete("/:id", auth, ProductController.deleteProduct);

router.get("/:id", ProductController.getProduct);

export default router;
