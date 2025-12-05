import { organizationService } from "./organization.service.js";
import { success } from "../../core/response.js";

export const organizationController = {
  create: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { name } = req.body;

      const org = await organizationService.create({
        name,
        ownerId: userId,
      });

      return success(res, org, "Organization created", 201);
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const orgs = await organizationService.listByUser(userId);

      return success(res, orgs, "Organizations listed");
    } catch (err) {
      next(err);
    }
  },

  addMember: async (req, res, next) => {
    try {
      const { orgId } = req.params;
      const { userId, role } = req.body;

      const member = await organizationService.addMember(orgId, userId, role);

      return success(res, member, "Member added");
    } catch (err) {
      next(err);
    }
  },

  members: async (req, res, next) => {
    try {
      const { orgId } = req.params;

      const list = await organizationService.listMembers(orgId);

      return success(res, list, "Members listed");
    } catch (err) {
      next(err);
    }
  },
};
