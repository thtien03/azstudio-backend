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
    // image: {
    //   type: String,
    // },
  },
  {
    timestamps: true,
  }
);

export const CategoryModel = mongoose.model("categories", CategorySchema);
