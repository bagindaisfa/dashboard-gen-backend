import { dashboardService } from "../services/dashboardService.js";

export const dashboardController = {
  create: async (req, res, next) => {
    try {
      const orgId = req.headers["x-org-id"];
      const userId = req.user.id;
      const { title } = req.body;

      const dashboard = await dashboardService.createDashboard({
        orgId,
        createdBy: userId,
        title,
      });

      res.json(dashboard);
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const orgId = req.headers["x-org-id"];
      const dashboards = await dashboardService.listDashboards(orgId);

      res.json(dashboards);
    } catch (err) {
      next(err);
    }
  },

  detail: async (req, res, next) => {
    try {
      const dashboard = await dashboardService.getDashboard(req.params.id);

      res.json(dashboard);
    } catch (err) {
      next(err);
    }
  },

  addItem: async (req, res, next) => {
    try {
      const { chartId, x, y, w, h } = req.body;
      const { id } = req.params;

      const item = await dashboardService.addChartToDashboard(id, chartId, {
        x,
        y,
        w,
        h,
      });

      res.json(item);
    } catch (err) {
      next(err);
    }
  },

  updateLayout: async (req, res, next) => {
    try {
      const { itemId, layout } = req.body;

      const item = await dashboardService.updateItemLayout(itemId, layout);

      res.json(item);
    } catch (err) {
      next(err);
    }
  },

  removeItem: async (req, res, next) => {
    try {
      const { itemId } = req.body;

      await dashboardService.removeItem(itemId);

      res.json({ message: "Removed" });
    } catch (err) {
      next(err);
    }
  },

  run: async (req, res, next) => {
    try {
      const dashboard = await dashboardService.getDashboard(req.params.id);

      const result = await dashboardService.runDashboard(dashboard);

      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  enablePublic: async (req, res, next) => {
    try {
      const { id } = req.params;

      const dashboard = await dashboardService.enablePublic(id);

      res.json({
        message: "Public access enabled",
        publicUrl: `/api/public/dashboard/${dashboard.publicId}`,
      });
    } catch (err) {
      next(err);
    }
  },

  disablePublic: async (req, res, next) => {
    try {
      const { id } = req.params;

      await dashboardService.disablePublic(id);

      res.json({ message: "Public access disabled" });
    } catch (err) {
      next(err);
    }
  },

  publicDetail: async (req, res, next) => {
    try {
      const publicId = req.params.publicId;

      const dashboard = await dashboardService.getByPublicId(publicId);

      if (!dashboard || !dashboard.public) {
        return res.status(404).json({ message: "Dashboard not found" });
      }

      res.json(dashboard);
    } catch (err) {
      next(err);
    }
  },

  publicRun: async (req, res, next) => {
    try {
      const publicId = req.params.publicId;

      const dashboard = await dashboardService.getByPublicId(publicId);

      if (!dashboard || !dashboard.public) {
        return res.status(404).json({ message: "Dashboard not found" });
      }

      const result = await dashboardService.runDashboard(dashboard);

      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
