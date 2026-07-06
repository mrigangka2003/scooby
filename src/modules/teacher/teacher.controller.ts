import { Request, Response, NextFunction } from "express";
import { TeacherService } from "./teacher.service";
import { sendSuccess } from "../shared/response";
import { StatusCodes } from "http-status-codes";

export class TeacherController {
  static async getClasses(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await TeacherService.getClasses(req.user!.userId);
      return sendSuccess({ res, statusCode: StatusCodes.OK, message: "Teacher classes", data: result });
    } catch (error) {
      return next(error);
    }
  }

  static async markAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await TeacherService.markAttendance(req.user!.userId, req.body);
      return sendSuccess({ res, statusCode: StatusCodes.CREATED, message: "Attendance marked successfully", data: result });
    } catch (error) {
      return next(error);
    }
  }

  static async getAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const classId = req.query.classId as string;
      const date = req.query.date as string;
      const result = await TeacherService.getAttendance(classId, date);
      return sendSuccess({ res, statusCode: StatusCodes.OK, message: "Attendance records", data: result });
    } catch (error) {
      return next(error);
    }
  }

  static async enterMarks(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await TeacherService.enterMarks(req.user!.userId, req.body);
      return sendSuccess({ res, statusCode: StatusCodes.CREATED, message: "Marks entered successfully", data: result });
    } catch (error) {
      return next(error);
    }
  }
}
