import prisma from "../utils/prisma.js";
import XLSX from "xlsx";
import fs from "fs";
import { parse } from "csv-parse";

export const datasetService = {
  createFileDataset: async ({ orgId, userId, file }) => {
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

  // === Step 13.4: Add pagination preview ===
  previewFileDataset: async (dataset, page = 1, limit = 20) => {
    const filePath = dataset.config.filePath;

    const offset = (page - 1) * limit;

    if (filePath.endsWith(".xlsx")) {
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      return {
        total: json.length,
        page,
        limit,
        rows: json.slice(offset, offset + limit),
      };
    }

    if (filePath.endsWith(".csv")) {
      const content = fs.readFileSync(filePath);

      return new Promise((resolve, reject) => {
        parse(content, { columns: true }, (err, output) => {
          if (err) reject(err);

          resolve({
            total: output.length,
            page,
            limit,
            rows: output.slice(offset, offset + limit),
          });
        });
      });
    }

    throw new Error("File type not supported");
  },

  getDatasets: (orgId) => prisma.dataset.findMany({ where: { orgId } }),
  getDatasetById: (id) => prisma.dataset.findUnique({ where: { id } }),

  createFromDb: async ({ orgId, userId, connectionId, table }) => {
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
