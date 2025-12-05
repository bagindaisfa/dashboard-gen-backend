import prisma from "../../core/prisma.js";
import { fileQueryEngine } from "./query.file-engine.js";
import { dbQueryEngine } from "./query.db-engine.js";
import hash from "object-hash";
import { getCache, setCache } from "../../core/cache.js";
import { ApiError } from "../../core/error.js";

export const queryService = {
  runQuery: async (datasetId, query) => {
    const cacheKey = `query:${datasetId}:${hash(query)}`;

    // 1. TRY CACHE
    const cached = getCache(cacheKey);
    if (cached) {
      return {
        cached: true,
        ...cached,
      };
    }

    // 2. Load dataset metadata
    const dataset = await prisma.dataset.findUnique({
      where: { id: datasetId },
    });
    if (!dataset) throw ApiError.notFound("Dataset not found");

    // 3. Execute query
    let result;

    if (dataset.sourceType === "file") {
      result = fileQueryEngine.run({ dataset, query });
    } else if (dataset.sourceType === "postgres") {
      const connection = await prisma.databaseConnection.findUnique({
        where: { id: dataset.config.connectionId },
      });

      if (!connection) throw ApiError.notFound("Database connection not found");

      result = await dbQueryEngine.run({ dataset, query, connection });
    } else {
      throw ApiError.badRequest("Unsupported dataset type");
    }

    // 4. SET CACHE (TTL 30 seconds)
    setCache(cacheKey, result, 30 * 1000);

    return {
      cached: false,
      ...result,
    };
  },
};
