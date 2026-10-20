-- CreateEnum
CREATE TYPE "ValuationStage" AS ENUM ('PRE_SEED', 'SEED', 'SERIES_A', 'SERIES_B');

-- CreateTable
CREATE TABLE "ValuationHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValuationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValuationInteraction" (
    "id" TEXT NOT NULL,
    "historyId" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ValuationInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValuationSubmission" (
    "id" TEXT NOT NULL,
    "interactionId" TEXT NOT NULL,
    "companyName" TEXT,
    "stage" "ValuationStage" NOT NULL,
    "sector" TEXT NOT NULL,
    "raiseAmount" DOUBLE PRECISION NOT NULL,
    "hasRevenue" BOOLEAN NOT NULL,
    "monthlyRevenue" DOUBLE PRECISION,
    "monthlyGrowth" DOUBLE PRECISION,
    "grossMargin" DOUBLE PRECISION,
    "teamRating" INTEGER NOT NULL,
    "marketRating" INTEGER NOT NULL,
    "productRating" INTEGER NOT NULL,
    "competitionRating" INTEGER NOT NULL,
    "tractionRating" INTEGER NOT NULL,

    CONSTRAINT "ValuationSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ValuationHistory_userId_key" ON "ValuationHistory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ValuationSubmission_interactionId_key" ON "ValuationSubmission"("interactionId");

-- AddForeignKey
ALTER TABLE "ValuationHistory" ADD CONSTRAINT "ValuationHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValuationInteraction" ADD CONSTRAINT "ValuationInteraction_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "ValuationHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValuationSubmission" ADD CONSTRAINT "ValuationSubmission_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "ValuationInteraction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

