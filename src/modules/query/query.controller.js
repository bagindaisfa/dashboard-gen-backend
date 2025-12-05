import { queryService } from "./query.service.js";

export const queryController = {
  runQuery: async (req, res, next) => {
    try {
      const datasetId = req.params.datasetId;
      const query = req.body;

      const result = await queryService.runQuery(datasetId, query);

      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
