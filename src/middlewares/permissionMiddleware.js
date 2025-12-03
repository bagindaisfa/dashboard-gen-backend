import prisma from "../utils/prisma.js";

export const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const orgId = req.headers["x-org-id"];
      const userId = req.user.id;

      const membership = await prisma.organizationMember.findFirst({
        where: { userId, orgId },
      });

      if (!membership) {
        return res
          .status(403)
          .json({ message: "Not a member of organization" });
      }

      if (!allowedRoles.includes(membership.role)) {
        return res.status(403).json({ message: "Permission denied" });
      }

      req.membership = membership;
      next();
    } catch (err) {
      next(err);
    }
  };
};
