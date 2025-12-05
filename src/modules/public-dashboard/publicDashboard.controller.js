import { publicDashboardService } from "./publicDashboard.service.js";

export const publicDashboardController = {
  enableSharing: async (req, res, next) => {
    try {
      const { id } = req.params;
      const dashboard = await publicDashboardService.enableSharing(id);

      res.json({
        message: "Public sharing enabled",
        publicId: dashboard.publicId,
        link: `/public-dashboard/${dashboard.publicId}`,
      });
    } catch (err) {
      next(err);
    }
  },

  disableSharing: async (req, res, next) => {
    try {
      await publicDashboardService.disableSharing(req.params.id);
      res.json({ message: "Public sharing disabled" });
    } catch (err) {
      next(err);
    }
  },

  viewPublic: async (req, res, next) => {
    try {
      const slug = req.params.slug;
      const data = await publicDashboardService.getPublicDashboard(slug);

      res.json({
        dashboardId: slug,
        ...data,
      });
    } catch (err) {
      next(err);
    }
  },
};
