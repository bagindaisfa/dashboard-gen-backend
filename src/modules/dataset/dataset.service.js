import prisma from "../../core/prisma.js";
import { ApiError } from "../../core/error.js";

import { datasetPreview } from "./dataset.preview.js";
import { dbDatasetPreview } from "./dataset.preview.db.js";

export const datasetService = {
  createFileDataset: async ({ orgId, userId, file }) => {
    if (!file) throw ApiError.badRequest("File is required");
    const filePath = file.path;

    return prisma.dataset.create({
      data: {
        name: file.originalname,
        orgId,
        createdBy: userId,
        sourceType: "file",
        config: {
          filePath,
          fileName: file.originalname,
        },
      },
    });
  },

  createFromDb: ({ orgId, userId, connectionId, table }) => {
    if (!connectionId || !table)
      throw ApiError.badRequest("connectionId and table are required");

    return prisma.dataset.create({
      data: {
        name: table,
        orgId,
        createdBy: userId,
        sourceType: "postgres",
        config: {
          connectionId,
          table,
        },
      },
    });
  },

  getDatasets: (orgId) => {
    return prisma.dataset.findMany({
      where: { orgId },
    });
  },

  getDatasetById: (id) => {
    return prisma.dataset.findUnique({
      where: { id },
    });
  },

  // ======================================
  // NEW PREVIEW FUNCTION (Smart Preview)
  // ======================================
  preview: async (datasetId, limit = 50) => {
    const dataset = await prisma.dataset.findUnique({
      where: { id: datasetId },
    });

    if (!dataset) throw ApiError.notFound("Dataset not found");

    // -------- FILE DATASET --------
    if (dataset.sourceType === "file") {
      return datasetPreview.previewFile(dataset.config.filePath, limit);
    }

    // -------- POSTGRES DATASET --------
    if (dataset.sourceType === "postgres") {
      const connection = await prisma.databaseConnection.findUnique({
        where: { id: dataset.config.connectionId },
      });

      const preview = await dbDatasetPreview.preview(
        connection,
        dataset.config.table,
        50
      );
      return preview;
    }

    throw ApiError.badRequest("Unsupported dataset type");
  },
};
