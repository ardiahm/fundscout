import { prisma } from "@/backend/lib/prisma";
import { unstable_cache } from "next/cache";
import { ValuationStage } from "@/backend/lib/generated/prisma/enums";
import { valuationStageLabels } from "@/backend/constants/valuation";
import { pickComparables, type RoundRow } from "@/backend/lib/valuation/comparables";
import type { Comparables } from "@/backend/types/valuation";

type CachedRound = Omit<RoundRow, "investedAt"> & {
  // the cache stores JSON, so dates come back as strings
  investedAt: string | null;
  sectors: string[];
};

// bump the key after importing new investments, like the investor summaries cache
const getRoundsForStage = unstable_cache(
  async (stageLabel: string): Promise<CachedRound[]> => {
    const investments = await prisma.investment.findMany({
      where: { stage: stageLabel, amount: { not: null } },
      select: {
        companyId: true,
        amount: true,
        investedAt: true,
        company: {
          select: {
            name: true,
            sectors: { select: { sector: { select: { name: true } } } },
          },
        },
      },
    });

    return investments.map((investment) => ({
      companyId: investment.companyId,
      companyName: investment.company.name,
      amount: investment.amount!,
      investedAt: investment.investedAt?.toISOString() ?? null,
      sectors: investment.company.sectors.map((s) => s.sector.name),
    }));
  },
  ["valuation-comparables-v1"],
  { revalidate: 3600 },
);

export async function getComparables(
  stage: ValuationStage,
  sector: string,
): Promise<Comparables> {
  const rounds = await getRoundsForStage(valuationStageLabels[stage]);

  const toRow = (round: CachedRound): RoundRow => ({
    companyId: round.companyId,
    companyName: round.companyName,
    amount: round.amount,
    investedAt: round.investedAt ? new Date(round.investedAt) : null,
  });

  return pickComparables({
    stage,
    sector,
    sectorRows: rounds.filter((round) => round.sectors.includes(sector)).map(toRow),
    stageRows: rounds.map(toRow),
  });
}

// sector names for the form's dropdown, and to check submissions against
export const getSectorNames = unstable_cache(
  async (): Promise<string[]> => {
    const sectors = await prisma.sector.findMany({
      select: { name: true },
      orderBy: { name: "asc" },
    });

    return sectors.map((sector) => sector.name);
  },
  ["valuation-sectors-v1"],
  { revalidate: 3600 },
);
