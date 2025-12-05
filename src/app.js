import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger-output.json" assert { type: "json" };
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { apiErrorHandler } from "./core/error.js";

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// health check
app.get("/", (req, res) => {
  res.json({ message: "DashboardGen API Running" });
});

// routes
app.use("/api", routes);

app.use(apiErrorHandler);

export default app;
