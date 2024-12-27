import LibraryCustomerController from "../controllers/libraryCustomer.controller.js";
import auth from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();
router.get("/:username", LibraryCustomerController.getListByUsername);
router.post("/:username", LibraryCustomerController.createLibraryCustomer);
router.get("/images/:id", LibraryCustomerController.getImagesById);
router.put(
  "/:id/:imageId/star",
  LibraryCustomerController.toggleImageStarStatus
);
router.put(
  "/:id/:imageId/comments",
  LibraryCustomerController.addCommentToImage
);
export default router;
