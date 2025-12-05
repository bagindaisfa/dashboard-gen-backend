import { queryService } from "./query.service.js";
import {success } from "../../core/response.js"

export const queryController = {
  runQuery: async (req, res, next) => {
    try {
      const datasetId = req.params.datasetId;
      const query = req.body;

      const result = await queryService.runQuery(datasetId, query);

      return success(res,result,"Query run");
    } catch (err) {
      next(err);
    }
  },
};
