import prisma from "../core/prisma.js";

export const requireRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const orgId = req.headers["x-org-id"];
      if (!orgId)
        return res.status(400).json({ message: "Missing x-org-id header" });

      const membership = await prisma.organizationMember.findFirst({
        where: { userId: req.user.id, orgId },
      });
      if (!membership)
        return res
          .status(403)
          .json({ message: "Not a member of organization" });

      if (!allowedRoles.includes(membership.role))
        return res.status(403).json({ message: "Permission denied" });

      req.membership = membership;
      next();
    } catch (err) {
      next(err);
    }
  };
};
