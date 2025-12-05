import { queryService } from "../query/query.service.js";
import hash from "object-hash";
import { getCache, setCache } from "../../core/cache.js";

export const chartBuilder = {
  buildChart: async (chart) => {
    const cacheKey = `chart:${chart.id}:${hash(chart.queryConfig)}`;

    // CACHE CHECK
    const cached = getCache(cacheKey);
    if (cached) return { cached: true, ...cached };

    // RUN BASE QUERY ENGINE
    const result = await queryService.runQuery(
      chart.datasetId,
      chart.queryConfig
    );

    // FORMAT OUTPUT
    const formatted = formatChartData(chart, result.rows);

    // SET CACHE (TTL 60 sec)
    setCache(cacheKey, formatted, 60 * 1000);

    return { cached: false, ...formatted };
  },
};

function formatChartData(chart, rows) {
  switch (chart.type) {
    case "bar":
    case "line":
      return rows.map((r) => ({
        x: r[chart.config.xField],
        y: Number(r[chart.config.yField]),
      }));

    case "pie":
      return rows.map((r) => ({
        label: r[chart.config.labelField],
        value: Number(r[chart.config.valueField]),
      }));

    case "metric":
      return {
        value: rows.reduce((a, r) => a + Number(r[chart.config.field] || 0), 0),
      };

    case "table":
      return rows;

    default:
      throw new Error("Unknown chart type");
  }
}
