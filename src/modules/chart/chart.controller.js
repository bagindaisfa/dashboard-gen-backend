import { chartService } from "./chart.service.js";
import { success } from "../../core/response.js";

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
      return success(res,chart,"Chart created");
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const chart = await chartService.update(req.params.id, req.body);
      return success(res,chart,"Chart updated");
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await chartService.delete(req.params.id);
      return success(res,{ message: "Chart deleted" });
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const orgId = req.headers["x-org-id"];
      const charts = await chartService.listByOrg(orgId);
      return success(res,charts);
    } catch (err) {
      next(err);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const chart = await chartService.getById(req.params.id);
      return success(res,chart,"Chart fetched");
    } catch (err) {
      next(err);
    }
  },

  build: async (req, res, next) => {
    try {
      const result = await chartService.buildChart(req.params.id);
      return success(res,result,"Chart built");
    } catch (err) {
      next(err);
    }
  },
};
