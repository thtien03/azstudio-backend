import { ServiceModel } from "../models/service.model.js";

class ServiceController {
  getAllServices = async (request, response) => {
    try {
      const services = await ServiceModel.find();
      return response.status(200).json({ data: services });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };

  createService = async (request, response) => {
    try {
      const { name, description } = request.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }
      // Kiểm tra xem danh mục với `name` đã tồn tại hay chưa
      const existingService = await ServiceModel.findOne({ name });
      if (existingService) {
        return response
          .status(400)
          .json({ message: "Service name must be unique" });
      }
      const service = new ServiceModel({
        name,
        description,
      });
      await service.save();
      console.log(service);
      return response
        .status(201)
        .json({ message: "Create service successfully", data: service });
    } catch (error) {
      if (error.code === 11000) {
        // 11000 là mã lỗi cho trùng lặp key trong MongoDB
        return response
          .status(400)
          .json({ message: "service name must be unique" });
      }
      return response.status(500).json({ message: error.message });
    }
  };

  updateService = async (request, response) => {
    try {
      const { id } = request.params;
      const { name, description } = request.body;
      // Kiểm tra xem danh mục có tồn tại không
      const service = await ServiceModel.findById(id);
      if (!service) {
        return response.status(404).json({ message: "service not found" });
      }
      // Kiểm tra nếu tên mới của danh mục bị trùng
      if (name && name !== service.name) {
        const existingService = await ServiceModel.findOne({ name });
        if (existingService) {
          return response
            .status(400)
            .json({ message: "service name must be unique" });
        }
      }
      // Cập nhật danh mục
      service.name = name || service.name;
      service.description = description || service.description;

      await service.save();

      return response
        .status(200)
        .json({ message: "Update service successfully", data: service });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };

  deleteService = async (request, response) => {
    try {
      const { id } = request.params;
      await ServiceModel.findByIdAndDelete({ _id: id });
      return response
        .status(200)
        .json({ message: "Delete service successfully" });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };
}

export default new ServiceController();
