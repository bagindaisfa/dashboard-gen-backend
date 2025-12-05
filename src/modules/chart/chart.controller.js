import { chartService } from "./chart.service.js";

export const chartController = {
  create: async (req, res, next) => {
    try {
      const orgId = req.headers["x-org-id"];
      const userId = req.user.id;

      const payload = {
        orgId,
        createdBy: userId,
        datasetId: req.body.datasetId,
        name: req.body.name,
        type: req.body.type,
        config: req.body.config,
        queryConfig: req.body.queryConfig,
      };

      const chart = await chartService.create(payload);
      res.json(chart);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const chart = await chartService.update(req.params.id, req.body);
      res.json(chart);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await chartService.delete(req.params.id);
      res.json({ message: "Chart deleted" });
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const orgId = req.headers["x-org-id"];
      const charts = await chartService.listByOrg(orgId);
      res.json(charts);
    } catch (err) {
      next(err);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const chart = await chartService.getById(req.params.id);
      res.json(chart);
    } catch (err) {
      next(err);
    }
  },

  build: async (req, res, next) => {
    try {
      const result = await chartService.buildChart(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
