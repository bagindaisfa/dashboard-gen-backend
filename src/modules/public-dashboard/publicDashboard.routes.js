import { Router } from "express";
import { publicDashboardController } from "./publicDashboard.controller.js";
import { authMiddleware } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/requireRole.js";

const router = Router();

// Activate sharing
router.post(
  "/:id/share",
  authMiddleware,
  requireRole(["owner", "editor"]),
  publicDashboardController.enableSharing
);

// Disable sharing
router.post(
  "/:id/unshare",
  authMiddleware,
  requireRole(["owner", "editor"]),
  publicDashboardController.disableSharing
);

// Public access (no auth)
router.get("/view/:slug", publicDashboardController.viewPublic);

export default router;
