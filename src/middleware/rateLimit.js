import rateLimit from "express-rate-limit";

export const dashboardRateLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 20,
  message: { success: false, message: "Too many requests, slow down" },
});

export const queryRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 20, // maksimal 20 query per menit per user/IP
  message: {
    success: false,
    message: "Too many requests. Slow down.",
  },
});
