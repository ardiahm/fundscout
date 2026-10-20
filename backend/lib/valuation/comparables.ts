import { ValuationStage } from "@/backend/lib/generated/prisma/enums";
import {
  BENCHMARK_ROUND_SIZE,
  BLEND_PRIOR_ROUNDS,
  MIN_COMPARABLE_ROUNDS,
  valuationStageLabels,
} from "@/backend/constants/valuation";
import type { ComparableRound, Comparables } from "@/backend/types/valuation";

// one row per investor in a round, as stored in the Investment table
export type RoundRow = {
  companyId: number;
  companyName: string;
  amount: number;
  investedAt: Date | null;
};

// the same round is stored once per investor, so keep one row per company and date
export function dedupeRounds(rows: RoundRow[]): RoundRow[] {
  const seen = new Map<string, RoundRow>();

  for (const row of rows) {
    const date = row.investedAt ? row.investedAt.toISOString().slice(0, 10) : "undated";
    const key = `${row.companyId}|${date}`;

    if (!seen.has(key)) seen.set(key, row);
  }

  return [...seen.values()];
}

// linear interpolation between the two closest values
export function quantile(sortedValues: number[], q: number): number {
  if (sortedValues.length === 0) return 0;

  const position = (sortedValues.length - 1) * q;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  const weight = position - lower;

  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

function mostRecent(rows: RoundRow[], count = 5): ComparableRound[] {
  return [...rows]
    .sort((a, b) => (b.investedAt?.getTime() ?? 0) - (a.investedAt?.getTime() ?? 0))
    .slice(0, count)
    .map((row) => ({
      companyName: row.companyName,
      amount: row.amount,
      investedAt: row.investedAt ? row.investedAt.toISOString() : null,
    }));
}

function summarize(rows: RoundRow[]) {
  const amounts = rows.map((row) => row.amount).sort((a, b) => a - b);

  return {
    sampleSize: rows.length,
    medianRound: quantile(amounts, 0.5),
    p25Round: quantile(amounts, 0.25),
    p75Round: quantile(amounts, 0.75),
    examples: mostRecent(rows),
  };
}

// trust FundScout more the more rounds it has, the benchmark otherwise
export function blendWithBenchmark(stage: ValuationStage, medianRound: number, sampleSize: number) {
  const fundScoutShare = sampleSize / (sampleSize + BLEND_PRIOR_ROUNDS);
  const benchmark = BENCHMARK_ROUND_SIZE[stage];

  return {
    blendedRound: fundScoutShare * medianRound + (1 - fundScoutShare) * benchmark,
    fundScoutShare,
  };
}

// use the most specific sample with enough rounds: stage + sector, then stage, then a benchmark
export function pickComparables({
  stage,
  sector,
  sectorRows,
  stageRows,
}: {
  stage: ValuationStage;
  sector: string;
  sectorRows: RoundRow[];
  stageRows: RoundRow[];
}): Comparables {
  const stageLabel = valuationStageLabels[stage];
  const sectorRounds = dedupeRounds(sectorRows);
  const stageRounds = dedupeRounds(stageRows);

  if (sectorRounds.length >= MIN_COMPARABLE_ROUNDS) {
    const summary = summarize(sectorRounds);
    return {
      source: "stage-and-sector",
      stageLabel,
      sector,
      ...summary,
      ...blendWithBenchmark(stage, summary.medianRound, summary.sampleSize),
    };
  }

  if (stageRounds.length >= MIN_COMPARABLE_ROUNDS) {
    const summary = summarize(stageRounds);
    return {
      source: "stage",
      stageLabel,
      sector: null,
      ...summary,
      ...blendWithBenchmark(stage, summary.medianRound, summary.sampleSize),
    };
  }

  const benchmark = BENCHMARK_ROUND_SIZE[stage];

  return {
    source: "benchmark",
    stageLabel,
    sector: null,
    sampleSize: stageRounds.length,
    medianRound: benchmark,
    p25Round: benchmark * 0.6,
    p75Round: benchmark * 1.5,
    blendedRound: benchmark,
    fundScoutShare: 0,
    // still show whatever real rounds we have
    examples: mostRecent(stageRounds),
  };
}
