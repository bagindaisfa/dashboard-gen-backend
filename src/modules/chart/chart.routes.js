import { Router } from "express";
import { chartController } from "./chart.controller.js";
import { authMiddleware } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/requireRole.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  requireRole(["owner", "editor", "viewer"]),
  chartController.list
);

router.post(
  "/",
  authMiddleware,
  requireRole(["owner", "editor"]),
  chartController.create
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

router.get(
  "/:id",
  authMiddleware,
  requireRole(["owner", "editor", "viewer"]),
  chartController.getOne
);

router.get(
  "/:id/build",
  authMiddleware,
  requireRole(["owner", "editor", "viewer"]),
  chartController.build
);

export default router;
