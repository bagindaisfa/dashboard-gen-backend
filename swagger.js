// swagger.js
import swaggerAutogen from "swagger-autogen";
import prismaSchema from "./prisma/json-schema/json-schema.json" assert { type: "json" };

const doc = {
  info: {
    title: "DashboardGen API",
    description:
      "Auto-generated Swagger documentation for DashboardGen backend.",
    version: "1.0.0",
  },

  host: "localhost:4000",
  schemes: ["http"],
  basePath: "/",

  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: prismaSchema.definitions, // 🔥 Semua model Prisma otomatis
  },
};

const outputFile = "./swagger-output.json";
const routes = ["./src/app.js"]; // file utama yang memuat semua route

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc).then(() => {
  console.log("✅ Swagger JSON generated.");
});
