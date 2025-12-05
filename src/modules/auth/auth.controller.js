import { authService } from "./auth.service.js";

export const authController = {
  register: async (req, res, next) => {
    try {
      const data = await authService.register(req.body);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const data = await authService.login(req.body);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  refresh: async (req, res, next) => {
    try {
      const token = req.body.refreshToken;
      const data = await authService.refreshToken(token);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
};
