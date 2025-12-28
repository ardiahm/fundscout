import {PrismaClient} from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * ======================================
 * FundScout Ad-Hoc DB Script
 * ======================================
 *
 * HOW TO USE:
 * 1. Add calls inside `main()` using helpers below
 * 2. Run with: npx ts-node scripts/addData.ts
 *
 * PURPOSE:
 * - Add / update Investors, Companies, Sectors, Investments
 * - Safe to re-run (uses find-or-create patterns)
 * - Keep seed.ts untouched
 */

const adapter = new PrismaPg({
  connectionString: "postgresql://investor:investor@localhost:5432/fundscout",
});

const prisma = new PrismaClient({ adapter });

async function assertCompanyExists(companyId: number) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new Error(`❌ Company with id=${companyId} does not exist`);
  }

  return company;
}

/** Find or create a sector */
async function getOrCreateSector(name: string) {
  return prisma.sector.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

/** Link sector to company (safe + idempotent) */
async function addSectorToCompany(
  companyId: number,
  sectorName: string
) {
  const sector = await getOrCreateSector(sectorName);

  const existing = await prisma.companySector.findFirst({
    where: {
      companyId,
      sectorId: sector.id,
    },
  });

  if (existing) {
    console.log(
      `ℹ️ Sector "${sectorName}" already linked to company ${companyId}`
    );
    return existing;
  }

  const link = await prisma.companySector.create({
    data: {
      companyId,
      sectorId: sector.id,
    },
  });

  console.log(
    `✅ Linked sector "${sectorName}" to company ${companyId}`
  );

  return link;
}

/* =====================
   Main
   ===================== */

async function main() {
  const airbnbId = 2;

  await assertCompanyExists(airbnbId);

  await addSectorToCompany(airbnbId, "Travel Services");
}

/* =====================
   Run
   ===================== */

main()
  .catch((err) => {
    console.error("❌ Script failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
