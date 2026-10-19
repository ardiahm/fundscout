import {PrismaClient} from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { logoUrlFromWebsite } from "../lib/logo";

/**
 * ======================================
 * FundScout Ad-Hoc DB Script
 * ======================================
 *
 * HOW TO USE:
 * 1. Add calls inside `main()` using helpers below
 * 2. Run from backend/ with: npx tsx scripts/addData.ts
 *
 * PURPOSE:
 * - Add / update Investors, Companies, Sectors, Investments
 * - Safe to re-run (upserts on unique names; investments matched on investor, company, stage, date)
 * - Keep seed.ts untouched
 */

const adapter = new PrismaPg({
  connectionString: "postgresql://investor:investor@localhost:5432/fundscout",
});

const prisma = new PrismaClient({ adapter });

/* =====================
   Helper Functions
   ===================== */

/** Find or create an investor (name is unique). Logo defaults to the website's icon. */
async function getOrCreateInvestor(data: {
  name: string;
  type: string;
  websiteUrl?: string;
  avatarUrl?: string;
}) {
  return prisma.investor.upsert({
    where: { name: data.name },
    update: {},
    create: {
      ...data,
      avatarUrl: data.avatarUrl ?? logoUrlFromWebsite(data.websiteUrl),
    },
  });
}

/** Find or create a company (name is unique). Logo defaults to the website's icon. */
async function getOrCreateCompany(data: {
  name: string;
  description?: string;
  websiteUrl?: string;
  logoUrl?: string;
  location?: string;
}) {
  return prisma.company.upsert({
    where: { name: data.name },
    update: {},
    create: {
      ...data,
      logoUrl: data.logoUrl ?? logoUrlFromWebsite(data.websiteUrl),
    },
  });
}

