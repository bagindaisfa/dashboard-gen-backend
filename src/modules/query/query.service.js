import prisma from "../../core/prisma.js";
import { fileQueryEngine } from "./query.file-engine.js";
import { dbQueryEngine } from "./query.db-engine.js";
import hash from "object-hash";
import { cache } from "../../core/cache.js";
import { ApiError } from "../../core/error.js";
import { buildQuerySignature } from "./query.signature.js";

export const queryService = {
  runQuery: async (datasetId, query) => {
    const signature = buildQuerySignature(datasetId, query);

    // 1. Check cache first
    const cached = cache.get(signature);
    if (cached) {
      return {
        ...cached,
        fromCache: true,
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
    cache.set(signature, result, 60_000); // 1 minute TTL

    return {
      ...result,
      fromCache: false,
    };
  },
};
