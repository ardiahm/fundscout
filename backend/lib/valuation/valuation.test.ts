import { describe, expect, it } from "vitest";
import { ValuationStage } from "@/backend/lib/generated/prisma/enums";
import {
  annualGrowth,
  berkusMethod,
  computeValuation,
  ratingMultiplier,
  revenueMultiple,
  scorecardMethod,
  targetDilutionMethod,
  type ValuationInputs,
} from "./methods";
import { dedupeRounds, pickComparables, quantile, type RoundRow } from "./comparables";
import type { Comparables } from "@/backend/types/valuation";

const preRevenueSeed: ValuationInputs = {
  companyName: "Acme",
  stage: ValuationStage.SEED,
  sector: "Fintech",
  raiseAmount: 2_000_000,
  hasRevenue: false,
  monthlyRevenue: null,
  monthlyGrowth: null,
  grossMargin: null,
  teamRating: 3,
  marketRating: 3,
  productRating: 3,
  competitionRating: 3,
  tractionRating: 3,
};

const revenueSeriesA: ValuationInputs = {
  ...preRevenueSeed,
  stage: ValuationStage.SERIES_A,
  raiseAmount: 10_000_000,
  hasRevenue: true,
  monthlyRevenue: 100_000,
  monthlyGrowth: 10,
  grossMargin: 75,
};

// a $4M median round: 4M * 0.8 / 0.2 = $16M pre-money
const comparables: Comparables = {
  source: "stage",
  stageLabel: "Seed",
  sector: null,
  sampleSize: 12,
  medianRound: 4_000_000,
  p25Round: 2_000_000,
  p75Round: 6_000_000,
  examples: [],
};

function row(companyId: number, amount: number, date: string | null): RoundRow {
  return {
    companyId,
    companyName: `Company ${companyId}`,
    amount,
    investedAt: date ? new Date(date) : null,
  };
}

describe("comparables", () => {
  it("keeps one row per company and date, since each investor gets a row", () => {
    const rows = [
      row(1, 5_000_000, "2025-03-01"),
      row(1, 5_000_000, "2025-03-01"),
      row(1, 9_000_000, "2026-01-10"),
      row(2, 3_000_000, null),
    ];

    expect(dedupeRounds(rows)).toHaveLength(3);
  });

  it("interpolates quantiles", () => {
    expect(quantile([1, 2, 3, 4], 0.5)).toBe(2.5);
    expect(quantile([10], 0.25)).toBe(10);
    expect(quantile([], 0.5)).toBe(0);
  });

  it("uses the sector sample when it has enough rounds", () => {
    const sectorRows = [1, 2, 3, 4, 5].map((id) => row(id, id * 1_000_000, "2025-01-01"));
    const result = pickComparables({
      stage: ValuationStage.SEED,
      sector: "Fintech",
      sectorRows,
      stageRows: sectorRows,
    });

    expect(result.source).toBe("stage-and-sector");
    expect(result.sector).toBe("Fintech");
    expect(result.medianRound).toBe(3_000_000);
    expect(result.examples).toHaveLength(5);
  });

  it("falls back to the stage, then to a benchmark", () => {
    const stageRows = [1, 2, 3, 4, 5, 6].map((id) => row(id, 2_000_000, "2025-01-01"));

    const stageOnly = pickComparables({
      stage: ValuationStage.SEED,
      sector: "Fintech",
      sectorRows: stageRows.slice(0, 2),
      stageRows,
    });
    expect(stageOnly.source).toBe("stage");
    expect(stageOnly.sector).toBeNull();

    const benchmark = pickComparables({
      stage: ValuationStage.PRE_SEED,
      sector: "Fintech",
      sectorRows: [],
      stageRows: stageRows.slice(0, 3),
    });
    expect(benchmark.source).toBe("benchmark");
    expect(benchmark.medianRound).toBe(1_000_000);
    expect(benchmark.sampleSize).toBe(3);
  });
});

describe("methods", () => {
  it("maps ratings 1-5 to 0.5x-1.5x", () => {
    expect(ratingMultiplier(1)).toBe(0.5);
    expect(ratingMultiplier(3)).toBe(1);
    expect(ratingMultiplier(5)).toBe(1.5);
  });

  it("scorecard returns the baseline for an all-average startup", () => {
    expect(scorecardMethod(preRevenueSeed, 16_000_000).value).toBe(16_000_000);
  });

  it("berkus caps at five times the factor max", () => {
    const allFives = {
      ...preRevenueSeed,
      teamRating: 5,
      marketRating: 5,
      productRating: 5,
      competitionRating: 5,
      tractionRating: 5,
    };

    expect(berkusMethod(allFives)?.value).toBe(10_000_000);
    expect(berkusMethod({ ...allFives, stage: ValuationStage.PRE_SEED })?.value).toBe(5_000_000);
  });

  it("berkus is skipped for revenue startups, later stages and all-1 ratings", () => {
    expect(berkusMethod(revenueSeriesA)).toBeNull();
    expect(berkusMethod({ ...preRevenueSeed, stage: ValuationStage.SERIES_A })).toBeNull();

    const allOnes = {
      ...preRevenueSeed,
      teamRating: 1,
      marketRating: 1,
      productRating: 1,
      competitionRating: 1,
      tractionRating: 1,
    };
    expect(berkusMethod(allOnes)).toBeNull();
  });

  it("compounds monthly growth and picks a multiple band", () => {
    expect(annualGrowth(0)).toBe(0);
    expect(annualGrowth(10)).toBeCloseTo(2.138, 3);

    expect(revenueMultiple(0.1, 50)).toBe(4);
    expect(revenueMultiple(2.138, 50)).toBe(18);
    expect(revenueMultiple(2.138, 75)).toBeCloseTo(21.6);
    expect(revenueMultiple(0.1, 30)).toBeCloseTo(3.2);
  });

  it("turns the raise into a pre-money at the stage's usual dilution", () => {
    expect(targetDilutionMethod(preRevenueSeed).value).toBe(8_000_000);
  });
});

describe("computeValuation", () => {
  it("pre-revenue Seed uses comparables, scorecard, berkus and the raise", () => {
    const result = computeValuation(preRevenueSeed, comparables);

    expect(result.methods.map((m) => m.key)).toEqual([
      "comparables",
      "scorecard",
      "berkus",
      "targetDilution",
    ]);
    // berkus 5M, raise 8M, comparables 16M, scorecard 16M
    expect(result.low).toBe(5_000_000);
    expect(result.mid).toBe(12_000_000);
    expect(result.high).toBe(16_000_000);
  });

  it("revenue Series A swaps berkus for a revenue multiple", () => {
    const result = computeValuation(revenueSeriesA, comparables);

    expect(result.methods.map((m) => m.key)).toEqual([
      "comparables",
      "scorecard",
      "revenueMultiple",
      "targetDilution",
    ]);
    // $1.2M ARR x 21.6
    expect(result.methods.find((m) => m.key === "revenueMultiple")?.value).toBe(25_900_000);
    expect(result.low).toBeLessThanOrEqual(result.mid);
    expect(result.mid).toBeLessThanOrEqual(result.high);
  });

  it("gives the same answer for the same inputs", () => {
    expect(computeValuation(preRevenueSeed, comparables)).toEqual(
      computeValuation(preRevenueSeed, comparables),
    );
  });
});
