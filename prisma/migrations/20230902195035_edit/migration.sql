/*
  Warnings:

  - You are about to drop the column `semisterregistrationId` on the `offered_course` table. All the data in the column will be lost.
  - You are about to drop the column `semisterregistrationId` on the `offered_course-section` table. All the data in the column will be lost.
  - Added the required column `semesterRegistrationId` to the `offered_course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semesterRegistrationId` to the `offered_course-section` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "offered_course" DROP CONSTRAINT "offered_course_semisterregistrationId_fkey";

-- DropForeignKey
ALTER TABLE "offered_course-section" DROP CONSTRAINT "offered_course-section_semisterregistrationId_fkey";

-- AlterTable
ALTER TABLE "offered_course" DROP COLUMN "semisterregistrationId",
ADD COLUMN     "semesterRegistrationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "offered_course-section" DROP COLUMN "semisterregistrationId",
ADD COLUMN     "semesterRegistrationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "offered_course" ADD CONSTRAINT "offered_course_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES "semester_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offered_course-section" ADD CONSTRAINT "offered_course-section_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES "semester_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
