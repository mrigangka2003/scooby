import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors";
import { StatusCodes } from "http-status-codes";
import { verifyAccessToken, JwtPayload } from "../../../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateUser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new AppError("Not authenticated", StatusCodes.UNAUTHORIZED)
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", StatusCodes.UNAUTHORIZED));
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Not authenticated", StatusCodes.UNAUTHORIZED));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action",
          StatusCodes.FORBIDDEN
        )
      );
    }
    next();
  };
};
