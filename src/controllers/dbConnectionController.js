import prisma from "../utils/prisma.js";
import { dbConnectionService } from "../services/dbConnectionService.js";

export const dbConnectionController = {
  connectPostgres: async (req, res, next) => {
    try {
      const orgId = req.headers["x-org-id"];
      const userId = req.user.id;

      const { host, port, user, password, database } = req.body;

      const config = { host, port, user, password, database };

      const ok = await dbConnectionService.testConnection(config);

      if (!ok) {
        return res.status(400).json({ message: "Connection failed" });
      }

      const saved = await dbConnectionService.saveConnection(
        orgId,
        userId,
        config
      );

      res.json(saved);
    } catch (err) {
      next(err);
    }
  },

  getTables: async (req, res, next) => {
    try {
      const id = req.params.id;

      const connection = await prisma.databaseConnection.findUnique({
        where: { id },
      });

      const tables = await dbConnectionService.getTables(connection);

      res.json(tables);
    } catch (err) {
      next(err);
    }
  },

  getColumns: async (req, res, next) => {
    try {
      const { id, table } = req.params;

      const connection = await prisma.databaseConnection.findUnique({
        where: { id },
      });

      const columns = await dbConnectionService.getColumns(connection, table);

      res.json(columns);
    } catch (err) {
      next(err);
    }
  },

  previewTable: async (req, res, next) => {
    try {
      const { id, table } = req.params;

      const connection = await prisma.databaseConnection.findUnique({
        where: { id },
      });

      const rows = await dbConnectionService.previewTable(connection, table);

      res.json(rows);
    } catch (err) {
      next(err);
    }
  },
};
