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

  preview: async (req, res, next) => {
    try {
      const id = req.params.id;
      const dataset = await datasetService.getDatasetById(id);

      const preview = await datasetService.previewFileDataset(dataset);

      res.json(preview);
    } catch (err) {
      next(err);
    }
  },
};
