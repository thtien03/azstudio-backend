import Discount from "../models/discount.model.js";

class DiscountController {
  // Lấy danh sách mã giảm giá
  static async getDiscounts(req, res) {
    try {
      const discounts = await Discount.find();
      res.json(discounts);
    } catch (error) {
      console.error("Error fetching discounts:", error.message);
      res.status(500).json({ message: "Lỗi khi lấy danh sách mã giảm giá", error: error.message });
    }
  }

  // Tạo mã giảm giá mới
  static async createDiscount(req, res) {
    try {
      const { code, value, maxDiscount, maxUses, startDate, endDate } = req.body;

      const existingDiscount = await Discount.findOne({ code });
      if (existingDiscount) {
        return res.status(400).json({ message: "Mã giảm giá đã tồn tại." });
      }

      if (new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({ message: "Ngày bắt đầu không được sau ngày kết thúc." });
      }

      const newDiscount = new Discount({
        code,
        value,
        maxDiscount,
        maxUses,
        startDate,
        endDate,
        usedCount: 0,
      });

      const savedDiscount = await newDiscount.save();
      res.status(201).json({ message: "Tạo mã giảm giá thành công", discount: savedDiscount });
    } catch (error) {
      console.error("Error creating discount:", error.message);
      res.status(500).json({ message: "Lỗi khi tạo mã giảm giá", error: error.message });
    }
  }

  // Cập nhật mã giảm giá
  static async updateDiscount(req, res) {
    try {
      const { id } = req.params;
      const { code, value, maxDiscount, maxUses, startDate, endDate } = req.body;

      if (new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({ message: "Ngày bắt đầu không được sau ngày kết thúc." });
      }

      const existingDiscount = await Discount.findOne({ code });
      if (existingDiscount && existingDiscount._id.toString() !== id) {
        return res.status(400).json({ message: "Mã giảm giá đã tồn tại." });
      }

      const updatedDiscount = await Discount.findByIdAndUpdate(
        id,
        { code, value, maxDiscount, maxUses, startDate, endDate },
        { new: true }
      );

      if (!updatedDiscount) {
        return res.status(404).json({ message: "Mã giảm giá không tồn tại." });
      }

      res.json({ message: "Cập nhật mã giảm giá thành công", discount: updatedDiscount });
    } catch (error) {
      console.error("Error updating discount:", error.message);
      res.status(500).json({ message: "Lỗi khi cập nhật mã giảm giá", error: error.message });
    }
  }

  // Xóa mã giảm giá
  static async deleteDiscount(req, res) {
    try {
      const { id } = req.params;
      const deletedDiscount = await Discount.findByIdAndDelete(id);

      if (!deletedDiscount) {
        return res.status(404).json({ message: "Mã giảm giá không tồn tại." });
      }

      res.json({ message: "Xóa mã giảm giá thành công", discount: deletedDiscount });
    } catch (error) {
      console.error("Error deleting discount:", error.message);
      res.status(500).json({ message: "Lỗi khi xóa mã giảm giá", error: error.message });
    }
  }

  // Kiểm tra mã giảm giá hợp lệ
  static async validateDiscount(req, res) {
    try {
      const { code } = req.body;

      const discount = await Discount.findOne({ code });
      if (!discount) {
        return res.status(404).json({ message: "Mã giảm giá không tồn tại." });
      }

      const currentDate = new Date();
      if (currentDate < discount.startDate || currentDate > discount.endDate) {
        return res.status(400).json({ message: "Mã giảm giá đã hết hạn hoặc chưa được kích hoạt." });
      }

      if (discount.usedCount >= discount.maxUses) {
        return res.status(400).json({ message: "Mã giảm giá đã đạt giới hạn số lần sử dụng." });
      }

      res.json({ message: "Mã giảm giá hợp lệ", discount });
    } catch (error) {
      console.error("Error validating discount:", error.message);
      res.status(500).json({ message: "Lỗi khi kiểm tra mã giảm giá", error: error.message });
    }
  }

  // Cập nhật số lần đã sử dụng của mã giảm giá (Khi mã được sử dụng)
  static async useDiscount(req, res) {
    try {
      const { code } = req.body;

      const discount = await Discount.findOne({ code });
      if (!discount) {
        return res.status(404).json({ message: "Mã giảm giá không tồn tại." });
      }

      // Kiểm tra số lần sử dụng
      if (discount.usedCount >= discount.maxUses) {
        return res.status(400).json({ message: "Mã giảm giá đã hết số lần sử dụng." });
      }

      // Tăng số lần đã sử dụng
      discount.usedCount += 1;
      await discount.save();

      res.json({ message: "Cập nhật số lần sử dụng thành công", discount });
    } catch (error) {
      console.error("Error updating discount usage count:", error.message);
      res.status(500).json({ message: "Lỗi khi cập nhật số lần sử dụng", error: error.message });
    }
  }
}

export default DiscountController;
