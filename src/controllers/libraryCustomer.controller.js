import { LibraryCustomerModel } from "../models/libraryCustomer.model.js";

class LibraryCustomerController {
  getListByUsername = async (req, res) => {
    try {
      const { username } = req.params;
      const libraryCustomers = await LibraryCustomerModel.find({
        username,
      }).populate({ path: "user", select: "username", strictPopulate: false });

      return res.status(200).json({
        data: libraryCustomers,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error. Please try again later.",
        error: error.message,
      });
    }
  };

  createLibraryCustomer = async (req, res) => {
    try {
      const { category, username, images } = req.body;

      const nameImage = `${category}_${Date.now()}_THT`;
      const formattedImages = images.map((url) => ({
        url,
        nameImage,
      }));

      const newLibraryCustomer = new LibraryCustomerModel({
        category,
        username,
        images: formattedImages,
      });

      await newLibraryCustomer.save();

      return res.status(201).json({
        message: "Library customer created successfully",
        data: newLibraryCustomer,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error. Please try again later.",
        error: error.message,
      });
    }
  };

  getImagesById = async (req, res) => {
    try {
      const { id } = req.params;
      const { sortBy } = req.query; // Get sortBy from query params
      const libraryCustomer = await LibraryCustomerModel.findById(id).select(
        "images"
      );

      if (!libraryCustomer) {
        return res.status(404).json({
          message: "Library customer not found",
        });
      }

      let images = libraryCustomer.images;

      // Sort images based on query parameter
      if (sortBy === "star") {
        images = images.sort((a, b) => b.star - a.star);
      } else if (sortBy === "comments") {
        images = images.sort((a, b) => b.comments.length - a.comments.length);
      } else if (sortBy === "createdAt") {
        images = images.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      }

      return res.status(200).json({
        data: images,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error. Please try again later.",
        error: error.message,
      });
    }
  };

  toggleImageStarStatus = async (req, res) => {
    try {
      const { id, imageId } = req.params;

      const libraryCustomer = await LibraryCustomerModel.findById(id);

      if (!libraryCustomer) {
        return res.status(404).json({
          message: "Library customer not found",
        });
      }

      const image = libraryCustomer.images.id(imageId);

      if (!image) {
        return res.status(404).json({
          message: "Image not found",
        });
      }

      image.isStar = !image.isStar;

      await libraryCustomer.save();

      return res.status(200).json({
        message: "Image star status updated successfully",
        data: image,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error. Please try again later.",
        error: error.message,
      });
    }
  };

  addCommentToImage = async (req, res) => {
    try {
      const { id, imageId } = req.params;
      const { comment } = req.body;

      const libraryCustomer = await LibraryCustomerModel.findById(id);

      if (!libraryCustomer) {
        return res.status(404).json({
          message: "Library customer not found",
        });
      }

      const image = libraryCustomer.images.id(imageId);

      if (!image) {
        return res.status(404).json({
          message: "Image not found",
        });
      }

      image.comments.push(comment);

      await libraryCustomer.save();

      return res.status(200).json({
        message: "Comment added successfully",
        data: image,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error. Please try again later.",
        error: error.message,
      });
    }
  };
}
export default new LibraryCustomerController();
