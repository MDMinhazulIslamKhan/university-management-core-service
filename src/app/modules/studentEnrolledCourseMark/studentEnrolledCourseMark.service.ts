import {
  ExamType,
  PrismaClient,
  StudentEnrolledCourseMark,
} from '@prisma/client';
import {
  DefaultArgs,
  PrismaClientOptions,
} from '@prisma/client/runtime/library';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IStudentEnrolledCourseMarkFilterRequest } from './studentEnrolledCourseMark.interface';
import { StudentEnrolledCourseMarkUtils } from './studentEnrolledCousreMark.utils';

const createStudentEnrolledCourseDefaultMark = async (
  prismaClient: Omit<
    PrismaClient<PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
  payload: {
    studentId: string;
    studentEnrolledCourseId: string;
    academicSemesterId: string;
  }
) => {
  const isExitMidtermData =
    await prismaClient.studentEnrolledCourseMark.findFirst({
      where: {
        examType: ExamType.MIDTERM,
        student: {
          id: payload.studentId,
        },
        studentEnrolledCourse: {
          id: payload.studentEnrolledCourseId,
        },
        academicSemester: {
          id: payload.academicSemesterId,
        },
      },
    });
  if (!isExitMidtermData) {
    await prismaClient.studentEnrolledCourseMark.create({
      data: {
        student: {
          connect: {
            id: payload.studentId,
          },
        },
        studentEnrolledCourse: {
          connect: {
            id: payload.studentEnrolledCourseId,
          },
        },
        academicSemester: {
          connect: {
            id: payload.academicSemesterId,
          },
        },
        examType: ExamType.MIDTERM,
      },
    });
  }

  const isExistFinalData =
    await prismaClient.studentEnrolledCourseMark.findFirst({
      where: {
        examType: ExamType.FINAL,
        student: {
          id: payload.studentId,
        },
        studentEnrolledCourse: {
          id: payload.studentEnrolledCourseId,
        },
        academicSemester: {
          id: payload.academicSemesterId,
        },
      },
    });

  if (!isExistFinalData) {
    await prismaClient.studentEnrolledCourseMark.create({
      data: {
        student: {
          connect: {
            id: payload.studentId,
          },
        },
        studentEnrolledCourse: {
          connect: {
            id: payload.studentEnrolledCourseId,
          },
        },
        academicSemester: {
          connect: {
            id: payload.academicSemesterId,
          },
        },
        examType: ExamType.FINAL,
      },
    });
  }
};

const getAllFromDB = async (
  filters: IStudentEnrolledCourseMarkFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<StudentEnrolledCourseMark[]>> => {
  const { limit, page } = paginationHelpers.calculatePagination(options);

  const marks = await prisma.studentEnrolledCourseMark.findMany({
    where: {
      student: {
        id: filters.studentId,
      },
      academicSemester: {
        id: filters.academicSemesterId,
      },
      studentEnrolledCourse: {
        course: {
          id: filters.courseId,
        },
      },
    },
    include: {
      studentEnrolledCourse: {
        include: {
          course: true,
        },
      },
      student: true,
    },
  });

  return {
    meta: {
      total: marks.length,
      page,
      limit,
    },
    data: marks,
  };
};

const updateStudentMarks = async (payload: any) => {
  const { studentId, marks, academicSemesterId, courseId, examType } = payload;

  const studentEnrolledCourseMark =
    await prisma.studentEnrolledCourseMark.findFirst({
      where: {
        student: {
          id: studentId,
        },
        academicSemester: {
          id: academicSemesterId,
        },
        studentEnrolledCourse: {
          course: {
            id: courseId,
          },
        },
        examType,
      },
    });

  if (!studentEnrolledCourseMark) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Course mark not found!');
  }
  const grade = StudentEnrolledCourseMarkUtils.getGradeFromMarks(marks);

  const updateStudentMarks = await prisma.studentEnrolledCourseMark.update({
    where: {
      id: studentEnrolledCourseMark.id,
    },
    data: {
      marks,
      grade: grade.grade,
    },
  });

  return updateStudentMarks;
};

