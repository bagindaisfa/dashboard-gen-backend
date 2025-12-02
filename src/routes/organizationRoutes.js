import { Router } from "express";
import { organizationController } from "../controllers/organizationController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, organizationController.getMyOrganizations);
router.post("/", authMiddleware, organizationController.createOrganization);

export default router;
