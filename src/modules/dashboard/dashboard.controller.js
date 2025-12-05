import { dashboardService } from "./dashboard.service.js";
import { ApiError } from "../../core/error.js";

export const dashboardController = {
  create: async (req, res, next) => {
    try {
      const orgId = req.headers["x-org-id"];
      const userId = req.user.id;

      const payload = {
        orgId,
        createdBy: userId,
        name: req.body.name,
      };

      const dashboard = await dashboardService.create(payload);
      res.json(dashboard);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const dashboard = await dashboardService.update(req.params.id, req.body);
      res.json(dashboard);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await dashboardService.delete(req.params.id);
      res.json({ message: "Dashboard deleted" });
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const orgId = req.headers["x-org-id"];
      const dashboards = await dashboardService.listByOrg(orgId);

      res.json(dashboards);
    } catch (err) {
      next(err);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const dashboard = await dashboardService.getById(req.params.id);
      if (!dashboard) throw ApiError.notFound("Dashboard not found");
      res.json(dashboard);
    } catch (err) {
      next(err);
    }
  },

  addItem: async (req, res, next) => {
    try {
      const { dashboardId } = req.params;
      const { chartId, layout } = req.body;

      const item = await dashboardService.addItem(dashboardId, chartId, layout);
      res.json(item);
    } catch (err) {
      next(err);
    }
  },

  removeItem: async (req, res, next) => {
    try {
      await dashboardService.removeItem(req.params.itemId);
      res.json({ message: "Item removed" });
    } catch (err) {
      next(err);
    }
  },

  build: async (req, res, next) => {
    try {
      const output = await dashboardService.build(req.params.id);
      res.json(output);
    } catch (err) {
      next(err);
    }
  },
};
