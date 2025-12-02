import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { queryController } from "../controllers/queryController.js";

const router = Router();

router.post("/run", authMiddleware, queryController.run);

export default router;
