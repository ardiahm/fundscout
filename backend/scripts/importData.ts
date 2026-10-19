import fs from "fs";
import path from "path";
import { z } from "zod";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { logoUrlFromWebsite } from "../lib/logo";

/**
 * ======================================
 * FundScout Bulk Import Script
 * ======================================
 *
 * Imports investor files from backend/data/investors/*.json (one file per investor).
 *
 * HOW TO USE (from backend/):
 * - Check everything without writing:  npx tsx scripts/importData.ts --dry-run
 * - Check a single file:               npx tsx scripts/importData.ts --dry-run --file data/investors/accel.json
 * - Import:                            npx tsx scripts/importData.ts
 *
 * RULES:
 * - Safe to re-run: investors and companies upsert on name, sectors on name,
 *   and an investment is skipped if the investor already has one in that company at that stage.
 * - amount is the total round size in USD (null if undisclosed), not the investor's own check.
 * - Every investment needs a sourceUrl that names the investor (kept in the JSON, not the DB).
 */

const DATA_DIR = path.resolve(__dirname, "../data/investors");

export const SECTORS = [
  // already in the DB
  "AI", "Banking", "Consumer Finance", "Consumer Reviews", "E-commerce", "Enterprise Software",
  "Entertainment", "Fintech", "Marketplace", "Media", "Payments", "SaaS", "Transportation", "Travel Services",
  // tech, software, robotics, hardware, devices
  "Developer Tools", "Cybersecurity", "Data & Analytics", "Cloud Infrastructure", "Robotics", "Hardware",
  "Consumer Electronics", "Semiconductors", "Medical Devices", "Healthtech", "Climate Tech", "Energy",
  "Aerospace", "Space", "Defense Tech", "Autonomous Vehicles", "Logistics", "Manufacturing", "IoT",
  "AR/VR", "Gaming", "Social", "Communication", "Productivity", "Edtech", "Insurtech", "Proptech",
  "HR Tech", "Legal Tech", "Crypto",
] as const;

export const STAGES = [
  "Pre-Seed", "Seed", "Series A", "Series B", "Series C", "Series D", "Series E", "Series F",
  "Early Growth", "Growth",
] as const;

export const INVESTOR_TYPES = [
  "Venture Capital", "Micro VC", "Accelerator", "Angel", "Corporate VC", "Growth Equity",
] as const;

const US_STATES = new Set(
  ("AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM " +
    "NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY").split(" "),
);

const TODAY = new Date();

