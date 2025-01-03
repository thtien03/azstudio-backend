import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "services", // Tham chiếu đến `ServiceModel`
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const AppointmentModel = mongoose.model(
  "appointments",
  AppointmentSchema
);
