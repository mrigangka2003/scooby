import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { sendSuccess } from "../shared/response";
import { StatusCodes } from "http-status-codes";

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const tokens = await AuthService.login(email, password);
      return sendSuccess({ res, statusCode: StatusCodes.OK, message: "Login successful", data: tokens });
    } catch (error) {
      return next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const tokens = await AuthService.refresh(refreshToken);
      return sendSuccess({ res, statusCode: StatusCodes.OK, message: "Token refreshed successfully", data: tokens });
    } catch (error) {
      return next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }
      return sendSuccess({ res, statusCode: StatusCodes.OK, message: "Logout successful" });
    } catch (error) {
      return next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email);
      return sendSuccess({ res, statusCode: StatusCodes.OK, message: "If the email is registered, a password reset link has been sent" });
    } catch (error) {
      return next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      await AuthService.resetPassword(token, newPassword);
      return sendSuccess({ res, statusCode: StatusCodes.OK, message: "Password has been reset successfully" });
    } catch (error) {
      return next(error);
    }
  }
}
