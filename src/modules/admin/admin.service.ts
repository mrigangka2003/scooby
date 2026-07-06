import { prisma } from "../../config/database";
import bcrypt from "bcrypt";

export class AdminService {
  static async createTeacher(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: "TEACHER",
        },
      });
      const teacher = await tx.teacher.create({
        data: {
          userId: user.id,
          schoolId: data.schoolId,
          employeeId: data.employeeId,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
      });
      return { user, teacher };
    });
  }

  static async createStudent(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: "STUDENT",
        },
      });
      const student = await tx.student.create({
        data: {
          userId: user.id,
          schoolId: data.schoolId,
          admissionNo: data.admissionNo,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });
      return { user, student };
    });
  }

  static async createClass(data: any) {
    return prisma.class.create({ data });
  }

  static async createSubject(data: any) {
    return prisma.subject.create({ data });
  }

  static async assignSubjectToClass(classId: string, subjectId: string) {
    return prisma.classSubject.create({
      data: { classId, subjectId },
    });
  }

  static async getTeachers() {
    return prisma.teacher.findMany({
      include: {
        user: { select: { id: true, email: true, isActive: true } }
      }
    });
  }

  static async getStudents() {
    return prisma.student.findMany({
      include: {
        user: { select: { id: true, email: true, isActive: true } }
      }
    });
  }
}
