import AlbumController from "../controllers/album.controller.js";
import auth from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();
router.get("/", AlbumController.getListAlbums);
router.post("/", AlbumController.createAlbum);
router.put("/:id", AlbumController.updateAlbum);
router.delete("/:id", AlbumController.deleteAlbum);
router.get("/:id", AlbumController.getAlbum);

export default router;
