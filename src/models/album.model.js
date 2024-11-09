import mongoose from "mongoose";

const AlbumSchema = new mongoose.Schema(
  {
    banner: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const AlbumModel = mongoose.model("albums", AlbumSchema);
