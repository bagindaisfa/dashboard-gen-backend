import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { chartController } from "../controllers/chartController.js";
import { requireRole } from "../middlewares/permissionMiddleware.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole(["owner", "editor"]),
  chartController.create
);
router.get(
  "/",
  authMiddleware,
  requireRole(["owner", "editor", "viewer"]),
  chartController.list
);
router.get(
  "/:id",
  authMiddleware,
  requireRole(["owner", "editor", "viewer"]),
  chartController.detail
);
router.get(
  "/:id/run",
  authMiddleware,
  requireRole(["owner", "editor", "viewer"]),
  chartController.run
);
router.put(
  "/:id",
  authMiddleware,
  requireRole(["owner", "editor"]),
  chartController.update
);
router.delete(
  "/:id",
  authMiddleware,
  requireRole(["owner"]),
  chartController.delete
);

export default router;
