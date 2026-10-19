-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CompanySector_companyId_sectorId_key" ON "CompanySector"("companyId", "sectorId");

-- CreateIndex
CREATE UNIQUE INDEX "Investor_name_key" ON "Investor"("name");
