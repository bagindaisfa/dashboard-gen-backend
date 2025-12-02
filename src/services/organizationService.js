import prisma from "../utils/prisma.js";

export const organizationService = {
  getMyOrganizations: async (userId) => {
    return prisma.organizationMember.findMany({
      where: { userId },
      include: {
        org: true,
      },
    });
  },

  createOrganization: async (userId, name) => {
    const org = await prisma.organization.create({
      data: {
        name,
        ownerId: userId,
      },
    });

    // Add creator as OWNER in the organization
    await prisma.organizationMember.create({
      data: {
        orgId: org.id,
        userId,
        role: "owner",
      },
    });

    return org;
  },
};
