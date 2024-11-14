import { AppointmentModel } from "../models/appointment.modal.js";
import { ServiceModel } from "../models/service.model.js";

class AppointmentController {
  getListAppointments = async (request, response) => {
    try {
      const listAppointments = await AppointmentModel.find();
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
      return response
        .status(201)
        .json({ message: "Send appointment successfully", data: appointment });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };
}

export default new AppointmentController();
