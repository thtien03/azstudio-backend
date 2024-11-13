import multer from "multer";
import UploadController from "../controllers/upload.controller.js";
import auth from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();

const MAX_FILE_SIZE = 300 * 1024; // 300KB

// Cấu hình multer
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: MAX_FILE_SIZE } });

router.post(
  "/upload",
  auth,
  upload.array("files"),
  UploadController.uploadFiles
);
router.delete("/remove/:id", auth, UploadController.removeFile);

export default router;
