import express from 'express';
import { AcademicSemesterRouters } from '../modules/academicSemester/academicSemester.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/academic-semester',
    route: AcademicSemesterRouters,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
