import { chartService } from "../chart/chart.service.js";
import { getCache, setCache } from "../../core/cache.js";
import hash from "object-hash";

export const dashboardBuilder = {
  buildDashboard: async (dashboard) => {
    const cacheKey = `dashboard:${dashboard.id}:${hash(dashboard.items)}`;

    // 1. Try cache
    const cached = getCache(cacheKey);
    if (cached) {
      return {
        cached: true,
        items: cached,
      };
    }

    // 2. Build items
    const results = [];

    for (const item of dashboard.items) {
      const chart = await chartService.getById(item.chartId);
      const chartData = await chartService.buildChart(item.chartId);

      results.push({
        chartId: item.chartId,
        layout: item.layout,
        name: chart.name,
        type: chart.type,
        data: chartData,
      });
    }

    // 3. Set cache (TTL 60 seconds)
    setCache(cacheKey, results, 60 * 1000);

    return {
      cached: false,
      items: results,
    };
  },
};
