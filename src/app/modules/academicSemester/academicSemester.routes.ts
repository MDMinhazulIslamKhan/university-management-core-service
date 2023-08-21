import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AcademicSemesterController } from './academicSemester.controller';
import { AcademicSemesterValidation } from './academicSemester.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(AcademicSemesterValidation.createAcademicSemesterZodSchema),
  AcademicSemesterController.InsertIntoDb
);

router.get('/', AcademicSemesterController.GetAllFromDb);

router.get('/:id', AcademicSemesterController.GetSingleData);

export const AcademicSemesterRouters = router;
