import { Router } from "express";
import { datasetController } from "./dataset.controller.js";
import multer from "../../config/multer.js";
import { authMiddleware } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/requireRole.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  requireRole(["owner", "editor", "viewer"]),
  datasetController.list
);

router.post(
  "/upload",
  authMiddleware,
  requireRole(["owner", "editor"]),
  multer.single("file"),
  datasetController.uploadFile
);

router.post(
  "/from-db",
  authMiddleware,
  requireRole(["owner", "editor"]),
  datasetController.createFromDb
);

router.get(
  "/:id/preview",
  authMiddleware,
  requireRole(["owner", "editor", "viewer"]),
  datasetController.preview
);

export default router;
