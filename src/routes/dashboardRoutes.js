import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { dashboardController } from "../controllers/dashboardController.js";

const router = Router();

router.post("/", authMiddleware, dashboardController.create);
router.get("/", authMiddleware, dashboardController.list);
router.get("/:id", authMiddleware, dashboardController.detail);

router.post("/:id/items", authMiddleware, dashboardController.addItem);
router.put("/items/layout", authMiddleware, dashboardController.updateLayout);
router.delete("/items", authMiddleware, dashboardController.removeItem);

router.get("/:id/run", authMiddleware, dashboardController.run);

export default router;
