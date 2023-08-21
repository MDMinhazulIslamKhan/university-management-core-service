import { AcademicSemester, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { academicSemesterSearchableField } from './academicSemester.constant';
import { IAcademicSemesterFilters } from './academicSemester.interface';

const InsertIntoDb = async (
  AcademicSemesterData: AcademicSemester
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.create({
    data: AcademicSemesterData,
  });

  return result;
};

const GetAllFromDb = async (
  filter: IAcademicSemesterFilters,
  options: IPaginationOptions
): Promise<IGenericResponse<AcademicSemester[]>> => {
  const { page, limit, skip, sortOrder, sortBy } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filter;

  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      OR: academicSemesterSearchableField.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditions: Prisma.AcademicSemesterWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.academicSemester.findMany({
    skip,
    take: limit,
    where: whereConditions,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });

  const count = await prisma.academicSemester.count();
  return {
    data: result,
    meta: {
      limit,
      page,
      total: count,
    },
  };
};

const GetSingleData = async (id: string): Promise<AcademicSemester | null> => {
  const result = prisma.academicSemester.findUnique({
    where: {
      id,
    },
  });

  return result;
};
export const AcademicSemesterService = {
  InsertIntoDb,
  GetAllFromDb,
  GetSingleData,
};
