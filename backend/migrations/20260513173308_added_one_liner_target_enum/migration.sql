/*
  Warnings:

  - Changed the type of `target` on the `OneLinerSubmission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OneLinerTarget" AS ENUM ('Businesses', 'Consumers', 'Both');

-- AlterTable
ALTER TABLE "OneLinerSubmission" DROP COLUMN "target",
ADD COLUMN     "target" "OneLinerTarget" NOT NULL;
