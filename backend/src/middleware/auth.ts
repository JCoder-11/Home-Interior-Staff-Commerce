import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { supabase } from "../supabase";

export type Role = "sales" | "admin" | "it_admin";

export interface AuthUser {
  userId: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  let payload: { userId: string };
  try {
    payload = jwt.verify(header.slice(7), process.env.JWT_SECRET!) as { userId: string };
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, role, status")
    .eq("id", payload.userId)
    .single();

  if (error || !profile) {
    return res.status(401).json({ error: "Account not found" });
  }

  if (profile.status !== "ACTIVE") {
    return res.status(403).json({ error: "Account is not active" });
  }

  req.user = { userId: profile.id, role: profile.role as Role };
  next();
};

export const requireRole =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "You do not have permission to do this" });
    }
    next();
  };