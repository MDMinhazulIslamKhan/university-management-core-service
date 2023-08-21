import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { academicSemesterFilterableField } from './academicSemester.constant';
import { AcademicSemesterService } from './academicSemester.service';

const InsertIntoDb: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const data = req.body;
    const result = await AcademicSemesterService.InsertIntoDb(data);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
      message: 'Academic Semester Created Successfully.',
    });
  }
);

const GetAllFromDb: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filter = pick(req.query, academicSemesterFilterableField);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await AcademicSemesterService.GetAllFromDb(
      filter,
      paginationOptions
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      meta: result.meta,
      data: result.data,
      message: 'Academic Semester Retrieved Successfully.',
    });
  }
);

const GetSingleData: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await AcademicSemesterService.GetSingleData(id as string);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
      message: 'Academic Semester Retrieved Successfully.',
    });
  }
);

export const AcademicSemesterController = {
  InsertIntoDb,
  GetAllFromDb,
  GetSingleData,
};
