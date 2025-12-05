import { Router } from "express";
import { organizationController } from "./organization.controller.js";
import { authMiddleware } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/requireRole.js";

const router = Router();

// Create organization
router.post("/", authMiddleware, organizationController.create);

// Organizations owned by user
router.get("/", authMiddleware, organizationController.list);

// Add member (only owner)
router.post(
  "/:orgId/members",
  authMiddleware,
  requireRole(["owner"]),
  organizationController.addMember
);

// List members (owner + editor)
router.get(
  "/:orgId/members",
  authMiddleware,
  requireRole(["owner", "editor"]),
  organizationController.members
);

export default router;
