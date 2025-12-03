import rateLimit from "express-rate-limit";

export const dashboardRateLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 detik
  max: 20, // max 20 request
  message: "Too many requests, slow down",
});
