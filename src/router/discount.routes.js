import express from "express";
import mongoose from "mongoose";
import DiscountController from "../controllers/discount.controller.js";

const router = express.Router();

// Middleware kiểm tra ID hợp lệ
const validateIdMiddleware = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID không hợp lệ" });
  }
  next();
};

// Route cho mã giảm giá
router
  .route("/")
  .get(DiscountController.getDiscounts) // Lấy danh sách mã giảm giá
  .post(DiscountController.createDiscount); // Tạo mã giảm giá mới

router
  .route("/:id")
  .put(validateIdMiddleware, DiscountController.updateDiscount) // Cập nhật mã giảm giá
  .delete(validateIdMiddleware, DiscountController.deleteDiscount); // Xóa mã giảm giá

// Route kiểm tra tính hợp lệ của mã giảm giá
router.post("/validate", (req, res, next) => {
  console.log("Received request at /validate with body:", req.body);
  next();
}, DiscountController.validateDiscount);

// Middleware xử lý lỗi
router.use((err, req, res, next) => {
  console.error("Error occurred:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Đã xảy ra lỗi trên server" });
});

router.post("/use", DiscountController.useDiscount);


export default router;
