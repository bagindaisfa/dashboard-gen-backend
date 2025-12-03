import prisma from "../utils/prisma.js";
import { chartService } from "./chartService.js";
import { cache } from "../utils/cache.js";

export const dashboardService = {
  createDashboard: (data) => {
    return prisma.dashboard.create({
      data,
    });
  },

  listDashboards: (orgId) => {
    return prisma.dashboard.findMany({
      where: { orgId },
    });
  },

  getDashboard: (id) => {
    return prisma.dashboard.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            chart: true,
          },
        },
      },
    });
  },

  addChartToDashboard: (dashboardId, chartId, layout) => {
    return prisma.dashboardItem.create({
      data: {
        dashboardId,
        chartId,
        ...layout,
      },
    });
  },

  updateItemLayout: (itemId, layout) => {
    return prisma.dashboardItem.update({
      where: { id: itemId },
      data: layout,
    });
  },

  removeItem: (itemId) => {
    return prisma.dashboardItem.delete({
      where: { id: itemId },
    });
  },

  runDashboard: async (dashboard) => {
    const cacheKey = `dashboard-run:${dashboard.id}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const items = dashboard.items;
    const results = [];

    for (const item of items) {
      const chart = await chartService.getChartById(item.chartId);
      const data = await chartService.runChart(chart);

      results.push({
        itemId: item.id,
        layout: { x: item.x, y: item.y, w: item.w, h: item.h },
        chart,
        data,
      });
    }
    cache.set(cacheKey, results, 30000);
    return results;
  },

  enablePublic: async (id) => {
    return prisma.dashboard.update({
      where: { id },
      data: {
        public: true,
        publicId: uuid(),
      },
    });
  },

  disablePublic: async (id) => {
    return prisma.dashboard.update({
      where: { id },
      data: {
        public: false,
        publicId: null,
      },
    });
  },

  getByPublicId: (publicId) => {
    return prisma.dashboard.findUnique({
      where: { publicId },
      include: {
        items: { include: { chart: true } },
      },
    });
  },
};
