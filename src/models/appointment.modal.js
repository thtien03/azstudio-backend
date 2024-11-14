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
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "services", // Tham chiếu đến `ServiceModel`
      required: true,
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
