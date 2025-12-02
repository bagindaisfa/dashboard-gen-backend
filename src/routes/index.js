import { Router } from "express";
import authRoutes from "./authRoutes.js";
import organizationRoutes from "./organizationRoutes.js";
import datasetRoutes from "./datasetRoutes.js";
import queryRoutes from "./queryRoutes.js";
import dbConnectionRoutes from "./dbConnectionRoutes.js";
import chartRoutes from "./chartRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";

const router = Router();

router.get("/test", (req, res) => {
  res.json({ ok: true });
});

// auth
router.use("/auth", authRoutes);

//organization
router.use("/organizations", organizationRoutes);

//dataset
router.use("/datasets", datasetRoutes);

//query engine
router.use("/query", queryRoutes);

//db connection
router.use("/db", dbConnectionRoutes);

//chart builder
router.use("/charts", chartRoutes);

//dashboard builder
router.use("/dashboards", dashboardRoutes);

export default router;
