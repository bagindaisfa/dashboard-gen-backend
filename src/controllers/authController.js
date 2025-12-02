import { authService } from "../services/authService.js";

export const authController = {
  register: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      const result = await authService.register({
        name,
        email,
        password,
      });

      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const result = await authService.login({
        email,
        password,
      });

      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      const result = await authService.refreshToken(refreshToken);

      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
