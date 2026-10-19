import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { logoUrlFromWebsite } from "../lib/logo";

/**
 * ======================================
 * FundScout Logo Refresh Script
 * ======================================
 *
 * Replaces investor avatars and company logos with the icon from their
 * website (see lib/logo.ts). Rows without a websiteUrl are left alone, and so are
 * hand-picked logos (any URL that isn't a website-derived icon), e.g. Techstars.
 *
 * Safe to re-run. Run from backend/ with: npx tsx scripts/refreshLogos.ts
 */

const adapter = new PrismaPg({
  connectionString: "postgresql://investor:investor@localhost:5432/fundscout",
});

const prisma = new PrismaClient({ adapter });

// a logo set by hand rather than derived from the website's favicon
function isCustomLogo(url: string | null) {
  return !!url && !url.startsWith("https://www.google.com/s2/favicons");
}

async function main() {
  const investors = await prisma.investor.findMany();
  let investorsUpdated = 0;

  for (const investor of investors) {
    const avatarUrl = logoUrlFromWebsite(investor.websiteUrl);
    if (!avatarUrl || avatarUrl === investor.avatarUrl || isCustomLogo(investor.avatarUrl)) continue;

    await prisma.investor.update({
      where: { id: investor.id },
      data: { avatarUrl },
    });
    investorsUpdated++;
  }

  const companies = await prisma.company.findMany();
  let companiesUpdated = 0;

  for (const company of companies) {
    const logoUrl = logoUrlFromWebsite(company.websiteUrl);
    if (!logoUrl || logoUrl === company.logoUrl || isCustomLogo(company.logoUrl)) continue;

    await prisma.company.update({
      where: { id: company.id },
      data: { logoUrl },
    });
    companiesUpdated++;
  }

  console.log(
    `✅ Logos refreshed: ${investorsUpdated}/${investors.length} investors, ${companiesUpdated}/${companies.length} companies`,
  );
}

main()
  .catch((e) => {
    console.error("❌ Script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
