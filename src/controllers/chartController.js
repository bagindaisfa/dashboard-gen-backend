import { chartService } from "../services/chartService.js";

export const chartController = {
  create: async (req, res, next) => {
    try {
      const orgId = req.headers["x-org-id"];
      const userId = req.user.id;

      const { datasetId, title, type, config } = req.body;

      const chart = await chartService.createChart({
        orgId,
        createdBy: userId,
        datasetId,
        title,
        type,
        config,
      });

      res.json(chart);
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const orgId = req.headers["x-org-id"];
      const charts = await chartService.getCharts(orgId);
      res.json(charts);
    } catch (err) {
      next(err);
    }
  },

  detail: async (req, res, next) => {
    try {
      const chart = await chartService.getChartById(req.params.id);
      res.json(chart);
    } catch (err) {
      next(err);
    }
  },

  run: async (req, res, next) => {
    try {
      const chart = await chartService.getChartById(req.params.id);

      const result = await chartService.runChart(chart);

      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const chart = await chartService.updateChart(req.params.id, req.body);
      res.json(chart);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await chartService.deleteChart(req.params.id);
      res.json({ message: "Chart deleted" });
    } catch (err) {
      next(err);
    }
  },
};
