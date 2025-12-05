import { Router } from "express";
import { queryController } from "./query.controller.js";
import { authMiddleware } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/requireRole.js";

const router = Router();

router.post(
  "/:datasetId",
  authMiddleware,
  requireRole(["owner", "editor", "viewer"]),
  queryController.runQuery
);

export default router;
