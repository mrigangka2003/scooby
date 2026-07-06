import { Request, Response, NextFunction } from "express";
import { AdminService } from "./admin.service";
import { sendSuccess } from "../shared/response";
import { StatusCodes } from "http-status-codes";

export class AdminController {
  static async createTeacher(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.createTeacher(_req.body);
      return sendSuccess({ res, statusCode: StatusCodes.CREATED, message: "Teacher created", data: result });
    } catch (error) {
      return next(error);
    }
  }

  static async createStudent(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.createStudent(_req.body);
      return sendSuccess({ res, statusCode: StatusCodes.CREATED, message: "Student created", data: result });
    } catch (error) {
      return next(error);
    }
  }

  static async createClass(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.createClass(_req.body);
      return sendSuccess({ res, statusCode: StatusCodes.CREATED, message: "Class created", data: result });
    } catch (error) {
      return next(error);
    }
  }

  static async createSubject(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.createSubject(_req.body);
      return sendSuccess({ res, statusCode: StatusCodes.CREATED, message: "Subject created", data: result });
    } catch (error) {
      return next(error);
    }
  }

  static async getTeachers(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getTeachers();
      return sendSuccess({ res, statusCode: StatusCodes.OK, message: "Teachers fetched successfully", data: result });
    } catch (error) {
      return next(error);
    }
  }

  static async getStudents(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getStudents();
      return sendSuccess({ res, statusCode: StatusCodes.OK, message: "Students fetched successfully", data: result });
    } catch (error) {
      return next(error);
    }
  }
}
