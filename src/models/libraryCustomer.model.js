import mongoose from "mongoose";

const LibraryCustomerSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    username: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: true,
    },
    images: [
      {
        nameImage: {
          type: String,
        },
        url: {
          type: String,
          required: true,
        },
        isStar: {
          type: Boolean,
          default: false,
        },
        size: {
          type: String,
        },
        comments: [
          {
            text: String,
            date: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const LibraryCustomerModel = mongoose.model(
  "librarycustomers",
  LibraryCustomerSchema
);
