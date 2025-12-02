import { organizationService } from "../services/organizationService.js";

export const organizationController = {
  getMyOrganizations: async (req, res, next) => {
    try {
      const userId = req.user.id;

      const orgs = await organizationService.getMyOrganizations(userId);

      res.json(orgs);
    } catch (err) {
      next(err);
    }
  },

  createOrganization: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { name } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ message: "Organization name is required" });
      }

      const org = await organizationService.createOrganization(userId, name);

      res.json(org);
    } catch (err) {
      next(err);
    }
  },
};
