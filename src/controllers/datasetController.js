import { datasetService } from "../services/datasetService.js";

export const datasetController = {
  uploadFile: async (req, res, next) => {
    try {
      const orgId = req.headers["x-org-id"];
      const userId = req.user.id;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
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

  createFromDb: async (req, res, next) => {
    try {
      const orgId = req.headers["x-org-id"];
      const userId = req.user.id;

      const { connectionId, table } = req.body;

      if (!connectionId || !table) {
        return res
          .status(400)
          .json({ message: "connectionId and table are required" });
      }

      // cek koneksi valid
      const connection = await prisma.databaseConnection.findUnique({
        where: { id: connectionId },
      });

      if (!connection) {
        return res
          .status(404)
          .json({ message: "Database connection not found" });
      }

      // simpan dataset
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

  preview: async (req, res, next) => {
    try {
      const id = req.params.id;
      const dataset = await datasetService.getDatasetById(id);

      if (dataset.sourceType === "file") {
        const preview = await datasetService.previewFileDataset(dataset);
        return res.json(preview);
      }

      if (dataset.sourceType === "postgres") {
        // ambil connection
        const connection = await prisma.databaseConnection.findUnique({
          where: { id: dataset.config.connectionId },
        });

        const preview = await dbConnectionService.previewTable(
          connection,
          dataset.config.table
        );
        return res.json(preview);
      }

      res.status(400).json({ message: "Unsupported dataset type" });
    } catch (err) {
      next(err);
    }
  },
};
