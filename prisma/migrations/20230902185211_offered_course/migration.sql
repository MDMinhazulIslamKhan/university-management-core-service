-- CreateTable
CREATE TABLE "offered_coures" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "couresId" TEXT NOT NULL,
    "academicDepartmentId" TEXT NOT NULL,
    "semisterregistrationId" TEXT NOT NULL,

    CONSTRAINT "offered_coures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offered_coures-section" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "maxCapacity" INTEGER NOT NULL,
    "currentlyInrolledStudent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "offeredCouresId" TEXT NOT NULL,
    "semisterregistrationId" TEXT NOT NULL,

    CONSTRAINT "offered_coures-section_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "offered_coures" ADD CONSTRAINT "offered_coures_couresId_fkey" FOREIGN KEY ("couresId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offered_coures" ADD CONSTRAINT "offered_coures_academicDepartmentId_fkey" FOREIGN KEY ("academicDepartmentId") REFERENCES "academic_departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offered_coures" ADD CONSTRAINT "offered_coures_semisterregistrationId_fkey" FOREIGN KEY ("semisterregistrationId") REFERENCES "semester_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offered_coures-section" ADD CONSTRAINT "offered_coures-section_offeredCouresId_fkey" FOREIGN KEY ("offeredCouresId") REFERENCES "offered_coures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offered_coures-section" ADD CONSTRAINT "offered_coures-section_semisterregistrationId_fkey" FOREIGN KEY ("semisterregistrationId") REFERENCES "semester_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
