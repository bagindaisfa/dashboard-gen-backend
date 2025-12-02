import { Router } from "express";
import multer from "multer";
import { datasetController } from "../controllers/datasetController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

const upload = multer({ dest: "uploads/" });

router.get("/", authMiddleware, datasetController.list);
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  datasetController.uploadFile
);
router.get("/:id/preview", authMiddleware, datasetController.preview);

router.post("/from-db", authMiddleware, datasetController.createFromDb);

export default router;
