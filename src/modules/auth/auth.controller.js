import { authService } from "./auth.service.js";
import { success } from "../../core/response.js";

export const authController = {
  register: async (req, res, next) => {
    try {
      const data = await authService.register(req.body);
      return success(res, data, "Registration successful", 201);
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const data = await authService.login(req.body);
      return success(res, data, "Login successful");
    } catch (err) {
      next(err);
    }
  },

  refresh: async (req, res, next) => {
    try {
      const token = req.body.refreshToken;
      const data = await authService.refreshToken(token);
      return success(res, data, "Token refreshed");
    } catch (err) {
      next(err);
    }
  },
};