/** Find or create a sector */
async function getOrCreateSector(name: string) {
  return prisma.sector.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

/** Attach a sector to a company */
async function addSectorToCompany(companyId: number, sectorName: string) {
  const sector = await getOrCreateSector(sectorName);

  return prisma.companySector.upsert({
    where: {
      companyId_sectorId: {
        companyId,
        sectorId: sector.id,
      },
    },
    update: {},
    create: {
      companyId,
      sectorId: sector.id,
    },
  });
}

/**
 * Find or create an investment. The same investor, company, stage and date
 * is treated as one investment, so re-running the script won't duplicate it.
 * amount is the total round size, not the investor's own check.
 * investedAt stays null when unknown (never defaults to today).
 */
async function createInvestment(params: {
  investorId: number;
  companyId: number;
  amount?: number;
  stage?: string;
  investedAt?: Date;
}) {
  const match = {
    investorId: params.investorId,
    companyId: params.companyId,
    stage: params.stage ?? null,
    investedAt: params.investedAt ?? null,
  };

  const existing = await prisma.investment.findFirst({ where: match });
  if (existing) return existing;

  return prisma.investment.create({
    data: { ...match, amount: params.amount },
  });
}

/* =====================
   Main Script
   ===================== */

async function main() {
  /* =====================
     INVESTORS
     ===================== */

  const sequoia = await getOrCreateInvestor({
    name: "Sequoia Capital",
    type: "Venture Capital",
    websiteUrl: "https://www.sequoiacap.com",
  });

  const northzone = await getOrCreateInvestor({
    name: "Northzone",
    type: "Venture Capital",
    websiteUrl: "https://www.northzone.com",
  });

  const valar = await getOrCreateInvestor({
    name: "Valar Ventures",
    type: "Venture Capital",
    websiteUrl: "https://www.valar.com",
  });

  const luminar = await getOrCreateInvestor({
    name: "Luminar Ventures",
    type: "Venture Capital",
    websiteUrl: "https://www.luminarventures.com",
  });

  /* =====================
     COMPANIES
     ===================== */

  const stripe = await getOrCreateCompany({
    name: "Stripe",
    description: "Online payments and financial infrastructure for the internet",
    websiteUrl: "https://stripe.com",
    location: "San Francisco, CA",
  });

  const klarna = await getOrCreateCompany({
    name: "Klarna",
    description: "Buy now, pay later payments platform",
    websiteUrl: "https://www.klarna.com",
    location: "Stockholm, Sweden",
  });

  const spotify = await getOrCreateCompany({
    name: "Spotify",
    description: "Audio streaming and media services platform",
    websiteUrl: "https://spotify.com",
    location: "Stockholm, Sweden",
  });

  const wise = await getOrCreateCompany({
    name: "Wise",
    description: "International money transfer and financial services",
    websiteUrl: "https://wise.com",
    location: "London, UK",
  });

  const n26 = await getOrCreateCompany({
    name: "N26",
    description: "Mobile-first digital bank",
    websiteUrl: "https://n26.com",
    location: "Berlin, Germany",
  });

  const trustpilot = await getOrCreateCompany({
    name: "Trustpilot",
    description: "Online consumer review platform",
    websiteUrl: "https://www.trustpilot.com",
    location: "Copenhagen, Denmark",
  });

  const depop = await getOrCreateCompany({
    name: "Depop",
    description: "Social shopping app for secondhand fashion",
    websiteUrl: "https://www.depop.com",
    location: "London, UK",
  });

  /* =====================
     SECTORS
     ===================== */

  // Stripe
  await addSectorToCompany(stripe.id, "Fintech");
  await addSectorToCompany(stripe.id, "Payments");

  // Klarna
  await addSectorToCompany(klarna.id, "Fintech");
  await addSectorToCompany(klarna.id, "Consumer Finance");

  // Spotify
  await addSectorToCompany(spotify.id, "Media");
  await addSectorToCompany(spotify.id, "Entertainment");

  // Wise
  await addSectorToCompany(wise.id, "Fintech");
  await addSectorToCompany(wise.id, "Payments");

  // N26
  await addSectorToCompany(n26.id, "Fintech");
  await addSectorToCompany(n26.id, "Banking");

  // Trustpilot
  await addSectorToCompany(trustpilot.id, "SaaS");
  await addSectorToCompany(trustpilot.id, "Consumer Reviews");

  // Depop
  await addSectorToCompany(depop.id, "Marketplace");
  await addSectorToCompany(depop.id, "E-commerce");

  /* =====================
     INVESTMENTS
     ===================== */

  // Sequoia Capital
  await createInvestment({
    investorId: sequoia.id,
    companyId: stripe.id,
    stage: "Series A",
    amount: 2000000,
    investedAt: new Date("2011-03-01"),
  });

  await createInvestment({
    investorId: sequoia.id,
    companyId: klarna.id,
    stage: "Growth",
    amount: 15000000,
    investedAt: new Date("2019-10-01"),
  });

  // Northzone
  await createInvestment({
    investorId: northzone.id,
    companyId: spotify.id,
    stage: "Seed",
    amount: 150000,
    investedAt: new Date("2008-01-01"),
  });

  await createInvestment({
    investorId: northzone.id,
    companyId: klarna.id,
    stage: "Series A",
    amount: 4000000,
    investedAt: new Date("2014-05-01"),
  });

  await createInvestment({
    investorId: northzone.id,
    companyId: trustpilot.id,
    stage: "Series B",
    amount: 10000000,
    investedAt: new Date("2017-06-01"),
  });

  // Valar Ventures
  await createInvestment({
    investorId: valar.id,
    companyId: wise.id,
    stage: "Seed",
    amount: 1200000,
    investedAt: new Date("2013-01-01"),
  });

  await createInvestment({
    investorId: valar.id,
    companyId: n26.id,
    stage: "Series A",
    amount: 10000000,
    investedAt: new Date("2016-03-01"),
  });

  // Luminar Ventures
  await createInvestment({
    investorId: luminar.id,
    companyId: depop.id,
    stage: "Seed",
    amount: 500000,
    investedAt: new Date("2015-09-01"),
  });

  await createInvestment({
    investorId: luminar.id,
    companyId: trustpilot.id,
    stage: "Early Growth",
    amount: 3000000,
    investedAt: new Date("2016-04-01"),
  });

  console.log("✅ Real-life VC investment data added successfully");
}


main()
  .catch((e) => {
    console.error("❌ Script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
