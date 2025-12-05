import prisma from "../../core/prisma.js";
import { loadFileRows } from "./dataset.parser.js";
import { ApiError } from "../../core/error.js";

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

  previewFileDataset: async (dataset, page = 1, limit = 20) => {
    if (!dataset) throw ApiError.notFound("Dataset not found");
    const rows = loadFileRows(dataset.config.filePath);
    const total = rows.length;
    const offset = (page - 1) * limit;

    return {
      page,
      limit,
      total,
      rows: rows.slice(offset, offset + limit),
    };
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
};
