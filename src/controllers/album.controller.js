import express from "express";
import { AlbumModel } from "../models/album.model.js";

class AlbumController {
  getListAlbums = async (request, response) => {
    try {
      const { page = 1, pageSize = 10 } = request.query;
      const limit = parseInt(pageSize);
      const skip = (parseInt(page) - 1) * limit;

      const albums = await AlbumModel.find().skip(skip).limit(limit).exec();
      const totalAlbums = await AlbumModel.countDocuments();

      return response.status(200).json({
        data: albums,
        pagination: {
          total: totalAlbums,
          page: parseInt(page),
          pageSize: limit,
          totalPages: Math.ceil(totalAlbums / limit),
        },
      });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };

  getAlbum = async (request, response) => {
    try {
      const { id } = request.params; // Lấy id của album từ URL params

      // Tìm album theo id
      const album = await AlbumModel.findById(id);

      // Kiểm tra nếu tìm thấy album
      if (album) {
        return response.status(200).json({ data: album });
      }

      // Nếu không tìm thấy album, trả về mã trạng thái 404 (Not Found)
      return response.status(404).json({ message: "Album not found" });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };

  createAlbum = async (request, response) => {
    try {
      const { banner, image } = request.body;
      if (!banner || !image || !Array.isArray(image)) {
        return response.status(400).json({
          message: "Banner is required and image must be an array of URLs.",
        });
      }

      // Tạo mới một album với dữ liệu đã nhận
      const newAlbum = new AlbumModel({
        banner,
        image,
      });
      // Lưu album vào cơ sở dữ liệu
      await newAlbum.save();
      return response.status(201).json({
        message: "Album created successfully",
        data: newAlbum,
      });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };

  updateAlbum = async (request, response) => {
    try {
      const { id } = request.params; // Lấy id của album từ URL params
      const { banner, image } = request.body; // Lấy dữ liệu từ request body

      // Tìm album theo id
      const album = await AlbumModel.findById(id);

      // Nếu tìm thấy album, thực hiện cập nhật
      if (album) {
        // Cập nhật các trường của album
        album.banner = banner || album.banner; // Cập nhật banner nếu có
        album.images = Array.isArray(image) ? image : album.images; // Đảm bảo image là một mảng URL

        // Lưu lại album sau khi cập nhật
        await album.save();

        return response
          .status(200)
          .json({ message: "Update album successfully", data: album });
      }

      // Nếu không tìm thấy album, trả về mã trạng thái 404 (Not Found)
      return response.status(404).json({ message: "Album not found" });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };

  deleteAlbum = async (request, response) => {
    try {
      const { id } = request.params; // Lấy id của album từ URL params

      // Tìm và xóa album theo id
      const deletedAlbum = await AlbumModel.findByIdAndDelete(id);

      // Kiểm tra nếu album đã được xóa thành công
      if (deletedAlbum) {
        return response
          .status(200)
          .json({ message: "Delete album successfully" });
      }

      // Nếu không tìm thấy album để xóa, trả về mã trạng thái 404 (Not Found)
      return response.status(404).json({ message: "Album not found" });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  };
}
export default new AlbumController();
