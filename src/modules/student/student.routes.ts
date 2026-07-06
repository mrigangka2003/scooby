import { Router } from "express";
import { StudentController } from "./student.controller";
import { authenticateUser, requireRole } from "../shared/middleware/auth.middleware";

const router = Router();

router.use(authenticateUser, requireRole(["STUDENT"]));

/**
 * @openapi
 * tags:
 *   name: Student
 *   description: Student portal endpoints
 *   security:
 *     - bearerAuth: []
 */

/**
 * @openapi
 * /student/profile:
 *   get:
 *     tags: [Student]
 *     summary: Get student profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student profile details
 */
router.get("/profile", StudentController.getProfile);

/**
 * @openapi
 * /student/attendance:
 *   get:
 *     tags: [Student]
 *     summary: Get student attendance history
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance history
 */
router.get("/attendance", StudentController.getAttendance);

/**
 * @openapi
 * /student/results:
 *   get:
 *     tags: [Student]
 *     summary: Get student exam results
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Exam results
 */
router.get("/results", StudentController.getResults);

/**
 * @openapi
 * /student/report-cards:
 *   get:
 *     tags: [Student]
 *     summary: Get student report cards
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report cards
 */
router.get("/report-cards", StudentController.getReportCards);

export default router;
