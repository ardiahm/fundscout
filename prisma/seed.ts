import {PrismaClient, Prisma} from "../lib/generated/prisma/client";
import {PrismaPg} from '@prisma/adapter-pg'
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
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZgsVgoz_WsKxIZ_GR4lfG0dvc3dudqXB3ow&s",
        websiteUrl: "https://www.sequoiacap.com",
    },
    {
        name: "Andreessen Horowitz",
        type: "Venture Capital",
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgRK3TGTZj124THWUwGKnRzHQAYoVtyf-4YA&s",
        websiteUrl: "https://a16z.com",
    },
    {
        name: "Y Combinator",
        type: "Accelerator",
        avatarUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAflBMVEX7ZR7////7WAD+5t77Zhr7Yxr7cDL7WQD7XAD7VQD+5N37YRT+z8D7Yhb7ayj7Xwz8j2f9spn/9fH+7ef8hVf7eUT9v6r+08X9qo78i2H8nHr+2s/9xbP9uKL7aST9ybj7dT38glL+3tT7fUr8k27+18r8ooP9tp78mXb8jWNr2rv3AAAD8UlEQVR4nO3bbVebQBQEYBJdQ95Eo0bru61W/f9/sLE5VpiBwG6IvTdnnm89rRyuE+gOS7JMRERERERERERERERERERERERERERERMSZQHo8Vn+nmS4ckSL5WMd4KAsjFlcD9GOadqgwxSOdJv+y+jQ+w/M6GKcdKb+DAy2G/Z5qouK5pxBDgce5NhHhKsQDPLNJUoj5Eg5zlvhZ6N30vJcQ+So8Sbye+ze+6SNEijDtk7AT8wsK8Tz61x8CHuPJTIRZNrzcPkSK8MbGjXQtHG0dYpjjER7nuznZNKNbPL+fkSFShDNLEdYlEBliyPDnjy0s2EpoORIZYo4fgtvRrk41UcgpxKeI64gjtFErynJagMeESBHe5bs71VTDRXqIHGFuLsLVAvyaQux8N6Rb8ZXBCOtaVNcQwz384MLOeq2sOMEJbzqeKEVopTUhblG/OoUYjuHHzLQmxC2qW4gU4bPRCOtaVJcQ6SpMfQjyDeaPFGKH2+noAX4ovnl9n+EsPkS6CmPX7N+Kznbw0hoiRXhhqjUhblFt50vV8tJWa0L8KKItRIrQxGPuDbhFbQ6RPtfmWhPiFrU5xBHem+y1JsQtatPzFroKlyaX3FXUojaFSBFabE2IW9Rj41lThKcOIqxpUc33f4xwYf02szalFtV0JVKEv80uuauoRTWFiIs8o8WXcYuqvxIDLtTttiZELao+RNztMNyaELeouqUY/avU7f//gVrUrOYmiRGabk2IantNiHQV2m5NiFoUh4gRGm9NiPeiMETaN7bemlD+2hLi8KX69w8+ljNfuEVV9wMpwntnEda0qGpIGKGH1oTG2KLKFxpF6KE1IWpR5RAxQh+tCVGLyv7ltBcR1rSor2sN/y/00prQeAIjfj5lwl5o5CXLePOnhhDxGemb0whXIcL9ZLC+1+Cq1ex2YTvqR+tbJi5a3x21JkQt6iNEfPHC0EuW8eiZ/VXBb7DFvFlkzwimWYzpVeD2/TfT6OX0twL3bpqfF/uALWoyhtLhrjUhalFHp9U/W3vJMh62qGW1ciy9R5jVvdFXNnUfYd1eVMmry9aE+I2+L3vwGV2ZvjcOaPMly3jUoj65bU2IWtQnqy9ZxqMWtea4NSHaoliz89W07dErFx8cbRe2472oga2vpm2PvtVk7Ktp2+PvhzrbLmyXQ6Ww9tW07dGGov/WBMLhHt9I/6IJ9+1Dqgn3gCb0TxP6pwn904T+aUL/NKF/mtA/TeifJvRPE/qnCf3ThP5pQv80oX+a0D9N6J8m9E8T+qcJ/dOE/mlC/8Lh2aTkYLYn3yUpCcOK/RtQRERERERERERERERERERERERERETEhj9JaS0gByT2VwAAAABJRU5ErkJggg==",
        websiteUrl: "https://www.ycombinator.com",
    },
];

const sectors = ["AI", "Fintech", "Transportation", "Enterprise Software"];

const companies: Prisma.CompanyCreateInput[] = [
  {
    name: "Stripe",
    description: "Financial infrastructure for the internet",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/4/4f/Stripe_Logo%2C_revised_2016.png",
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
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
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
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
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
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/39/Instacart_logo.png",
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

  // --- Create Investors ---
  const createdInvestors = [];
  for (const inv of investors) {
    const created = await prisma.investor.create({ data: inv });
    createdInvestors.push(created);
  }

  // --- Create Companies ---
  const createdCompanies = [];
  for (const c of companies) {
    const created = await prisma.company.create({ data: c });
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

  for (const inv of investments) {
    await prisma.investment.create({ data: inv });
  }

  console.log("✅ Database seeded!");
}

main();