import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { chartController } from "../controllers/chartController.js";

const router = Router();

router.post("/", authMiddleware, chartController.create);
router.get("/", authMiddleware, chartController.list);
router.get("/:id", authMiddleware, chartController.detail);
router.get("/:id/run", authMiddleware, chartController.run);
router.put("/:id", authMiddleware, chartController.update);
router.delete("/:id", authMiddleware, chartController.delete);

export default router;
