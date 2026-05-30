import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

// Extend Request interface to include user property
interface AuthRequest extends Request {
  user?: {
    id: string;
  };
  cookies: { [key: string]: string };
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Get token from cookie or Authorization header
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res.status(401).json({ msg: "Not authorized, no token" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as
      | JwtPayload
      | string;

    // Add user to request
    // Handle different token payload structures
    if (typeof decoded === "object" && decoded !== null) {
      if (
        "user" in decoded &&
        typeof decoded.user === "object" &&
        "id" in decoded.user
      ) {
        req.user = { id: (decoded as { user: { id: string } }).user.id };
      } else if ("id" in decoded) {
        req.user = { id: (decoded as { id: string }).id };
      } else {
        throw new Error("Invalid token payload");
      }
    } else {
      // If decoded is a string (the user id directly)
      req.user = { id: decoded as string };
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ msg: "Not authorized, token failed" });
  }
};
