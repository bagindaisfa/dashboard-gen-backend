import { Router } from "express";
import { dashboardController } from "./dashboard.controller.js";
import { authMiddleware } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/requireRole.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  requireRole(["owner", "editor", "viewer"]),
  dashboardController.list
);

router.post(
  "/",
  authMiddleware,
  requireRole(["owner", "editor"]),
  dashboardController.create
);

router.get(
  "/:id",
  authMiddleware,
  requireRole(["owner", "editor", "viewer"]),
  dashboardController.getOne
);

router.put(
  "/:id",
  authMiddleware,
  requireRole(["owner", "editor"]),
  dashboardController.update
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole(["owner"]),
  dashboardController.delete
);

router.post(
  "/:dashboardId/items",
  authMiddleware,
  requireRole(["owner", "editor"]),
  dashboardController.addItem
);

router.delete(
  "/items/:itemId",
  authMiddleware,
  requireRole(["owner", "editor"]),
  dashboardController.removeItem
);

router.get(
  "/:id/build",
  authMiddleware,
  requireRole(["owner", "editor", "viewer"]),
  dashboardController.build
);

export default router;
