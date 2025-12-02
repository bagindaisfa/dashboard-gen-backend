import prisma from "../utils/prisma.js";
import { queryEngine } from "../services/queryEngine.js";

export const queryController = {
  run: async (req, res, next) => {
    try {
      const { datasetId, query } = req.body;

      const dataset = await prisma.dataset.findUnique({
        where: { id: datasetId },
      });

      if (!dataset) {
        return res.status(404).json({ message: "Dataset not found" });
      }

      const result = await queryEngine.run({ dataset, query });

      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
