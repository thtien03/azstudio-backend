import { CategoryModel } from "../models/category.model.js";

class CategoryController {
  getAllCategories = async (request, response) => {
    try {
      const categories = await CategoryModel.find();
      return response.status(200).json({ data: categories });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };

  getCategory = async (request, response) => {
    try {
      const { id } = request.params;
      const category = await CategoryModel.findById(id);
      return response.status(200).json({ data: category });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };

  createCategory = async (request, response) => {
    try {
      const { name, description } = request.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }
      // Kiểm tra xem danh mục với `name` đã tồn tại hay chưa
      const existingCategory = await CategoryModel.findOne({ name });
      if (existingCategory) {
        return response
          .status(400)
          .json({ message: "Category name must be unique" });
      }
      const category = new CategoryModel({
        name,
        description,
      });
      await category.save();
      console.log(category);
      return response
        .status(201)
        .json({ message: "Create catalog successfully", data: category });
    } catch (error) {
      if (error.code === 11000) {
        // 11000 là mã lỗi cho trùng lặp key trong MongoDB
        return response
          .status(400)
          .json({ message: "Category name must be unique" });
      }
      return response.status(500).json({ message: error.message });
    }
  };

  updateCategory = async (request, response) => {
    try {
      const { id } = request.params;
      const { name, description } = request.body;
      // Kiểm tra xem danh mục có tồn tại không
      const category = await CategoryModel.findById(id);
      if (!category) {
        return response.status(404).json({ message: "Category not found" });
      }
      // Kiểm tra nếu tên mới của danh mục bị trùng
      if (name && name !== category.name) {
        const existingCategory = await CategoryModel.findOne({ name });
        if (existingCategory) {
          return response
            .status(400)
            .json({ message: "Category name must be unique" });
        }
      }
      // Cập nhật danh mục
      category.name = name || category.name;
      category.description = description || category.description;

      await category.save();

      return response
        .status(200)
        .json({ message: "Update category successfully", data: category });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };

  deleteCategory = async (request, response) => {
    try {
      const { id } = request.params;
      await CategoryModel.findByIdAndDelete({ _id: id });
      return response
        .status(200)
        .json({ message: "Delete category successfully" });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };
}

export default new CategoryController();
