import { Router } from "express";
import { dbConnectionController } from "./dbConnection.controller.js";
import { authMiddleware } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/requireRole.js";

const router = Router();

// Create & Test Postgres Connection
router.post(
  "/connect-postgres",
  authMiddleware,
  requireRole(["owner", "editor"]),
  dbConnectionController.connectPostgres
);

// List tables
router.get(
  "/:id/tables",
  authMiddleware,
  requireRole(["owner", "editor", "viewer"]),
  dbConnectionController.tables
);

// List columns
router.get(
  "/:id/tables/:table/columns",
  authMiddleware,
  requireRole(["owner", "editor", "viewer"]),
  dbConnectionController.columns
);

// Preview table
router.get(
  "/:id/tables/:table/preview",
  authMiddleware,
  requireRole(["owner", "editor", "viewer"]),
  dbConnectionController.preview
);

export default router;
