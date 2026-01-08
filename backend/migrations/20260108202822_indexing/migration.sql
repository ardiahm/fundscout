-- CreateTable
CREATE TABLE "FavoriteInvestor" (
    "userId" TEXT NOT NULL,
    "investorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteInvestor_pkey" PRIMARY KEY ("userId","investorId")
);

-- CreateIndex
CREATE INDEX "Investment_investorId_idx" ON "Investment"("investorId");

-- CreateIndex
CREATE INDEX "Investment_companyId_idx" ON "Investment"("companyId");

-- AddForeignKey
ALTER TABLE "FavoriteInvestor" ADD CONSTRAINT "FavoriteInvestor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteInvestor" ADD CONSTRAINT "FavoriteInvestor_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
