import { Request, Response, NextFunction } from "express";
// No imports from zod needed
import { AppError } from "../errors";
import { StatusCodes } from "http-status-codes";

export const validate =
  (schema: any) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error && typeof error === "object" && "issues" in error) {
        const errorMessages = (error as any).issues.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        return next(
          new AppError(
            "Validation Error",
            StatusCodes.BAD_REQUEST,
            errorMessages
          )
        );
      }
      return next(error);
    }
  };
