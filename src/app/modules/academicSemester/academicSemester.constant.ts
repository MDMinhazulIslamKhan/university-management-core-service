export type Month =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';
export type Title = 'Autumn' | 'Summer' | 'Fall';
export type Code = '01' | '02' | '03';

export const academicSemesterMonths: Month[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const academicSemesterTitles: Title[] = ['Autumn', 'Summer', 'Fall'];
export const academicSemesterCodes: Code[] = ['01', '02', '03'];

export const academicSemesterTitleCodeMapper: { [key: string]: string } = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};

export const academicSemesterSearchableField = [
  'title',
  'code',
  'startMonth',
  'endMonth',
];

export const academicSemesterFilterableField = ['searchTerm', 'title', 'code'];
