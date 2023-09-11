-- CreateTable
CREATE TABLE "student_semester_registration-courses" (
    "semesterRegistrationId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "offeredCourseId" TEXT NOT NULL,
    "offeredCourseSectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_semester_registration-courses_pkey" PRIMARY KEY ("semesterRegistrationId","studentId","offeredCourseId")
);

-- AddForeignKey
ALTER TABLE "student_semester_registration-courses" ADD CONSTRAINT "student_semester_registration-courses_semesterRegistration_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES "semester_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_semester_registration-courses" ADD CONSTRAINT "student_semester_registration-courses_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_semester_registration-courses" ADD CONSTRAINT "student_semester_registration-courses_offeredCourseId_fkey" FOREIGN KEY ("offeredCourseId") REFERENCES "offered_course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_semester_registration-courses" ADD CONSTRAINT "student_semester_registration-courses_offeredCourseSection_fkey" FOREIGN KEY ("offeredCourseSectionId") REFERENCES "offered_course-section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
