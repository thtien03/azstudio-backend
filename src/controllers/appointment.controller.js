import { AppointmentModel } from "../models/appointment.modal.js";
import { ServiceModel } from "../models/service.model.js";

class AppointmentController {
  getListAppointments = async (request, response) => {
    try {
      const { page = 1, pageSize = 10 } = request.query;
      const skip = (page - 1) * pageSize;
      const listAppointments = await AppointmentModel.find()
        .skip(skip)
        .limit(parseInt(pageSize));
      return response.status(200).json({ data: listAppointments });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };

  getAppointment = async (request, response) => {
    try {
      const { id } = request.params;
      const appointment = await AppointmentModel.findById(id);
      return response.status(200).json({ data: appointment });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };

  createAppointment = async (request, response) => {
    try {
      const data = request.body;
      const service = await ServiceModel.findById(data.serviceId);
      if (!service) {
        return response.status(400).json({ message: "Service not found" });
      }
      const appointment = new AppointmentModel({
        ...data,
        service: service._id,
      });
      await appointment.save();
      // // Emit a Socket.IO event
      // const io = request.app.get("socketio");
      // io.emit("newAppointment", {
      //   message: "Một cuộc hẹn mới được tạo",
      //   data: appointment,
      // });

      return response
        .status(201)
        .json({ message: "Send appointment successfully", data: appointment });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };

  approvedAppointment = async (request, response) => {
    try {
      const { id } = request.params;
      const appointment = await AppointmentModel.findById(id);
      if (!appointment) {
        return response.status(404).json({ message: "Appointment not found" });
      }
      if (appointment.status !== "pending") {
        return response
          .status(400)
          .json({ message: "Appointment is not pending" });
      }
      appointment.status = "approved";
      await appointment.save();
      return response
        .status(200)
        .json({ message: "Appointment approved", data: appointment });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };
  rejectAppointment = async (request, response) => {
    try {
      const { id } = request.params;
      const appointment = await AppointmentModel.findById(id);
      if (!appointment) {
        return response.status(404).json({ message: "Appointment not found" });
      }
      if (appointment.status !== "pending") {
        return response
          .status(400)
          .json({ message: "Appointment is not pending" });
      }
      appointment.status = "rejected";
      await appointment.save();
      return response
        .status(200)
        .json({ message: "Appointment rejected", data: appointment });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };
}

export default new AppointmentController();
