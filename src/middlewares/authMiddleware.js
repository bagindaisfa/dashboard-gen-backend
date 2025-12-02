import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ message: "Missing authorization header" });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.userId };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
