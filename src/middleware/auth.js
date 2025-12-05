import jwt from "jsonwebtoken";
import prisma from "../core/prisma.js";

export async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth)
      return res.status(401).json({ message: "No authorization header" });

    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer")
      return res.status(401).json({ message: "Invalid authorization format" });

    const token = parts[1];
    const secret = process.env.JWT_SECRET;
    if (!secret)
      return res.status(500).json({ message: "JWT secret not configured" });

    const payload = jwt.verify(token, secret);
    // optional: fetch user from db to ensure still valid
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized", details: err.message });
  }
}
