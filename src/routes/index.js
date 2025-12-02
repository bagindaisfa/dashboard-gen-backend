import { Router } from "express";
import authRoutes from "./authRoutes.js";
import organizationRoutes from "./organizationRoutes.js";

const router = Router();

router.get("/test", (req, res) => {
  res.json({ ok: true });
});

// auth
router.use("/auth", authRoutes);

//organization
router.use("/organizations", organizationRoutes);

export default router;
