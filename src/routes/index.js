import express from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import datasetRoutes from "../modules/dataset/dataset.routes.js";
import chartRoutes from "../modules/chart/chart.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import dbRoutes from "../modules/db/dbConnection.routes.js";
import queryRoutes from "../modules/query/query.routes.js";
import organizationRoutes from "../modules/organization/organization.routes.js";
import publicDashboardRoutes from "../modules/public-dashboard/publicDashboard.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/datasets", datasetRoutes);
router.use("/charts", chartRoutes);
router.use("/dashboards", dashboardRoutes);
router.use("/db-connections", dbRoutes);
router.use("/query", queryRoutes);
router.use("/organizations", organizationRoutes);
router.use("/public-dashboard", publicDashboardRoutes);

export default router;
