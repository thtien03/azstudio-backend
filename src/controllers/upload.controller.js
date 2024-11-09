import express from "express";
import cloudinary from "../utils/cloudinary.js";
import dotenv from "dotenv";

dotenv.config();
const { CLOUDINARY_FOLDER } = process.env;
class UploadController {
  uploadFiles = async (
    request,
    response
  ) => {
    try {
      const files = request.files ;
      if (!files || !Array.isArray(files)) {
        return response.status(400).json({ message: "Invalid images array" });
      }

      const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                upload_preset: CLOUDINARY_FOLDER,
                folder: CLOUDINARY_FOLDER,
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            )
            .end(file.buffer);
        });
      });

      const uploadResults = await Promise.all(uploadPromises);
      const imageUrls = uploadResults.map((result) => result.secure_url);

      return response.json({
        message: "Upload Successful",
        urls: imageUrls,
      });
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  };

  removeFile = async (request, response) => {
    try {
      const imageId = request.params.id;
      const myCloud = await cloudinary.uploader.destroy(
        `${CLOUDINARY_FOLDER}/${imageId}`
      );
      console.log(myCloud, imageId);
      if (myCloud.result !== "ok") {
        return response.status(500).json({ message: "Failed to delete image" });
      }
      return response.json({ message: "Delete Successful" });
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Internal server error" });
    }
  };
}

export default new UploadController();
