import prisma from "../../core/prisma.js";
import { chartBuilder } from "./chart.builder.js";
import { ApiError } from "../../core/error.js";

export const chartService = {
  create: (data) => {
    return prisma.chart.create({ data });
  },

  update: (id, data) => {
    return prisma.chart.update({
      where: { id },
      data,
    });
  },

  delete: (id) => {
    return prisma.chart.delete({ where: { id } });
  },

  listByOrg: (orgId) => {
    return prisma.chart.findMany({
      where: { orgId },
    });
  },

  getById: (id) => {
    return prisma.chart.findUnique({ where: { id } });
  },

  buildChart: async (id) => {
    const chart = await prisma.chart.findUnique({
      where: { id },
    });

    if (!chart) throw ApiError.notFound("Chart not found");

    return chartBuilder.buildChart(chart);
  },
};
