import { Request, Response, NextFunction } from "express";
import { StudentService } from "./student.service";
import { sendSuccess } from "../shared/response";
import { StatusCodes } from "http-status-codes";

export class StudentController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      // If it's a parent accessing, we'd use req.params.studentId. For simplicity, we assume the student is logged in.
      const userId = req.user!.userId;
      const result = await StudentService.getProfile(userId);
      return sendSuccess({ res, statusCode: StatusCodes.OK, message: "Student profile", data: result });
    } catch (error) {
      return next(error);
    }
  }

  static async getAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await StudentService.getAttendance(req.user!.userId);
      return sendSuccess({ res, statusCode: StatusCodes.OK, message: "Student attendance", data: result });
    } catch (error) {
      return next(error);
    }
  }

  static async getResults(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await StudentService.getResults(req.user!.userId);
      return sendSuccess({ res, statusCode: StatusCodes.OK, message: "Student results", data: result });
    } catch (error) {
      return next(error);
    }
  }

  static async getReportCards(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await StudentService.getReportCards(req.user!.userId);
      return sendSuccess({ res, statusCode: StatusCodes.OK, message: "Student report cards", data: result });
    } catch (error) {
      return next(error);
    }
  }
}
