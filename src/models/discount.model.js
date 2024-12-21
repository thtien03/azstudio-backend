import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Mã giảm giá là bắt buộc"],
    unique: true,
    index: true, // Tăng tốc tìm kiếm
  },
  value: {
    type: Number,
    required: [true, "Giá trị giảm là bắt buộc"],
    min: [0, "Giá trị giảm không được nhỏ hơn 0"],
    max: [100, "Giá trị giảm không được lớn hơn 100"],
    validate: {
      validator: Number.isInteger,
      message: "Giá trị giảm phải là số nguyên",
    },
  },
  maxDiscount: {
    type: Number,
    required: [true, "Số tiền giảm tối đa là bắt buộc"],
  },
  maxUses: {
    type: Number,
    required: [true, "Số lần mã được sử dụng tối đa là bắt buộc"],
  },
  usedCount: {
    type: Number,
    default: 0,
    immutable: true, // Không cho phép sửa đổi giá trị mặc định
  },
  startDate: {
    type: Date,
    required: [true, "Thời gian bắt đầu là bắt buộc"],
  },
  endDate: {
    type: Date,
    required: [true, "Thời gian kết thúc là bắt buộc"],
    validate: {
      validator: function (value) {
        return this.startDate && value > this.startDate;
      },
      message: "Thời gian kết thúc phải sau thời gian bắt đầu",
    },
  },
});

const Discount = mongoose.model("Discount", discountSchema);

export default Discount;
