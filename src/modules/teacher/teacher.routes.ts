import { Router } from "express";
import { TeacherController } from "./teacher.controller";
import { authenticateUser, requireRole } from "../shared/middleware/auth.middleware";

const router = Router();

router.use(authenticateUser, requireRole(["TEACHER", "ADMIN"]));

/**
 * @openapi
 * tags:
 *   name: Teacher
 *   description: Teacher operations (attendance, marks, etc.)
 *   security:
 *     - bearerAuth: []
 */

/**
 * @openapi
 * /teacher/classes:
 *   get:
 *     tags: [Teacher]
 *     summary: Get assigned classes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned classes
 */
router.get("/classes", TeacherController.getClasses);

/**
 * @openapi
 * /teacher/attendance:
 *   post:
 *     tags: [Teacher]
 *     summary: Mark attendance for a class section
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Attendance marked successfully
 */
router.post("/attendance", TeacherController.markAttendance);

/**
 * @openapi
 * /teacher/attendance:
 *   get:
 *     tags: [Teacher]
 *     summary: Get attendance for a class section
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance records
 */
router.get("/attendance", TeacherController.getAttendance);

/**
 * @openapi
 * /teacher/exam-results:
 *   post:
 *     tags: [Teacher]
 *     summary: Enter exam marks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Marks entered successfully
 */
router.post("/exam-results", TeacherController.enterMarks);

export default router;
