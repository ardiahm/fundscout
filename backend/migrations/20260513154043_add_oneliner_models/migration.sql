-- CreateTable
CREATE TABLE "OneLinerHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OneLinerHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OneLinerInteraction" (
    "id" TEXT NOT NULL,
    "historyId" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OneLinerInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OneLinerSubmission" (
    "id" TEXT NOT NULL,
    "interactionId" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "unique" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OneLinerSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OneLinerHistory_userId_key" ON "OneLinerHistory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OneLinerSubmission_interactionId_key" ON "OneLinerSubmission"("interactionId");

-- AddForeignKey
ALTER TABLE "OneLinerHistory" ADD CONSTRAINT "OneLinerHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OneLinerInteraction" ADD CONSTRAINT "OneLinerInteraction_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "OneLinerHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OneLinerSubmission" ADD CONSTRAINT "OneLinerSubmission_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "OneLinerInteraction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