const usLocation = z
  .string()
  .regex(/^[A-Za-z .'-]+, [A-Z]{2}$/, 'Location must look like "City, ST"')
  .refine((loc) => US_STATES.has(loc.slice(-2)), "Location must be in a US state");

// "YYYY-MM-DD" or "YYYY-MM" (stored as the first of the month); null if unknown
const roundDate = z
  .string()
  .regex(/^\d{4}-\d{2}(-\d{2})?$/, 'Date must be "YYYY-MM-DD" or "YYYY-MM"')
  .refine((d) => {
    const date = toDate(d);
    return !Number.isNaN(date.getTime()) && date.getUTCFullYear() >= 1995 && date <= TODAY;
  }, "Date must be a real date between 1995 and today")
  .nullable();

const CompanySchema = z.object({
  name: z.string().min(1).max(80),
  description: z.string().min(10).max(160),
  websiteUrl: z.url(),
  location: usLocation,
  sectors: z.array(z.enum(SECTORS)).min(1).max(3),
});

const InvestmentSchema = z.object({
  company: CompanySchema,
  stage: z.enum(STAGES),
  amount: z.number().positive().max(50_000_000_000).nullable(),
  investedAt: roundDate,
  sourceUrl: z.url(),
});

export const InvestorFileSchema = z.object({
  investor: z.object({
    name: z.string().min(1).max(80),
    type: z.enum(INVESTOR_TYPES),
    websiteUrl: z.url(),
    // optional hand-picked logo, for sites whose favicon is too low-res
    avatarUrl: z.url().optional(),
  }),
  // optional note, e.g. why there are fewer than 10 investments
  notes: z.string().optional(),
  investments: z.array(InvestmentSchema).min(1),
});

type InvestorFile = z.infer<typeof InvestorFileSchema>;

function toDate(value: string) {
  return new Date(value.length === 7 ? `${value}-01T00:00:00Z` : `${value}T00:00:00Z`);
}

/* =====================
   Load + validate
   ===================== */

function loadFiles(onlyFile?: string) {
  const files = onlyFile
    ? [path.resolve(onlyFile)]
    : fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json")).sort().map((f) => path.join(DATA_DIR, f));

  const valid: { file: string; data: InvestorFile }[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const label = path.basename(file);
    let raw: unknown;
    try {
      raw = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (e) {
      errors.push(`${label}: invalid JSON (${(e as Error).message})`);
      continue;
    }

    const result = InvestorFileSchema.safeParse(raw);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(`${label}: ${issue.path.join(".")}: ${issue.message}`);
      }
      continue;
    }

    // duplicates inside one file (same company + stage)
    const seen = new Set<string>();
    for (const inv of result.data.investments) {
      const key = `${inv.company.name.toLowerCase()}|${inv.stage}`;
      if (seen.has(key)) errors.push(`${label}: duplicate investment ${inv.company.name} (${inv.stage})`);
      seen.add(key);
    }

    valid.push({ file: label, data: result.data });
  }

  return { valid, errors };
}

/* =====================
   Import
   ===================== */

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const fileArg = args.includes("--file") ? args[args.indexOf("--file") + 1] : undefined;

  const { valid, errors } = loadFiles(fileArg);

  // the same company described differently across files
  const companyWebsites = new Map<string, { website: string; file: string }>();
  const warnings: string[] = [];
  for (const { file, data } of valid) {
    for (const inv of data.investments) {
      const key = inv.company.name.toLowerCase();
      const seen = companyWebsites.get(key);
      const host = new URL(inv.company.websiteUrl).hostname.replace(/^www\./, "");
      if (seen && seen.website !== host) {
        warnings.push(`${inv.company.name}: website ${host} in ${file} vs ${seen.website} in ${seen.file}`);
      } else if (!seen) {
        companyWebsites.set(key, { website: host, file });
      }
    }
  }

  if (errors.length) {
    console.error(`❌ ${errors.length} validation error(s):\n  ` + errors.join("\n  "));
    process.exit(1);
  }

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL ?? "postgresql://investor:investor@localhost:5432/fundscout",
  });
  const prisma = new PrismaClient({ adapter });

  const stats = { investorsNew: 0, investmentsNew: 0, investmentsSkipped: 0 };
  const newCompanies = new Set<string>();
  const stageCounts: Record<string, number> = {};
  const sectorCounts: Record<string, number> = {};

  try {
    for (const { file, data } of valid) {
      const existingInvestor = await prisma.investor.findFirst({
        where: { name: { equals: data.investor.name, mode: "insensitive" } },
      });
      if (!existingInvestor) stats.investorsNew++;

      const investor = dryRun
        ? existingInvestor
        : existingInvestor ??
          (await prisma.investor.create({
            data: {
              ...data.investor,
              avatarUrl: data.investor.avatarUrl ?? logoUrlFromWebsite(data.investor.websiteUrl),
            },
          }));

      let fileNew = 0;
      let fileSkipped = 0;

      for (const inv of data.investments) {
        stageCounts[inv.stage] = (stageCounts[inv.stage] ?? 0) + 1;
        for (const s of inv.company.sectors) sectorCounts[s] = (sectorCounts[s] ?? 0) + 1;

        const existingCompany = await prisma.company.findFirst({
          where: { name: { equals: inv.company.name, mode: "insensitive" } },
        });
        if (!existingCompany) newCompanies.add(inv.company.name.toLowerCase());

        const existingInvestment =
          investor && existingCompany
            ? await prisma.investment.findFirst({
                where: { investorId: investor.id, companyId: existingCompany.id, stage: inv.stage },
              })
            : null;

        if (existingInvestment) {
          fileSkipped++;
          continue;
        }
        fileNew++;
        if (dryRun) continue;

        const { sectors, ...companyData } = inv.company;
        const company =
          existingCompany ??
          (await prisma.company.create({
            data: { ...companyData, logoUrl: logoUrlFromWebsite(companyData.websiteUrl) },
          }));

        for (const sectorName of sectors) {
          const sector = await prisma.sector.upsert({
            where: { name: sectorName },
            update: {},
            create: { name: sectorName },
          });
          await prisma.companySector.upsert({
            where: { companyId_sectorId: { companyId: company.id, sectorId: sector.id } },
            update: {},
            create: { companyId: company.id, sectorId: sector.id },
          });
        }

        await prisma.investment.create({
          data: {
            investorId: investor!.id,
            companyId: company.id,
            stage: inv.stage,
            amount: inv.amount,
            investedAt: inv.investedAt ? toDate(inv.investedAt) : null,
          },
        });
      }

      stats.investmentsNew += fileNew;
      stats.investmentsSkipped += fileSkipped;
      console.log(
        `${dryRun ? "[dry run] " : ""}${file}: ${data.investor.name}${existingInvestor ? "" : " (new)"}: ` +
          `${fileNew} new, ${fileSkipped} already in DB${data.notes ? `. Note: ${data.notes}` : ""}`,
      );
    }
  } finally {
    await prisma.$disconnect();
  }

  if (warnings.length) console.warn(`⚠️  ${warnings.length} warning(s):\n  ` + warnings.join("\n  "));

  const fmt = (counts: Record<string, number>) =>
    Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(", ");
  console.log(`Stages: ${fmt(stageCounts)}`);
  console.log(`Sectors: ${fmt(sectorCounts)}`);
  console.log(
    `${dryRun ? "✅ Dry run passed. Would add" : "✅ Imported"}: ${stats.investorsNew} investors, ` +
      `${newCompanies.size} companies, ` +
      `${stats.investmentsNew} investments; skipped ${stats.investmentsSkipped} already in DB`,
  );
}

main().catch((e) => {
  console.error("❌ Import failed:", e);
  process.exit(1);
});
