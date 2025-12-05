import prisma from "../../core/prisma.js";
import { dashboardBuilder } from "./dashboard.builder.js";
import { ApiError } from "../../core/error.js";

export const dashboardService = {
  create: (data) => {
    return prisma.dashboard.create({ data });
  },

  update: (id, data) => {
    return prisma.dashboard.update({
      where: { id },
      data,
    });
  },

  delete: (id) => {
    return prisma.dashboard.delete({ where: { id } });
  },

  listByOrg: (orgId) => {
    return prisma.dashboard.findMany({
      where: { orgId },
    });
  },

  getById: (id) => {
    return prisma.dashboard.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  },

  addItem: (dashboardId, chartId, layout) => {
    return prisma.dashboardItem.create({
      data: { dashboardId, chartId, layout },
    });
  },

  removeItem: (itemId) => {
    return prisma.dashboardItem.delete({ where: { id: itemId } });
  },

  build: async (id) => {
    const dashboard = await prisma.dashboard.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!dashboard) throw ApiError.notFound("Dashboard not found");

    return dashboardBuilder.buildDashboard(dashboard);
  },
};
