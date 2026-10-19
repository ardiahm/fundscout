import {PrismaClient, Prisma} from "../lib/generated/prisma/client";
import {PrismaPg} from '@prisma/adapter-pg'
import { logoUrlFromWebsite } from "../lib/logo"
import 'dotenv/config'

const adapter = new PrismaPg({
    connectionString: "postgresql://investor:investor@localhost:5432/fundscout",
})

const prisma = new PrismaClient({
    adapter,
})

const investors: Prisma.InvestorCreateInput[] = [
    {
        name: "Sequoia Capital",
        type: "Venture Capital",
        websiteUrl: "https://www.sequoiacap.com",
    },
    {
        name: "Andreessen Horowitz",
        type: "Venture Capital",
        websiteUrl: "https://a16z.com",
    },
    {
        name: "Y Combinator",
        type: "Accelerator",
        websiteUrl: "https://www.ycombinator.com",
    },
];

const sectors = ["AI", "Fintech", "Transportation", "Enterprise Software"];

const companies: Prisma.CompanyCreateInput[] = [
  {
    name: "Stripe",
    description: "Financial infrastructure for the internet",
    websiteUrl: "https://stripe.com",
    location: "San Francisco, CA",
    sectors: {
      create: [
        { sector: { connectOrCreate: { where: { name: "Fintech" }, create: { name: "Fintech" } } } },
      ],
    },
  },
  {
    name: "Airbnb",
    description: "Global vacation rental and experiences marketplace",
    websiteUrl: "https://airbnb.com",
    location: "San Francisco, CA",
    sectors: {
      create: [
        { sector: { connectOrCreate: { where: { name: "Enterprise Software" }, create: { name: "Enterprise Software" } } } },
      ],
    },
  },
  {
    name: "OpenAI",
    description: "Artificial intelligence research & deployment",
    websiteUrl: "https://openai.com",
    location: "San Francisco, CA",
    sectors: {
      create: [
        { sector: { connectOrCreate: { where: { name: "AI" }, create: { name: "AI" } } } },
      ],
    },
  },
  {
    name: "Instacart",
    description: "Online grocery delivery platform",
    websiteUrl: "https://instacart.com",
    location: "San Francisco, CA",
    sectors: {
      create: [
        { sector: { connectOrCreate: { where: { name: "Transportation" }, create: { name: "Transportation" } } } },
      ],
    },
  },
];

export async function main() {
  console.log("🌱 Seeding database...");

  // --- Create Investors (upsert on unique name, so re-seeding is safe) ---
  const createdInvestors = [];
  for (const inv of investors) {
    const created = await prisma.investor.upsert({
      where: { name: inv.name },
      update: {},
      create: { ...inv, avatarUrl: logoUrlFromWebsite(inv.websiteUrl) },
    });
    createdInvestors.push(created);
  }

  // --- Create Companies ---
  const createdCompanies = [];
  for (const c of companies) {
    const created = await prisma.company.upsert({
      where: { name: c.name },
      update: {},
      create: { ...c, logoUrl: logoUrlFromWebsite(c.websiteUrl) },
    });
    createdCompanies.push(created);
  }

  const sequoia = createdInvestors.find((i) => i.name === "Sequoia Capital")!;
  const a16z = createdInvestors.find((i) => i.name === "Andreessen Horowitz")!;
  const yc = createdInvestors.find((i) => i.name === "Y Combinator")!;

  const stripe = createdCompanies.find((c) => c.name === "Stripe")!;
  const airbnb = createdCompanies.find((c) => c.name === "Airbnb")!;
  const openai = createdCompanies.find((c) => c.name === "OpenAI")!;
  const instacart = createdCompanies.find((c) => c.name === "Instacart")!;

  // --------------------------
  //  REAL INVESTMENTS (<10)
  // --------------------------

  const investments: Prisma.InvestmentCreateInput[] = [
    // Sequoia Investments
    {
      investor: { connect: { id: sequoia.id } },
      company: { connect: { id: stripe.id } },
      amount: 200_000_000,
      stage: "Series C",
      investedAt: new Date("2014-01-01"),
    },
    {
      investor: { connect: { id: sequoia.id } },
      company: { connect: { id: airbnb.id } },
      amount: 60_000_000,
      stage: "Series B",
      investedAt: new Date("2011-07-01"),
    },

    // a16z
    {
      investor: { connect: { id: a16z.id } },
      company: { connect: { id: stripe.id } },
      amount: 80_000_000,
      stage: "Series D",
      investedAt: new Date("2016-11-01"),
    },
    {
      investor: { connect: { id: a16z.id } },
      company: { connect: { id: openai.id } },
      amount: 50_000_000,
      stage: "Growth",
      investedAt: new Date("2019-01-01"),
    },
    {
      investor: { connect: { id: a16z.id } },
      company: { connect: { id: instacart.id } },
      amount: 44_000_000,
      stage: "Series C",
      investedAt: new Date("2014-07-01"),
    },

    // YC (seed checks)
    {
      investor: { connect: { id: yc.id } },
      company: { connect: { id: stripe.id } },
      amount: 20_000,
      stage: "Seed",
      investedAt: new Date("2010-06-01"),
    },
    {
      investor: { connect: { id: yc.id } },
      company: { connect: { id: airbnb.id } },
      amount: 20_000,
      stage: "Seed",
      investedAt: new Date("2009-01-01"),
    },
  ];

  // skip investments that already exist (same investor, company, stage, date)
  for (const inv of investments) {
    const existing = await prisma.investment.findFirst({
      where: {
        investorId: inv.investor.connect!.id,
        companyId: inv.company.connect!.id,
        stage: inv.stage,
        investedAt: inv.investedAt,
      },
    });
    if (!existing) await prisma.investment.create({ data: inv });
  }

  console.log("✅ Database seeded!");
}

main();