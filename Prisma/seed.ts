import { prisma } from '../src/config/database';
import bcrypt from 'bcrypt';

async function main() {
  const school = await prisma.school.upsert({
    where: { id: 'default-school' },
    update: {},
    create: { id: 'default-school', name: 'My School', email: 'contact@myschool.edu' },
  });

  const academicYear = await prisma.academicYear.upsert({
    where: { schoolId_name: { schoolId: school.id, name: '2025-2026' } },
    update: {},
    create: {
      schoolId: school.id,
      name: '2025-2026',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2026-04-30'),
      isActive: true,
    },
  });

  await prisma.term.createMany({
    data: [
      { academicYearId: academicYear.id, name: 'Term 1', startDate: new Date('2025-06-01'), endDate: new Date('2025-09-30') },
      { academicYearId: academicYear.id, name: 'Term 2', startDate: new Date('2025-10-01'), endDate: new Date('2026-01-31') },
      { academicYearId: academicYear.id, name: 'Term 3', startDate: new Date('2026-02-01'), endDate: new Date('2026-04-30') },
    ],
    skipDuplicates: true,
  });

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@myschool.edu' },
    update: {},
    create: {
      email: 'admin@myschool.edu',
      password: passwordHash,
      role: 'ADMIN',
      admin: { create: { schoolId: school.id, firstName: 'Site', lastName: 'Admin' } },
    },
  });

  // Class + Section
  const grade1 = await prisma.class.upsert({
    where: { schoolId_academicYearId_name: { schoolId: school.id, academicYearId: academicYear.id, name: 'Grade 1' } },
    update: {},
    create: { schoolId: school.id, academicYearId: academicYear.id, name: 'Grade 1', order: 1 },
  });
  const sectionA = await prisma.section.upsert({
    where: { classId_name: { classId: grade1.id, name: 'A' } },
    update: {},
    create: { classId: grade1.id, name: 'A' },
  });

  // Subject
  const math = await prisma.subject.upsert({
    where: { schoolId_name: { schoolId: school.id, name: 'Mathematics' } },
    update: {},
    create: { schoolId: school.id, name: 'Mathematics', code: 'MATH' },
  });
  const classSubject = await prisma.classSubject.upsert({
    where: { classId_subjectId: { classId: grade1.id, subjectId: math.id } },
    update: {},
    create: { classId: grade1.id, subjectId: math.id },
  });

  // Teacher
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@myschool.edu' },
    update: {},
    create: {
      email: 'teacher@myschool.edu',
      password: passwordHash,
      role: 'TEACHER',
      teacher: { create: { schoolId: school.id, employeeId: 'EMP001', firstName: 'Jane', lastName: 'Doe' } },
    },
    include: { teacher: true },
  });
  await prisma.classSubjectTeacher.upsert({
    where: { classSubjectId_teacherId: { classSubjectId: classSubject.id, teacherId: teacherUser.teacher!.id } },
    update: {},
    create: { classSubjectId: classSubject.id, teacherId: teacherUser.teacher!.id },
  });

  // Student
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@myschool.edu' },
    update: {},
    create: {
      email: 'student@myschool.edu',
      password: passwordHash,
      role: 'STUDENT',
      student: {
        create: { schoolId: school.id, admissionNo: 'ADM001', firstName: 'Sam', lastName: 'Smith' },
      },
    },
    include: { student: true },
  });
  await prisma.enrollment.upsert({
    where: { studentId_academicYearId: { studentId: studentUser.student!.id, academicYearId: academicYear.id } },
    update: {},
    create: {
      studentId: studentUser.student!.id,
      academicYearId: academicYear.id,
      classId: grade1.id,
      sectionId: sectionA.id,
      rollNo: '1',
    },
  });

  // Parent, linked to student
  const parentUser = await prisma.user.upsert({
    where: { email: 'parent@myschool.edu' },
    update: {},
    create: {
      email: 'parent@myschool.edu',
      password: passwordHash,
      role: 'PARENT',
      parent: { create: { schoolId: school.id, firstName: 'Pat', lastName: 'Smith' } },
    },
    include: { parent: true },
  });
  await prisma.parentStudent.upsert({
    where: { parentId_studentId: { parentId: parentUser.parent!.id, studentId: studentUser.student!.id } },
    update: {},
    create: { parentId: parentUser.parent!.id, studentId: studentUser.student!.id, relation: 'FATHER', isPrimary: true },
  });

  console.log('✅ Seed complete — admin/teacher/student/parent logins use password: Password123!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });