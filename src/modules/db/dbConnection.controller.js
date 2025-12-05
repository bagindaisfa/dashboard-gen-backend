import prisma from "../../core/prisma.js";
import { dbConnectionService } from "./dbConnection.service.js";
import { ApiError } from "../../core/error.js";
import { success } from "../../core/response.js";

export const dbConnectionController = {
  connectPostgres: async (req, res, next) => {
    try {
      const orgId = req.headers["x-org-id"];
      const userId = req.user.id;

      const { host, port, user, password, database } = req.body;

      if (!host || !user || !database) {
        throw ApiError.badRequest("host, user, and database are required");
      }

      const config = { host, port, user, password, database };

      const valid = await dbConnectionService.testConnection(config);

      if (!valid) {
        return res.status(400).json({ message: "Connection failed" });
      }

      const saved = await dbConnectionService.saveConnection(
        orgId,
        userId,
        config
      );

      // NEVER return the password
      const returned = {
        id: saved.id,
        orgId: saved.orgId,
        createdBy: saved.createdBy,
        type: saved.type,
        host,
        database,
        createdAt: saved.createdAt,
      };

      return success(res, returned, "Connection saved");
    } catch (err) {
      next(err);
    }
  },

  tables: async (req, res, next) => {
    try {
      const id = req.params.id;
      const connection = await prisma.databaseConnection.findUnique({
        where: { id },
      });
      if (!connection) throw ApiError.notFound("Database connection not found");

      const tables = await dbConnectionService.getTables(connection);
      return success(res, tables, "Tables fetched");
    } catch (err) {
      next(err);
    }
  },

  columns: async (req, res, next) => {
    try {
      const { id, table } = req.params;

      const connection = await prisma.databaseConnection.findUnique({
        where: { id },
      });
      if (!connection) throw ApiError.notFound("Database connection not found");

      const cols = await dbConnectionService.getColumns(connection, table);
      return success(res, cols, "Columns fetched");
    } catch (err) {
      next(err);
    }
  },

  preview: async (req, res, next) => {
    try {
      const { id, table } = req.params;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const connection = await prisma.databaseConnection.findUnique({
        where: { id },
      });
      if (!connection) throw ApiError.notFound("Database connection not found");

      const data = await dbConnectionService.previewTable(
        connection,
        table,
        page,
        limit
      );

      return success(res, data, "Table previewed");
    } catch (err) {
      next(err);
    }
  },
};
