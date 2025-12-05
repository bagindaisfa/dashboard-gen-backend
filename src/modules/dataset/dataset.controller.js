import { datasetService } from "./dataset.service.js";
import prisma from "../../core/prisma.js";
import { dbConnectionService } from "../db/dbConnection.service.js";
import { ApiError } from "../../core/error.js";

export const datasetController = {
  uploadFile: async (req, res, next) => {
    try {
      const orgId = req.headers["x-org-id"];
      const userId = req.user.id;

      if (!req.file) {
        throw ApiError.badRequest("No file uploaded");
      }

      const dataset = await datasetService.createFileDataset({
        orgId,
        userId,
        file: req.file,
      });

      res.json(dataset);
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const orgId = req.headers["x-org-id"];
      const datasets = await datasetService.getDatasets(orgId);

      res.json(datasets);
    } catch (err) {
      next(err);
    }
  },

  preview: async (req, res, next) => {
    try {
      const id = req.params.id;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const dataset = await datasetService.getDatasetById(id);

      if (!dataset) throw ApiError.notFound("Dataset not found");

      if (dataset.sourceType === "file") {
        const preview = await datasetService.previewFileDataset(
          dataset,
          page,
          limit
        );
        return res.json(preview);
      }

      if (dataset.sourceType === "postgres") {
        const connection = await prisma.databaseConnection.findUnique({
          where: { id: dataset.config.connectionId },
        });

        if (!connection)
          throw ApiError.notFound("Database connection not found");

        const preview = await dbConnectionService.previewTable(
          connection,
          dataset.config.table,
          page,
          limit
        );

        return res.json(preview);
      }

      res.status(400).json({ message: "Unsupported dataset type" });
    } catch (err) {
      next(err);
    }
  },

  createFromDb: async (req, res, next) => {
    try {
      const orgId = req.headers["x-org-id"];
      const userId = req.user.id;

      const { connectionId, table } = req.body;

      if (!connectionId || !table) {
        throw ApiError.badRequest("connectionId and table are required");
      }

      const connection = await prisma.databaseConnection.findUnique({
        where: { id: connectionId },
      });

      if (!connection) {
        throw ApiError.notFound("Database connection not found");
      }

      const dataset = await datasetService.createFromDb({
        orgId,
        userId,
        connectionId,
        table,
      });

      res.json(dataset);
    } catch (err) {
      next(err);
    }
  },
};
