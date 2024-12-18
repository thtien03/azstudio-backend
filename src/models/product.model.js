import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    images: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["portfolio", "product"],
      required: true,
    },
    bannerImage: String,
  },
  {
    timestamps: true,
  }
);

export const ProductsModel = mongoose.model("products", ProductSchema);
