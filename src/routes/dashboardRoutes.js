import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { dashboardController } from "../controllers/dashboardController.js";
import { requireRole } from "../middlewares/permissionMiddleware.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole(["owner", "editor"]),
  dashboardController.create
);
router.get(
  "/",
  authMiddleware,
  requireRole(["owner", "editor", "viewer"]),
  dashboardController.list
);
router.get(
  "/:id",
  authMiddleware,
  requireRole(["owner", "editor", "viewer"]),
  dashboardController.detail
);

router.post(
  "/:id/items",
  authMiddleware,
  requireRole(["owner", "editor"]),
  dashboardController.addItem
);
router.put(
  "/items/layout",
  authMiddleware,
  requireRole(["owner", "editor"]),
  dashboardController.updateLayout
);
router.delete(
  "/items",
  authMiddleware,
  requireRole(["owner", "editor"]),
  dashboardController.removeItem
);

router.get(
  "/:id/run",
  authMiddleware,
  requireRole(["owner", "editor", "viewer"]),
  dashboardController.run
);

// Public enable-disable (protected)
router.post(
  "/:id/public",
  authMiddleware,
  requireRole(["owner"]),
  dashboardController.enablePublic
);
router.delete(
  "/:id/public",
  authMiddleware,
  requireRole(["owner"]),
  dashboardController.disablePublic
);

// PUBLIC ROUTES (no auth needed)
router.get("/public/:publicId", dashboardController.publicDetail);
router.get("/public/:publicId/run", dashboardController.publicRun);

export default router;
