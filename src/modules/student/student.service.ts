import { prisma } from "../../config/database";
import { AppError } from "../shared/errors";
import { StatusCodes } from "http-status-codes";

export class StudentService {
  static async getProfile(userId: string) {
    const student = await prisma.student.findUnique({
      where: { userId },
      include: {
        enrollments: {
          include: {
            class: true,
            section: true,
            academicYear: true,
          }
        },
        parents: {
          include: { parent: true }
        }
      },
    });

    if (!student) {
      throw new AppError("Student profile not found", StatusCodes.NOT_FOUND);
    }
    return student;
  }

  static async getAttendance(userId: string) {
    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) throw new AppError("Student not found", StatusCodes.NOT_FOUND);

    return prisma.attendance.findMany({
      where: { studentId: student.id },
      orderBy: { date: "desc" },
    });
  }

  static async getResults(userId: string) {
    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) throw new AppError("Student not found", StatusCodes.NOT_FOUND);

    return prisma.examResult.findMany({
      where: { studentId: student.id },
      include: {
        examSubject: {
          include: {
            exam: true,
            classSubject: {
              include: { subject: true }
            }
          }
        }
      },
      orderBy: { enteredAt: "desc" },
    });
  }

  static async getReportCards(userId: string) {
    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) throw new AppError("Student not found", StatusCodes.NOT_FOUND);

    return prisma.reportCard.findMany({
      where: { studentId: student.id },
      include: { term: true },
      orderBy: { generatedAt: "desc" },
    });
  }
}
