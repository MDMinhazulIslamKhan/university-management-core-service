import { Code, Month, Title } from './academicSemester.constant';

export type IAcademicSemester = {
  title: Title;
  year: string;
  code: Code;
  startMonth: Month;
  endMonth: Month;
};

export type IAcademicSemesterFilters = { searchTerm?: string };
