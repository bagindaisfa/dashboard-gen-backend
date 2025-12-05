import prisma from "../../core/prisma.js";
import { ApiError } from "../../core/error.js";

export const organizationService = {
  create: (data) => {
    return prisma.organization.create({ data });
  },

  listByUser: (userId) => {
    return prisma.organization.findMany({
      where: { ownerId: userId },
    });
  },

  addMember: async (orgId, userId, role) => {
    const exists = await prisma.organizationMember.findFirst({
      where: { orgId, userId },
    });

    if (exists) {
      const err = new ApiError.conflict(
        "User already a member of this organization"
      );
      err.status = 400;
      throw err;
    }

    return prisma.organizationMember.create({
      data: {
        orgId,
        userId,
        role,
      },
    });
  },

  listMembers: (orgId) => {
    return prisma.organizationMember.findMany({
      where: { orgId },
      include: {
        user: true,
      },
    });
  },
};
