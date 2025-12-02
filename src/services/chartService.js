import prisma from "../utils/prisma.js";
import { queryEngine } from "./queryEngine.js";

export const chartService = {
  createChart: (data) => {
    return prisma.chart.create({ data });
  },

  getCharts: (orgId) => {
    return prisma.chart.findMany({
      where: { orgId },
      include: { dataset: true },
    });
  },

  getChartById: (id) => {
    return prisma.chart.findUnique({
      where: { id },
      include: { dataset: true },
    });
  },

  updateChart: (id, data) => {
    return prisma.chart.update({
      where: { id },
      data,
    });
  },

  deleteChart: (id) => {
    return prisma.chart.delete({
      where: { id },
    });
  },

  runChart: async (chart) => {
    const dataset = chart.dataset;

    const query = chart.config;

    const result = await queryEngine.run({
      dataset,
      query,
    });

    return result;
  },
};
