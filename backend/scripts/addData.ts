import {PrismaClient} from "../lib/generated/prisma/client"
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

/* =====================
   Helper Functions
   ===================== */

/** Find or create an investor */
async function getOrCreateInvestor(data: {
  name: string;
  type: string;
  websiteUrl?: string;
  avatarUrl?: string;
}) {
  const existing = await prisma.investor.findFirst({
    where: { name: data.name },
  });

  if (existing) return existing;

  return prisma.investor.create({ data });
}

/** Find or create a company */
async function getOrCreateCompany(data: {
  name: string;
  description?: string;
  websiteUrl?: string;
  logoUrl?: string;
  location?: string;
}) {
  const existing = await prisma.company.findFirst({
    where: { name: data.name },
  });

  if (existing) return existing;

  return prisma.company.create({ data });
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

  const existing = await prisma.companySector.findFirst({
    where: {
      companyId,
      sectorId: sector.id,
    },
  });

  if (existing) return existing;

  return prisma.companySector.create({
    data: {
      companyId,
      sectorId: sector.id,
    },
  });
}

/** Create an investment */
async function createInvestment(params: {
  investorId: number;
  companyId: number;
  amount?: number;
  stage?: string;
  investedAt?: Date;
}) {
  return prisma.investment.create({
    data: {
      investorId: params.investorId,
      companyId: params.companyId,
      amount: params.amount,
      stage: params.stage,
      investedAt: params.investedAt ?? new Date(),
    },
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
    avatarUrl: "https://imagedelivery.net/jrR6kyj1O2ZmsraydueP7w/cb1dff3d-84b7-4a68-6f7d-438e13790300/public"
  });

  const valar = await getOrCreateInvestor({
    name: "Valar Ventures",
    type: "Venture Capital",
    websiteUrl: "https://www.valar.com",
    avatarUrl: "https://cdn.prod.website-files.com/6368d53a1a07d773698447c6/662f7a2f173499f8bf04e77f_65cae6ac7e68c72f5d60db1e_Exit%2520(14).jpeg"
  });

  const luminar = await getOrCreateInvestor({
    name: "Luminar Ventures",
    type: "Venture Capital",
    websiteUrl: "https://www.luminarventures.com",
    avatarUrl: "https://media.licdn.com/dms/image/v2/D4D0BAQHVV7r93GB_KA/company-logo_200_200/company-logo_200_200/0/1723106984809/luminar_ventures_logo?e=2147483647&v=beta&t=SWtwFDs5KDnhFGm0f0gFLlWRIz1yI7c7958KPkqWouA"
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
    logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwNflG1aiinrvf27uFevZrJqMEijybml_mOg&s"
  });

  const spotify = await getOrCreateCompany({
    name: "Spotify",
    description: "Audio streaming and media services platform",
    websiteUrl: "https://spotify.com",
    location: "Stockholm, Sweden",
    logoUrl: "https://s3-alpha.figma.com/hub/file/2734964093/9f5edc36-eb4d-414a-8447-10514f2bc224-cover.png"
  });

  const wise = await getOrCreateCompany({
    name: "Wise",
    description: "International money transfer and financial services",
    websiteUrl: "https://wise.com",
    location: "London, UK",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Wise_logo_light-on-dark.png"
  });

  const n26 = await getOrCreateCompany({
    name: "N26",
    description: "Mobile-first digital bank",
    websiteUrl: "https://n26.com",
    location: "Berlin, Germany",
    logoUrl: "https://images.ctfassets.net/q33z48p65a6w/42Hvr3OYJgxAEdzoB2quix/83aedba1d73629c9953b615197915ac6/N26_Newsroom___N26_Logo_Thumbnail.png"
  });

  const trustpilot = await getOrCreateCompany({
    name: "Trustpilot",
    description: "Online consumer review platform",
    websiteUrl: "https://www.trustpilot.com",
    location: "Copenhagen, Denmark",
    logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThCOd3ntp5NXraRhl4aDopdp50Fn-ZqmqMpg&s"
  });

  const depop = await getOrCreateCompany({
    name: "Depop",
    description: "Social shopping app for secondhand fashion",
    websiteUrl: "https://www.depop.com",
    location: "London, UK",
    logoUrl: "https://www.eu-startups.com/wp-content/uploads/2020/03/20233103_1407119056046234_6506472858770742188_o-500x500.png"
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
