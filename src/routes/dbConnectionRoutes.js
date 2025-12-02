import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { dbConnectionController } from "../controllers/dbConnectionController.js";

const router = Router();

router.post(
  "/connect-postgres",
  authMiddleware,
  dbConnectionController.connectPostgres
);

router.get("/:id/tables", authMiddleware, dbConnectionController.getTables);

router.get(
  "/:id/tables/:table/columns",
  authMiddleware,
  dbConnectionController.getColumns
);

router.get(
  "/:id/tables/:table/preview",
  authMiddleware,
  dbConnectionController.previewTable
);

export default router;
