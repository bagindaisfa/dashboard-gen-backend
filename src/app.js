import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

// health check
app.get("/", (req, res) => {
  res.json({ message: "DashboardGen API Running" });
});

// routes
app.use("/api", routes);

export default app;
