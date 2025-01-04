/*
  Warnings:

  - You are about to drop the column `slot` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerHour` on the `Ground` table. All the data in the column will be lost.
  - Added the required column `slotId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "slot",
ADD COLUMN     "slotId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Ground" DROP COLUMN "pricePerHour";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Slot" (
    "id" SERIAL NOT NULL,
    "groundId" INTEGER NOT NULL,
    "timeRange" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Slot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_groundId_fkey" FOREIGN KEY ("groundId") REFERENCES "Ground"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
