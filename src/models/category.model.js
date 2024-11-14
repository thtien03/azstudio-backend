import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ["portfolio", "product"],
      required: true,
    },
    // image: {
    //   type: String,
    // },
  },
  {
    timestamps: true,
  }
);

export const CategoryModel = mongoose.model("categories", CategorySchema);
