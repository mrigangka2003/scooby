import { prisma } from "../../config/database";
import { AppError } from "../shared/errors";
import { StatusCodes } from "http-status-codes";
import { AttendanceStatus } from "../../generated/prisma/enums";

export class TeacherService {
  static async getClasses(userId: string) {
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
      include: {
        classTeacherOf: true,
        classSubjects: {
          include: {
            classSubject: {
              include: {
                class: true,
                subject: true,
              },
            },
          },
        },
      },
    });

    if (!teacher) {
      throw new AppError("Teacher profile not found", StatusCodes.NOT_FOUND);
    }
    return teacher;
  }

  static async markAttendance(userId: string, data: any) {
    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    if (!teacher) throw new AppError("Teacher not found", StatusCodes.NOT_FOUND);

    const { sectionId, date, records } = data; // records: [{studentId, status, remarks}]

    const attendanceRecords = records.map((record: any) => ({
      studentId: record.studentId,
      sectionId,
      date: new Date(date),
      status: record.status as AttendanceStatus,
      remarks: record.remarks,
      markedById: teacher.id,
    }));

    // For simplicity, we just use createMany. In reality, upsert or handle conflicts.
    return prisma.attendance.createMany({
      data: attendanceRecords,
      skipDuplicates: true,
    });
  }

  static async getAttendance(sectionId: string, date: string) {
    return prisma.attendance.findMany({
      where: {
        sectionId,
        date: new Date(date),
      },
      include: {
        student: true,
      },
    });
  }

  static async enterMarks(_userId: string, data: any) {
    // data: { examSubjectId, results: [{ studentId, marksObtained, isAbsent, remarks }] }
    const { examSubjectId, results } = data;
    
    // Simplification: directly insert
    return prisma.$transaction(
      results.map((r: any) =>
        prisma.examResult.upsert({
          where: {
            examSubjectId_studentId: {
              examSubjectId,
              studentId: r.studentId,
            },
          },
          update: {
            marksObtained: r.marksObtained,
            isAbsent: r.isAbsent,
            remarks: r.remarks,
          },
          create: {
            examSubjectId,
            studentId: r.studentId,
            marksObtained: r.marksObtained,
            isAbsent: r.isAbsent,
            remarks: r.remarks,
          },
        })
      )
    );
  }
}
