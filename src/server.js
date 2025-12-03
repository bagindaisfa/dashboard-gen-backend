import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`📘 Swagger running at http://localhost:${PORT}/api/docs`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
