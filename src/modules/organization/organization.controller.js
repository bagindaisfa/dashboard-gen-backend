import { organizationService } from "./organization.service.js";

export const organizationController = {
  create: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { name } = req.body;

      const org = await organizationService.create({
        name,
        ownerId: userId,
      });

      res.json(org);
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const orgs = await organizationService.listByUser(userId);

      res.json(orgs);
    } catch (err) {
      next(err);
    }
  },

  addMember: async (req, res, next) => {
    try {
      const { orgId } = req.params;
      const { userId, role } = req.body;

      const member = await organizationService.addMember(orgId, userId, role);

      res.json(member);
    } catch (err) {
      next(err);
    }
  },

  members: async (req, res, next) => {
    try {
      const { orgId } = req.params;

      const list = await organizationService.listMembers(orgId);

      res.json(list);
    } catch (err) {
      next(err);
    }
  },
};