const updateFinalMarks = async (payload: any) => {
  const { studentId, academicSemesterId, courseId } = payload;

  const studentEnrolledCourse = await prisma.studentEnrolledCourse.findFirst({
    where: {
      academicSemester: {
        id: academicSemesterId,
      },
      student: {
        id: studentId,
      },
      course: { id: courseId },
    },
  });

  if (!studentEnrolledCourse) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student enrolled course data not found!'
    );
  }

  const studentEnrolledCourseMark =
    await prisma.studentEnrolledCourseMark.findMany({
      where: {
        academicSemester: {
          id: academicSemesterId,
        },
        student: {
          id: studentId,
        },
        studentEnrolledCourse: {
          course: {
            id: courseId,
          },
        },
      },
    });
  if (!studentEnrolledCourseMark) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student enrolled course Mark not found!'
    );
  }

  const midtermMarks =
    studentEnrolledCourseMark.find(item => item.examType === 'MIDTERM')
      ?.marks || 0;
  const finalMarks =
    studentEnrolledCourseMark.find(item => item.examType === 'FINAL')?.marks ||
    0;

  const totalFinalMarks =
    Math.ceil(midtermMarks * 0.4) + Math.ceil(finalMarks * 0.6);

  const result =
    StudentEnrolledCourseMarkUtils.getGradeFromMarks(totalFinalMarks);

  await prisma.studentEnrolledCourse.updateMany({
    where: {
      academicSemester: {
        id: academicSemesterId,
      },
      student: {
        id: studentId,
      },
      course: { id: courseId },
    },
    data: {
      grade: result.grade,
      point: result.point,
      totalMarks: totalFinalMarks,
      status: 'COMPLETED',
    },
  });

  const grade = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        id: studentId,
      },
      status: 'COMPLETED',
    },
    include: { course: true },
  });

  const academicResult = StudentEnrolledCourseMarkUtils.calcCGPAandGrade(grade);

  const studentAcademicInfo = await prisma.studentAcademicInfo.findFirst({
    where: {
      studentId: studentId,
    },
  });

  if (!studentAcademicInfo) {
    await prisma.studentAcademicInfo.create({
      data: {
        studentId: studentId,
        cgpa: academicResult.cgpa,
        totalCompletedCredit: academicResult.totalCompletedCredit,
      },
    });
  } else {
    await prisma.studentAcademicInfo.update({
      where: {
        id: studentAcademicInfo.id,
      },
      data: {
        cgpa: academicResult.cgpa,
        totalCompletedCredit: academicResult.totalCompletedCredit,
      },
    });
  }
  return grade;
};

const getMyCourseMarks = async (
  filters: IStudentEnrolledCourseMarkFilterRequest,
  options: IPaginationOptions,
  authUser: any
): Promise<IGenericResponse<StudentEnrolledCourseMark[]>> => {
  const { limit, page } = paginationHelpers.calculatePagination(options);

  const student = await prisma.student.findFirst({
    where: {
      studentId: authUser.id,
    },
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  const marks = await prisma.studentEnrolledCourseMark.findMany({
    where: {
      student: {
        id: student.id,
      },
      academicSemester: {
        id: filters.academicSemesterId,
      },
      studentEnrolledCourse: {
        course: {
          id: filters.courseId,
        },
      },
    },
    include: {
      studentEnrolledCourse: {
        include: {
          course: true,
        },
      },
    },
  });

  return {
    meta: {
      total: marks.length,
      page,
      limit,
    },
    data: marks,
  };
};

export const StudentEnrolledCourseMarkService = {
  createStudentEnrolledCourseDefaultMark,
  getAllFromDB,
  updateStudentMarks,
  updateFinalMarks,
  getMyCourseMarks,
};
