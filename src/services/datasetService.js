import prisma from "../utils/prisma.js";
import XLSX from "xlsx";
import fs from "fs";
import { parse } from "csv-parse";

export const datasetService = {
  createFileDataset: async ({ orgId, userId, file }) => {
    const filePath = file.path;

    const dataset = await prisma.dataset.create({
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

    return dataset;
  },

  previewFileDataset: async (dataset) => {
    const filePath = dataset.config.filePath;

    if (filePath.endsWith(".xlsx")) {
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      return json.slice(0, 20);
    }

    if (filePath.endsWith(".csv")) {
      const fileContent = fs.readFileSync(filePath);
      return new Promise((resolve, reject) => {
        parse(fileContent, { columns: true }, (err, output) => {
          if (err) reject(err);
          resolve(output.slice(0, 20));
        });
      });
    }

    throw new Error("File type not supported");
  },

  getDatasets: (orgId) => {
    return prisma.dataset.findMany({ where: { orgId } });
  },

  getDatasetById: (id) => {
    return prisma.dataset.findUnique({ where: { id } });
  },
};
