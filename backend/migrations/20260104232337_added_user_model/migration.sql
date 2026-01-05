-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PREMIUM', 'ULTIMATE');

-- CreateEnum
CREATE TYPE "BuilderType" AS ENUM ('SOLO', 'COLLABORATIVE');

-- CreateEnum
CREATE TYPE "ProjectStage" AS ENUM ('IDEATION', 'MVP', 'VALIDATION', 'RAISING_FUNDS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "builderType" "BuilderType",
    "stage" "ProjectStage",
    "industries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "goals" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");
