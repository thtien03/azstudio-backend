import { ProductsModel } from "../models/product.model.js";
import { CategoryModel } from "../models/category.model.js";

class ProductController {
  getAllProducts = async (request, response) => {
    try {
      const { page = 1, pageSize = 10 } = request.query;
      const skip = (page - 1) * pageSize;
      const products = await ProductsModel.find()
        .populate("categoryId", "name")
        .skip(skip)
        .limit(parseInt(pageSize))
        .exec();
      return response.status(200).json({ data: products });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };

  getAllProductsByCategory = async (request, response) => {
    try {
      const { categoryId } = request.params;
      const products = await ProductsModel.find({ category: categoryId });
      return response.status(200).json({ data: products });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };

  getProduct = async (request, response) => {
    try {
      const { id } = request.params;
      const product = await ProductsModel.findById(id)
        .populate("category", "name")
        .exec();
      return response.status(200).json({ data: product });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };

  createProduct = async (request, response) => {
    try {
      const data = request.body;
      const category = await CategoryModel.findById(data.categoryId);
      if (!category) {
        return response.status(400).json({ message: "Category not found" });
      }
      const product = new ProductsModel({ ...data, category: category._id });
      await product.save();
      return response
        .status(201)
        .json({ message: "Create product successfully", data: product });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };

  updateProduct = async (request, response) => {
    try {
      const { id } = request.params;
      const { categoryId, ...updateData } = request.body;

      // Tìm sản phẩm theo ID
      const project = await ProductsModel.findById(id);
      if (!project) {
        return response.status(404).json({ message: "Product not found" });
      }

      // Kiểm tra và cập nhật danh mục nếu categoryId được cung cấp
      if (categoryId) {
        const category = await CategoryModel.findById(categoryId);
        if (!category) {
          return response.status(400).json({ message: "Category not found" });
        }
        project.category = category._id;
      }

      // Cập nhật các thuộc tính từ request.body
      Object.assign(project, updateData);
      await project.save();

      return response.status(200).json({
        message: "Update product successfully",
        data: project,
      });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };

  deleteProduct = async (request, response) => {
    try {
      const { id } = request.params;
      await ProductsModel.findByIdAndDelete({ _id: id });
      return response
        .status(200)
        .json({ message: "Delete product successfully" });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };
}

export default new ProductController();
