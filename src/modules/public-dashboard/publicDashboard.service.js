import { ApiError } from "../../core/error.js";
import prisma from "../../core/prisma.js";
import { dashboardBuilder } from "../dashboard/dashboard.builder.js";
import crypto from "crypto";

export const publicDashboardService = {
  enableSharing: async (dashboardId) => {
    const slug = crypto.randomUUID().slice(0, 8);

    return prisma.dashboard.update({
      where: { id: dashboardId },
      data: {
        public: true,
        publicId: slug,
      },
    });
  },

  disableSharing: async (dashboardId) => {
    return prisma.dashboard.update({
      where: { id: dashboardId },
      data: {
        public: false,
        publicId: null,
      },
    });
  },

  getPublicDashboard: async (slug) => {
    const dashboard = await prisma.dashboard.findFirst({
      where: {
        public: true,
        publicId: slug,
      },
      include: {
        items: true,
      },
    });

    if (!dashboard) {
      throw ApiError.notFound("Dashboard not found or not public");
    }

    return dashboardBuilder.buildDashboard(dashboard);
  },
};
