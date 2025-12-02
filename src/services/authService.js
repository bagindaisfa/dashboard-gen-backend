import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

export const authService = {
  register: async ({ name, email, password }) => {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      throw new Error("Email already registered");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });

    // Auto-create personal organization
    const organization = await prisma.organization.create({
      data: {
        name: `${name}'s Workspace`,
        ownerId: user.id,
      },
    });

    // Add user as owner in members table
    await prisma.organizationMember.create({
      data: {
        userId: user.id,
        orgId: organization.id,
        role: "owner",
      },
    });

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return {
      user,
      organization,
      accessToken,
      refreshToken,
    };
  },

  login: async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid credentials");
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  },

  refreshToken: async (token) => {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

      const accessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return { accessToken };
    } catch (err) {
      throw new Error("Invalid refresh token");
    }
  },
};
