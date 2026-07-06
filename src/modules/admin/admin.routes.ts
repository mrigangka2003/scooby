import { Router } from "express";
import { AdminController } from "./admin.controller";
import { authenticateUser, requireRole } from "../shared/middleware/auth.middleware";

const router = Router();

// Protect all admin routes
router.use(authenticateUser, requireRole(["ADMIN"]));

/**
 * @openapi
 * tags:
 *   name: Admin
 *   description: Administrative endpoints for managing users and academics
 *   security:
 *     - bearerAuth: []
 */

/**
 * @openapi
 * /admin/users/teacher:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new teacher
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
 *         description: Teacher created successfully
 */
router.post("/users/teacher", AdminController.createTeacher);

/**
 * @openapi
 * /admin/users/student:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new student
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
 *         description: Student created successfully
 */
router.post("/users/student", AdminController.createStudent);

/**
 * @openapi
 * /admin/users/teachers:
 *   get:
 *     tags: [Admin]
 *     summary: Get all teachers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teachers
 */
router.get("/users/teachers", AdminController.getTeachers);

/**
 * @openapi
 * /admin/users/students:
 *   get:
 *     tags: [Admin]
 *     summary: Get all students
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 */
router.get("/users/students", AdminController.getStudents);

/**
 * @openapi
 * /admin/academic/class:
 *   post:
 *     tags: [Admin]
 *     summary: Create a class
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
 *         description: Class created
 */
router.post("/academic/class", AdminController.createClass);

/**
 * @openapi
 * /admin/academic/subject:
 *   post:
 *     tags: [Admin]
 *     summary: Create a subject
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
 *         description: Subject created
 */
router.post("/academic/subject", AdminController.createSubject);

export default router;
