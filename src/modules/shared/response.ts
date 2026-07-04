import { Response } from "express";
import { StatusCodes } from "http-status-codes";

interface SuccessOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export function sendSuccess<T>({
  res,
  statusCode = StatusCodes.OK,
  message = "Success",
  data,
  meta,
}: SuccessOptions<T>) {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
    ...(meta ? { meta } : {}),
  });
}