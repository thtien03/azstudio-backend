import express from "express";
import ProductController from "../controllers/product.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:id", ProductController.getProduct);
router.get("/", ProductController.getAllProducts);
router.get("/:categoryId", ProductController.getAllProductsByCategory);
router.post("/", ProductController.createProduct);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);


export default router;
